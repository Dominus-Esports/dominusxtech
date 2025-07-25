export interface Agent {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'specialized';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  currentTask?: string;
  lastActivity: Date;
  config: AgentConfig;
  performance: PerformanceMetrics;
  collaboration: CollaborationSettings;
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  autoRestart: boolean;
  priority: 'high' | 'medium' | 'low';
  allowedDomains: string[];
  customSettings: Record<string, any>;
  collaborationMode: 'independent' | 'collaborative' | 'supervised';
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  averageTaskTime: number;
  successRate: number;
  lastOptimization: Date;
  efficiencyScore: number;
}

export interface CollaborationSettings {
  canCollaborate: boolean;
  preferredPartners: string[];
  collaborationHistory: CollaborationEvent[];
  trustScore: number;
}

export interface CollaborationEvent {
  agentId: string;
  taskId: string;
  collaborationType: 'shared' | 'handoff' | 'review';
  timestamp: Date;
  success: boolean;
}

export interface Task {
  id: string;
  agentId: string;
  type: 'code_review' | 'testing' | 'documentation' | 'optimization' | 'debugging' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  description: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
  dependencies?: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  collaboration?: {
    collaboratingAgents: string[];
    sharedResources: string[];
    communicationLog: CommunicationEvent[];
  };
}

export interface CommunicationEvent {
  fromAgent: string;
  toAgent: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'request' | 'response' | 'error';
}

class AgentService {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private taskQueue: Task[] = [];
  private isRunning = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private collaborationNetwork: Map<string, Set<string>> = new Map();
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();

  constructor() {
    this.initializeSOL();
    this.startBackgroundProcessor();
    this.startPerformanceOptimizer();
  }

  private initializeSOL() {
    // Initialize S.O.L. as the primary agent with enhanced capabilities
    const solAgent: Agent = {
      id: 'sol-primary',
      name: 'S.O.L.',
      type: 'primary',
      status: 'active',
      capabilities: [
        'code_review',
        'testing',
        'documentation',
        'optimization',
        'debugging',
        'architecture_design',
        'performance_analysis',
        'code_generation',
        'refactoring',
        'security_audit'
      ],
      lastActivity: new Date(),
      config: {
        maxConcurrentTasks: 5,
        autoRestart: true,
        priority: 'high',
        allowedDomains: ['*'],
        collaborationMode: 'supervised',
        customSettings: {
          preferredLanguage: 'typescript',
          codeStyle: 'modern',
          documentationStyle: 'comprehensive',
          aiAssistance: true,
          autoOptimization: true
        }
      },
      performance: {
        tasksCompleted: 0,
        tasksFailed: 0,
        averageTaskTime: 0,
        successRate: 100,
        lastOptimization: new Date(),
        efficiencyScore: 95
      },
      collaboration: {
        canCollaborate: true,
        preferredPartners: [],
        collaborationHistory: [],
        trustScore: 100
      }
    };

    this.agents.set(solAgent.id, solAgent);
    this.emit('agentAdded', solAgent);
  }

  public addAgent(agent: Omit<Agent, 'id' | 'lastActivity' | 'performance' | 'collaboration'>): string {
    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAgent: Agent = {
      ...agent,
      id,
      lastActivity: new Date(),
      performance: {
        tasksCompleted: 0,
        tasksFailed: 0,
        averageTaskTime: 0,
        successRate: 100,
        lastOptimization: new Date(),
        efficiencyScore: 85
      },
      collaboration: {
        canCollaborate: agent.config.collaborationMode !== 'independent',
        preferredPartners: [],
        collaborationHistory: [],
        trustScore: 75
      }
    };

    this.agents.set(id, newAgent);
    this.emit('agentAdded', newAgent);
    return id;
  }

