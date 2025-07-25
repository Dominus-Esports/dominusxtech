export interface Agent {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'specialized';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  currentTask?: string;
  lastActivity: Date;
  config: AgentConfig;
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  autoRestart: boolean;
  priority: 'high' | 'medium' | 'low';
  allowedDomains: string[];
  customSettings: Record<string, any>;
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
}

class AgentService {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private taskQueue: Task[] = [];
  private isRunning = false;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeSOL();
    this.startBackgroundProcessor();
  }

  private initializeSOL() {
    // Initialize S.O.L. as the primary agent
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
        'performance_analysis'
      ],
      lastActivity: new Date(),
      config: {
        maxConcurrentTasks: 3,
        autoRestart: true,
        priority: 'high',
        allowedDomains: ['*'],
        customSettings: {
          preferredLanguage: 'typescript',
          codeStyle: 'modern',
          documentationStyle: 'comprehensive'
        }
      }
    };

    this.agents.set(solAgent.id, solAgent);
    this.emit('agentAdded', solAgent);
  }

  public addAgent(agent: Omit<Agent, 'id' | 'lastActivity'>): string {
    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAgent: Agent = {
      ...agent,
      id,
      lastActivity: new Date()
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

  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public getTasksByAgent(agentId: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  private async startBackgroundProcessor() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    while (this.isRunning) {
      await this.processTaskQueue();
      await this.updateAgentStatuses();
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
      // Simulate task execution
      await this.simulateTaskExecution(task);
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = { success: true, message: 'Task completed successfully' };
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.emit('taskCompleted', task);
    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.error = error instanceof Error ? error.message : 'Unknown error';
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.emit('taskFailed', task);
    }
  }

  private async simulateTaskExecution(task: Task) {
    // Simulate different types of task execution
    const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('Simulated task failure');
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

    return {
      totalAgents,
      activeAgents,
      totalTasks,
      pendingTasks,
      completedTasks,
      failedTasks,
      uptime: Date.now() - (this as any).startTime || 0
    };
  }

  public launchSpecializedAgent(type: string, capabilities: string[]): string {
    const agent: Omit<Agent, 'id' | 'lastActivity'> = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      type: 'specialized',
      status: 'active',
      capabilities,
      config: {
        maxConcurrentTasks: 2,
        autoRestart: true,
        priority: 'medium',
        allowedDomains: ['*'],
        customSettings: {
          specialization: type,
          autoOptimize: true
        }
      }
    };

    return this.addAgent(agent);
  }
}

// Create singleton instance
export const agentService = new AgentService();
export default agentService;