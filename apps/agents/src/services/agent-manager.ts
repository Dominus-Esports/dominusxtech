import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentType, AgentStatus, Task, TaskStatus, AgentMessage, MessageType, AgentMetrics, SystemHealth } from '../types';
import { Logger } from '../utils/logger';

export class AgentManager extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private metrics: Map<string, AgentMetrics> = new Map();
  private logger: Logger;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.logger = new Logger('AgentManager');
    this.startHeartbeat();
  }

  // Agent Management
  public registerAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'lastActive'>): Agent {
    const id = uuidv4();
    const newAgent: Agent = {
      ...agent,
      id,
      createdAt: new Date(),
      lastActive: new Date()
    };

    this.agents.set(id, newAgent);
    this.metrics.set(id, {
      agentId: id,
      tasksCompleted: 0,
      tasksFailed: 0,
      averageResponseTime: 0,
      uptime: 0,
      lastHealthCheck: new Date()
    });

    this.logger.info(`Agent registered: ${newAgent.name} (${id})`);
    this.emit('agent:registered', newAgent);
    
    return newAgent;
  }

  public unregisterAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      this.logger.warn(`Agent not found: ${agentId}`);
      return false;
    }

    this.agents.delete(agentId);
    this.metrics.delete(agentId);
    this.logger.info(`Agent unregistered: ${agent.name} (${agentId})`);
    this.emit('agent:unregistered', agent);
    
    return true;
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getAgentsByType(type: AgentType): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.type === type);
  }

  public updateAgentStatus(agentId: string, status: AgentStatus): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    agent.status = status;
    agent.lastActive = new Date();
    this.agents.set(agentId, agent);
    
    this.logger.info(`Agent status updated: ${agent.name} -> ${status}`);
    this.emit('agent:status_updated', agent);
    
    return true;
  }

  // Task Management
  public createTask(agentId: string, type: string, payload: any, priority: number = 1): Task {
    const task: Task = {
      id: uuidv4(),
      agentId,
      type: type as any,
      status: TaskStatus.PENDING,
      payload,
      createdAt: new Date(),
      priority
    };

    this.tasks.set(task.id, task);
    this.logger.info(`Task created: ${task.id} for agent ${agentId}`);
    this.emit('task:created', task);
    
    return task;
  }

  public assignTask(taskId: string, agentId: string): boolean {
    const task = this.tasks.get(taskId);
    const agent = this.agents.get(agentId);

    if (!task || !agent) {
      return false;
    }

    if (agent.status === AgentStatus.OFFLINE || agent.status === AgentStatus.ERROR) {
      this.logger.warn(`Cannot assign task to offline agent: ${agent.name}`);
      return false;
    }

    task.agentId = agentId;
    task.status = TaskStatus.RUNNING;
    task.startedAt = new Date();
    this.tasks.set(taskId, task);

    this.updateAgentStatus(agentId, AgentStatus.BUSY);
    this.logger.info(`Task assigned: ${taskId} to ${agent.name}`);
    this.emit('task:assigned', task);
    
    return true;
  }

  public completeTask(taskId: string, result: any): boolean {
    const task = this.tasks.get(taskId);
    if (!task) {
      return false;
    }

    task.status = TaskStatus.COMPLETED;
    task.result = result;
    task.completedAt = new Date();
    this.tasks.set(taskId, task);

    const agent = this.agents.get(task.agentId);
    if (agent) {
      this.updateAgentStatus(task.agentId, AgentStatus.IDLE);
      this.updateMetrics(task.agentId, true);
    }

    this.logger.info(`Task completed: ${taskId}`);
    this.emit('task:completed', task);
    
    return true;
  }

  public failTask(taskId: string, error: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) {
      return false;
    }

    task.status = TaskStatus.FAILED;
    task.error = error;
    task.completedAt = new Date();
    this.tasks.set(taskId, task);

    const agent = this.agents.get(task.agentId);
    if (agent) {
      this.updateAgentStatus(task.agentId, AgentStatus.IDLE);
      this.updateMetrics(task.agentId, false);
    }

    this.logger.error(`Task failed: ${taskId} - ${error}`);
    this.emit('task:failed', task);
    
    return true;
  }

  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  public getTasksByAgent(agentId: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  public getPendingTasks(): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.status === TaskStatus.PENDING);
  }

  // Metrics and Health
  private updateMetrics(agentId: string, success: boolean): void {
    const metrics = this.metrics.get(agentId);
    if (!metrics) return;

    if (success) {
      metrics.tasksCompleted++;
    } else {
      metrics.tasksFailed++;
    }

    metrics.lastHealthCheck = new Date();
    this.metrics.set(agentId, metrics);
  }

  public getAgentMetrics(agentId: string): AgentMetrics | undefined {
    return this.metrics.get(agentId);
  }

  public getSystemHealth(): SystemHealth {
    const totalAgents = this.agents.size;
    const activeAgents = Array.from(this.agents.values()).filter(
      agent => agent.status !== AgentStatus.OFFLINE && agent.status !== AgentStatus.ERROR
    ).length;
    const totalTasks = this.tasks.size;
    const pendingTasks = this.getPendingTasks().length;

    return {
      totalAgents,
      activeAgents,
      totalTasks,
      pendingTasks,
      systemLoad: pendingTasks / Math.max(activeAgents, 1),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      cpuUsage: process.cpuUsage().user / 1000000
    };
  }

  // Communication
  public sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): AgentMessage {
    const fullMessage: AgentMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };

    this.logger.info(`Message sent: ${message.type} from ${message.from} to ${message.to}`);
    this.emit('message:sent', fullMessage);
    
    return fullMessage;
  }

  public broadcastMessage(type: MessageType, payload: any, from: string): AgentMessage[] {
    const messages: AgentMessage[] = [];
    
    for (const agent of this.agents.values()) {
      if (agent.status !== AgentStatus.OFFLINE) {
        const message = this.sendMessage({
          from,
          to: agent.id,
          type,
          payload,
          priority: 1
        });
        messages.push(message);
      }
    }

    return messages;
  }

  // Heartbeat and Health Checks
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000); // 30 seconds
  }

  private performHealthChecks(): void {
    const now = new Date();
    
    for (const [agentId, agent] of this.agents) {
      const timeSinceLastActive = now.getTime() - agent.lastActive.getTime();
      
      // Mark agent as offline if no activity for 2 minutes
      if (timeSinceLastActive > 120000 && agent.status !== AgentStatus.OFFLINE) {
        this.updateAgentStatus(agentId, AgentStatus.OFFLINE);
        this.logger.warn(`Agent marked as offline due to inactivity: ${agent.name}`);
      }
    }
  }

  public stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.logger.info('AgentManager stopped');
  }

  // Utility methods
  public getAvailableAgents(): Agent[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.status === AgentStatus.IDLE || agent.status === AgentStatus.ACTIVE
    );
  }

  public getAgentCount(): number {
    return this.agents.size;
  }

  public getTaskCount(): number {
    return this.tasks.size;
  }
}