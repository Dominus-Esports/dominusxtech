import { EventEmitter } from 'events';

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'error';
  type: 'assistant' | 'coder' | 'reviewer' | 'tester' | 'custom';
  lastActivity: string;
  capabilities: string[];
  memory: {
    used: number;
    total: number;
  };
  processId?: number;
  config: AgentConfig;
}

export interface AgentConfig {
  name: string;
  type: Agent['type'];
  capabilities: string[];
  maxMemory: number;
  autoRestart: boolean;
  environment: Record<string, string>;
}

export interface AgentService {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  agents: Agent[];
  uptime: string;
  startTime: Date;
}

export class AgentManager extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private services: Map<string, AgentService> = new Map();
  private isRunning: boolean = false;
  private startTime: Date = new Date();

  constructor() {
    super();
    this.initializeDefaultServices();
  }

  private initializeDefaultServices() {
    // Initialize S.O.L. main service
    const solService: AgentService = {
      id: 'sol-main',
      name: 'S.O.L. - Main Agent',
      status: 'running',
      agents: [],
      uptime: '0h 0m',
      startTime: new Date()
    };

    this.services.set(solService.id, solService);

    // Add S.O.L. core agent
    const solAgent: Agent = {
      id: 'sol-1',
      name: 'S.O.L. Core',
      status: 'active',
      type: 'assistant',
      lastActivity: 'Just started',
      capabilities: ['Code Analysis', 'File Management', 'Git Operations'],
      memory: { used: 45, total: 100 },
      config: {
        name: 'S.O.L. Core',
        type: 'assistant',
        capabilities: ['Code Analysis', 'File Management', 'Git Operations'],
        maxMemory: 100,
        autoRestart: true,
        environment: {}
      }
    };

    this.agents.set(solAgent.id, solAgent);
    solService.agents.push(solAgent);
  }

  public start(): void {
    this.isRunning = true;
    this.startTime = new Date();
    this.emit('service:started', { startTime: this.startTime });
    console.log('Agent Manager started');
  }

  public stop(): void {
    this.isRunning = false;
    this.emit('service:stopped');
    console.log('Agent Manager stopped');
  }

  public createAgent(config: AgentConfig): Agent {
    const agent: Agent = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      status: 'idle',
      type: config.type,
      lastActivity: 'Just created',
      capabilities: config.capabilities,
      memory: { used: 0, total: config.maxMemory },
      config
    };

    this.agents.set(agent.id, agent);
    this.emit('agent:created', agent);
    console.log(`Agent created: ${agent.name} (${agent.id})`);
    return agent;
  }

  public launchAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'active';
    agent.lastActivity = new Date().toISOString();
    agent.processId = Math.floor(Math.random() * 10000); // Simulate process ID

    this.emit('agent:launched', agent);
    console.log(`Agent launched: ${agent.name} (${agent.id})`);
    return true;
  }

  public terminateAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'idle';
    agent.lastActivity = new Date().toISOString();
    delete agent.processId;

    this.emit('agent:terminated', agent);
    console.log(`Agent terminated: ${agent.name} (${agent.id})`);
    return true;
  }

  public restartAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'busy';
    this.emit('agent:restarting', agent);

    // Simulate restart process
    setTimeout(() => {
      agent.status = 'active';
      agent.lastActivity = new Date().toISOString();
      this.emit('agent:restarted', agent);
      console.log(`Agent restarted: ${agent.name} (${agent.id})`);
    }, 2000);

    return true;
  }

  public sendMessageToAgent(agentId: string, message: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'busy';
    agent.lastActivity = new Date().toISOString();

    this.emit('agent:message', { agentId, message, timestamp: new Date() });
    console.log(`Message sent to agent ${agent.name}: ${message}`);

    // Simulate processing time
    setTimeout(() => {
      agent.status = 'active';
      agent.lastActivity = new Date().toISOString();
      this.emit('agent:response', { 
        agentId, 
        response: `Processed: ${message}`, 
        timestamp: new Date() 
      });
    }, 1000);

    return true;
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getService(serviceId: string): AgentService | undefined {
    return this.services.get(serviceId);
  }

  public getAllServices(): AgentService[] {
    return Array.from(this.services.values()).map(service => ({
      ...service,
      uptime: this.calculateUptime(service.startTime)
    }));
  }

  private calculateUptime(startTime: Date): string {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  public updateAgentMemory(agentId: string, used: number): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.memory.used = Math.min(used, agent.memory.total);
      this.emit('agent:memory:updated', agent);
    }
  }

  public getStatus(): {
    isRunning: boolean;
    totalAgents: number;
    activeAgents: number;
    uptime: string;
  } {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active').length;
    return {
      isRunning: this.isRunning,
      totalAgents: this.agents.size,
      activeAgents,
      uptime: this.calculateUptime(this.startTime)
    };
  }

  public simulateAgentActivity(): void {
    if (!this.isRunning) return;

    // Simulate random agent activities
    const agents = Array.from(this.agents.values());
    if (agents.length === 0) return;

    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const activities = [
      'Processing code analysis',
      'Reviewing files',
      'Running tests',
      'Updating documentation',
      'Git operations',
      'Memory cleanup'
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    randomAgent.lastActivity = activity;
    randomAgent.memory.used = Math.min(
      randomAgent.memory.used + Math.random() * 5,
      randomAgent.memory.total
    );

    this.emit('agent:activity', { agent: randomAgent, activity });
  }
}

// Singleton instance
export const agentManager = new AgentManager();

// Start periodic activity simulation
setInterval(() => {
  agentManager.simulateAgentActivity();
}, 10000); // Every 10 seconds