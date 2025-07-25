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
  collaboration: CollaborationData;
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  autoRestart: boolean;
  priority: 'high' | 'medium' | 'low';
  allowedDomains: string[];
  customSettings: Record<string, any>;
  collaborationEnabled: boolean;
  learningEnabled: boolean;
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  averageTaskTime: number;
  successRate: number;
  uptime: number;
  lastOptimization: Date;
}

export interface CollaborationData {
  collaboratingWith: string[];
  sharedKnowledge: string[];
  communicationHistory: Message[];
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type: 'task_update' | 'knowledge_share' | 'collaboration_request';
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
  dependencies: string[];
  estimatedDuration: number;
  actualDuration?: number;
  assignedBy?: string;
  collaborationRequired: boolean;
  collaboratingAgents: string[];
}

class AgentService {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private taskQueue: Task[] = [];
  private isRunning = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private collaborationNetwork: Map<string, Set<string>> = new Map();
  private knowledgeBase: Map<string, any> = new Map();
  private startTime = Date.now();

  constructor() {
    this.initializeSOL();
    this.startBackgroundProcessor();
    this.initializeAdvancedFeatures();
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
        'security_audit',
        'code_generation',
        'refactoring',
        'dependency_management',
        'deployment_strategy'
      ],
      lastActivity: new Date(),
      config: {
        maxConcurrentTasks: 5,
        autoRestart: true,
        priority: 'high',
        allowedDomains: ['*'],
        collaborationEnabled: true,
        learningEnabled: true,
        customSettings: {
          preferredLanguage: 'typescript',
          codeStyle: 'modern',
          documentationStyle: 'comprehensive',
          testingFramework: 'jest',
          deploymentTarget: 'vercel'
        }
      },
      performance: {
        tasksCompleted: 0,
        tasksFailed: 0,
        averageTaskTime: 0,
        successRate: 100,
        uptime: 0,
        lastOptimization: new Date()
      },
      collaboration: {
        collaboratingWith: [],
        sharedKnowledge: [],
        communicationHistory: []
      }
    };

    this.agents.set(solAgent.id, solAgent);
    this.emit('agentAdded', solAgent);
  }

  private initializeAdvancedFeatures() {
    // Initialize collaboration network
    this.collaborationNetwork.set('sol-primary', new Set());
    
    // Initialize knowledge base with common patterns
    this.knowledgeBase.set('react_patterns', {
      hooks: ['useState', 'useEffect', 'useContext', 'useReducer'],
      patterns: ['render_props', 'higher_order_components', 'compound_components'],
      best_practices: ['functional_components', 'memoization', 'code_splitting']
    });
    
    this.knowledgeBase.set('typescript_patterns', {
      types: ['interfaces', 'types', 'generics', 'utility_types'],
      patterns: ['discriminated_unions', 'builder_pattern', 'factory_pattern'],
      best_practices: ['strict_mode', 'no_any', 'proper_typing']
    });
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
        uptime: 0,
        lastOptimization: new Date()
      },
      collaboration: {
        collaboratingWith: [],
        sharedKnowledge: [],
        communicationHistory: []
      }
    };

    this.agents.set(id, newAgent);
    this.collaborationNetwork.set(id, new Set());
    this.emit('agentAdded', newAgent);
    return id;
  }

  public removeAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      this.collaborationNetwork.delete(agentId);
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
      createdAt: new Date(),
      dependencies: task.dependencies || [],
      estimatedDuration: task.estimatedDuration || 30000, // 30 seconds default
      collaborationRequired: task.collaborationRequired || false,
      collaboratingAgents: task.collaboratingAgents || []
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

  public enableCollaboration(agentId1: string, agentId2: string): boolean {
    const agent1 = this.agents.get(agentId1);
    const agent2 = this.agents.get(agentId2);
    
    if (agent1 && agent2 && agent1.config.collaborationEnabled && agent2.config.collaborationEnabled) {
      this.collaborationNetwork.get(agentId1)?.add(agentId2);
      this.collaborationNetwork.get(agentId2)?.add(agentId1);
      
      agent1.collaboration.collaboratingWith.push(agentId2);
      agent2.collaboration.collaboratingWith.push(agentId1);
      
      this.emit('collaborationEnabled', { agent1, agent2 });
      return true;
    }
    return false;
  }

  public shareKnowledge(fromAgentId: string, toAgentId: string, knowledge: string): boolean {
    const fromAgent = this.agents.get(fromAgentId);
    const toAgent = this.agents.get(toAgentId);
    
    if (fromAgent && toAgent) {
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: fromAgentId,
        to: toAgentId,
        content: knowledge,
        timestamp: new Date(),
        type: 'knowledge_share'
      };
      
      fromAgent.collaboration.communicationHistory.push(message);
      toAgent.collaboration.sharedKnowledge.push(knowledge);
      
      this.emit('knowledgeShared', message);
      return true;
    }
    return false;
  }

  private async startBackgroundProcessor() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    while (this.isRunning) {
      await this.processTaskQueue();
      await this.updateAgentStatuses();
      await this.updatePerformanceMetrics();
      await this.processCollaboration();
      await this.optimizeAgents();
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
          task.agentId === agent.id && task.status === 'pending' && this.canExecuteTask(task)
        );

        if (pendingTask) {
          await this.executeTask(pendingTask);
        }
      }
    }
  }

  private canExecuteTask(task: Task): boolean {
    // Check if all dependencies are completed
    for (const dependencyId of task.dependencies) {
      const dependency = this.tasks.get(dependencyId);
      if (!dependency || dependency.status !== 'completed') {
        return false;
      }
    }
    return true;
  }

  private async executeTask(task: Task) {
    task.status = 'running';
    task.startedAt = new Date();
    this.updateAgentStatus(task.agentId, 'busy');
    
    this.emit('taskStarted', task);

    try {
      // Enhanced task execution with collaboration
      await this.executeTaskWithCollaboration(task);
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.actualDuration = task.completedAt.getTime() - task.startedAt!.getTime();
      task.result = { success: true, message: 'Task completed successfully' };
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.updatePerformanceMetrics(task.agentId, true, task.actualDuration);
      this.emit('taskCompleted', task);
    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.actualDuration = task.completedAt.getTime() - task.startedAt!.getTime();
      task.error = error instanceof Error ? error.message : 'Unknown error';
      
      this.updateAgentStatus(task.agentId, 'idle');
      this.updatePerformanceMetrics(task.agentId, false, task.actualDuration);
      this.emit('taskFailed', task);
    }
  }

  private async executeTaskWithCollaboration(task: Task) {
    const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
    
    // Simulate collaboration if required
    if (task.collaborationRequired && task.collaboratingAgents.length > 0) {
      await this.simulateCollaboration(task);
    }
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('Simulated task failure');
    }
  }

  private async simulateCollaboration(task: Task) {
    const agent = this.agents.get(task.agentId);
    if (!agent) return;

    for (const collaboratingAgentId of task.collaboratingAgents) {
      const collaboratingAgent = this.agents.get(collaboratingAgentId);
      if (collaboratingAgent) {
        // Simulate knowledge sharing
        this.shareKnowledge(agent.id, collaboratingAgentId, `Task ${task.id} insights`);
        
        // Simulate communication
        const message: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from: agent.id,
          to: collaboratingAgentId,
          content: `Working on task: ${task.description}`,
          timestamp: new Date(),
          type: 'task_update'
        };
        
        agent.collaboration.communicationHistory.push(message);
        this.emit('messageSent', message);
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

  private async updatePerformanceMetrics() {
    for (const agent of this.agents.values()) {
      const agentTasks = this.getTasksByAgent(agent.id);
      const completedTasks = agentTasks.filter(task => task.status === 'completed');
      const failedTasks = agentTasks.filter(task => task.status === 'failed');
      
      agent.performance.tasksCompleted = completedTasks.length;
      agent.performance.tasksFailed = failedTasks.length;
      
      if (completedTasks.length > 0) {
        const totalTime = completedTasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0);
        agent.performance.averageTaskTime = totalTime / completedTasks.length;
      }
      
      const totalTasks = completedTasks.length + failedTasks.length;
      if (totalTasks > 0) {
        agent.performance.successRate = (completedTasks.length / totalTasks) * 100;
      }
      
      agent.performance.uptime = Date.now() - this.startTime;
    }
  }

  private async processCollaboration() {
    // Process collaboration requests and knowledge sharing
    for (const agent of this.agents.values()) {
      if (agent.collaboration.communicationHistory.length > 10) {
        // Keep only recent messages
        agent.collaboration.communicationHistory = agent.collaboration.communicationHistory.slice(-10);
      }
    }
  }

  private async optimizeAgents() {
    for (const agent of this.agents.values()) {
      if (agent.config.learningEnabled && agent.performance.successRate < 80) {
        // Simulate agent learning and optimization
        agent.performance.lastOptimization = new Date();
        this.emit('agentOptimized', agent);
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
      uptime: Date.now() - this.startTime,
      collaborationCount: this.collaborationNetwork.size,
      knowledgeBaseSize: this.knowledgeBase.size
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
        collaborationEnabled: true,
        learningEnabled: true,
        customSettings: {
          specialization: type,
          autoOptimize: true,
          collaborationMode: 'active'
        }
      }
    };

    return this.addAgent(agent);
  }

  public getCollaborationNetwork(): Map<string, Set<string>> {
    return this.collaborationNetwork;
  }

  public getKnowledgeBase(): Map<string, any> {
    return this.knowledgeBase;
  }

  private updatePerformanceMetrics(agentId: string, success: boolean, duration: number) {
    const agent = this.agents.get(agentId);
    if (agent) {
      if (success) {
        agent.performance.tasksCompleted++;
      } else {
        agent.performance.tasksFailed++;
      }
      
      // Update average task time
      const totalTasks = agent.performance.tasksCompleted + agent.performance.tasksFailed;
      if (totalTasks > 0) {
        agent.performance.averageTaskTime = 
          (agent.performance.averageTaskTime * (totalTasks - 1) + duration) / totalTasks;
      }
      
      // Update success rate
      agent.performance.successRate = (agent.performance.tasksCompleted / totalTasks) * 100;
    }
  }
}

// Create singleton instance
export const agentService = new AgentService();
export default agentService;