  public removeAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      this.emit('agentRemoved', agent);
      return true;
    }
    return false;
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public updateAgentStatus(agentId: string, status: Agent['status']): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastActivity = new Date();
      this.emit('agentStatusChanged', agent);
      return true;
    }
    return false;
  }

  public assignTask(task: Omit<Task, 'id' | 'createdAt' | 'status'>): string {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      ...task,
      id: taskId,
      status: 'pending',
      createdAt: new Date()
    };

    this.tasks.set(taskId, newTask);
    this.taskQueue.push(newTask);
    this.emit('taskAdded', newTask);
    return taskId;
  }

  public assignCollaborativeTask(task: Omit<Task, 'id' | 'createdAt' | 'status'>, agentIds: string[]): string {
    const taskId = this.assignTask(task);
    const taskObj = this.tasks.get(taskId);
    if (taskObj) {
      taskObj.collaboration = {
        collaboratingAgents: agentIds,
        sharedResources: [],
        communicationLog: []
      };
      this.emit('collaborativeTaskCreated', taskObj);
    }
    return taskId;
  }

  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public getTasksByAgent(agentId: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  public getCollaborativeTasks(): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.collaboration);
  }

  private async startBackgroundProcessor() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    while (this.isRunning) {
      await this.processTaskQueue();
      await this.updateAgentStatuses();
      await this.optimizeAgentPerformance();
      await this.facilitateCollaboration();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Check every second
    }
  }

  private async processTaskQueue() {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'active' || agent.status === 'idle');

    for (const agent of availableAgents) {
      const agentTasks = this.getTasksByAgent(agent.id);
      const runningTasks = agentTasks.filter(task => task.status === 'running');
      
      if (runningTasks.length < agent.config.maxConcurrentTasks) {
        const pendingTask = this.taskQueue.find(task => 
          task.agentId === agent.id && task.status === 'pending'
        );

        if (pendingTask) {
          await this.executeTask(pendingTask);
        }
      }
    }
  }

  private async executeTask(task: Task) {
    task.status = 'running';
    task.startedAt = new Date();
    this.updateAgentStatus(task.agentId, 'busy');
    
    this.emit('taskStarted', task);

    try {
      // Simulate task execution with collaboration
      await this.simulateTaskExecution(task);
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.actualDuration = task.completedAt.getTime() - task.startedAt!.getTime();
      task.result = { success: true, message: 'Task completed successfully' };
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.updateAgentPerformance(task.agentId, true);
      this.emit('taskCompleted', task);
    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.actualDuration = task.completedAt.getTime() - task.startedAt!.getTime();
      task.error = error instanceof Error ? error.message : 'Unknown error';
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.updateAgentPerformance(task.agentId, false);
      this.emit('taskFailed', task);
    }
  }

  private async simulateTaskExecution(task: Task) {
    // Enhanced task execution simulation
    const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
    
    // Simulate collaboration if applicable
    if (task.collaboration) {
      await this.simulateCollaboration(task);
    }
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    // Simulate occasional failures based on agent performance
    const agent = this.agents.get(task.agentId);
    const failureRate = agent ? (100 - agent.performance.successRate) / 100 : 0.1;
    
    if (Math.random() < failureRate) {
      throw new Error('Simulated task failure');
    }
  }

  private async simulateCollaboration(task: Task) {
    if (!task.collaboration) return;

    for (const agentId of task.collaboration.collaboratingAgents) {
      const agent = this.agents.get(agentId);
      if (agent && agent.status !== 'offline') {
        // Simulate communication between agents
        task.collaboration.communicationLog.push({
          fromAgent: task.agentId,
          toAgent: agentId,
          message: `Sharing progress on task: ${task.description}`,
          timestamp: new Date(),
          type: 'info'
        });

        // Simulate response
        task.collaboration.communicationLog.push({
          fromAgent: agentId,
          toAgent: task.agentId,
          message: `Acknowledged. Contributing to task completion.`,
          timestamp: new Date(),
          type: 'response'
        });
      }
    }
  }

  private async updateAgentStatuses() {
    for (const agent of this.agents.values()) {
      const agentTasks = this.getTasksByAgent(agent.id);
      const hasRunningTasks = agentTasks.some(task => task.status === 'running');
      
      if (!hasRunningTasks && agent.status === 'busy') {
        this.updateAgentStatus(agent.id, 'idle');
      }
    }
  }

  private updateAgentPerformance(agentId: string, success: boolean) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    if (success) {
      agent.performance.tasksCompleted++;
    } else {
      agent.performance.tasksFailed++;
    }

    const totalTasks = agent.performance.tasksCompleted + agent.performance.tasksFailed;
    agent.performance.successRate = totalTasks > 0 
      ? (agent.performance.tasksCompleted / totalTasks) * 100 
      : 100;

    // Update efficiency score based on success rate and task completion speed
    agent.performance.efficiencyScore = Math.min(100, 
      agent.performance.successRate * 0.7 + 
      Math.max(0, 100 - agent.performance.averageTaskTime / 100) * 0.3
    );

    this.emit('agentPerformanceUpdated', agent);
  }

  private async optimizeAgentPerformance() {
    for (const agent of this.agents.values()) {
      if (agent.performance.efficiencyScore < 80) {
        // Trigger optimization
        agent.performance.lastOptimization = new Date();
        agent.performance.efficiencyScore = Math.min(100, agent.performance.efficiencyScore + 5);
        this.emit('agentOptimized', agent);
      }
    }
  }

  private async facilitateCollaboration() {
    // Find agents that can collaborate and have complementary capabilities
    const collaborativeAgents = Array.from(this.agents.values())
      .filter(agent => agent.collaboration.canCollaborate);

    for (const agent of collaborativeAgents) {
      const potentialPartners = collaborativeAgents.filter(a => 
        a.id !== agent.id && 
        a.status === 'idle' &&
        this.hasComplementaryCapabilities(agent, a)
      );

      if (potentialPartners.length > 0) {
        // Suggest collaboration opportunities
        this.emit('collaborationOpportunity', {
          agent,
          potentialPartners,
          suggestedTask: this.generateCollaborativeTask(agent, potentialPartners[0])
        });
      }
    }
  }

  private hasComplementaryCapabilities(agent1: Agent, agent2: Agent): boolean {
    const commonCapabilities = agent1.capabilities.filter(cap => 
      agent2.capabilities.includes(cap)
    );
    return commonCapabilities.length > 0;
  }

  private generateCollaborativeTask(agent1: Agent, agent2: Agent) {
    const commonCapabilities = agent1.capabilities.filter(cap => 
      agent2.capabilities.includes(cap)
    );
    
    return {
      type: commonCapabilities[0] as any,
      description: `Collaborative ${commonCapabilities[0]} task between ${agent1.name} and ${agent2.name}`,
      priority: 'medium' as const
    };
  }

  public stopBackgroundProcessor() {
    this.isRunning = false;
  }

  // Event system
  public on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  public getSystemStats() {
    const totalAgents = this.agents.size;
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active').length;
    const totalTasks = this.tasks.size;
    const pendingTasks = this.taskQueue.length;
    const completedTasks = Array.from(this.tasks.values()).filter(t => t.status === 'completed').length;
    const failedTasks = Array.from(this.tasks.values()).filter(t => t.status === 'failed').length;
    const collaborativeTasks = this.getCollaborativeTasks().length;

    return {
      totalAgents,
      activeAgents,
      totalTasks,
      pendingTasks,
      completedTasks,
      failedTasks,
      collaborativeTasks,
      uptime: Date.now() - (this as any).startTime || 0
    };
  }

  public launchSpecializedAgent(type: string, capabilities: string[]): string {
    const agent: Omit<Agent, 'id' | 'lastActivity' | 'performance' | 'collaboration'> = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      type: 'specialized',
      status: 'active',
      capabilities,
      config: {
        maxConcurrentTasks: 2,
        autoRestart: true,
        priority: 'medium',
        allowedDomains: ['*'],
        collaborationMode: 'collaborative',
        customSettings: {
          specialization: type,
          autoOptimize: true,
          collaborationEnabled: true
        }
      }
    };

    return this.addAgent(agent);
  }

  public getAgentPerformance(agentId: string): PerformanceMetrics | null {
    const agent = this.agents.get(agentId);
    return agent ? agent.performance : null;
  }

  public getCollaborationNetwork(): Map<string, Set<string>> {
    return this.collaborationNetwork;
  }

  private startPerformanceOptimizer() {
    setInterval(() => {
      this.optimizeAgentPerformance();
    }, 30000); // Run every 30 seconds
  }
}

// Create singleton instance
export const agentService = new AgentService();
export default agentService;