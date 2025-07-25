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
  logs: string[];
}

export interface AgentService {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  agents: Agent[];
  uptime: string;
  startTime: Date;
}

export interface AgentMessage {
  type: 'command' | 'response' | 'status' | 'log';
  agentId: string;
  data: any;
  timestamp: Date;
}

export class AgentManager extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private services: Map<string, AgentService> = new Map();
  private connections: Set<WebSocket> = new Set();
  private messageQueue: AgentMessage[] = [];

  constructor() {
    super();
    this.initializeMainService();
    this.startHeartbeat();
  }

  private initializeMainService() {
    const mainService: AgentService = {
      id: 'sol-main',
      name: 'S.O.L. - Main Agent',
      status: 'running',
      startTime: new Date(),
      uptime: '0s',
      agents: []
    };

    this.services.set(mainService.id, mainService);
    this.updateUptime();
  }

  private updateUptime() {
    this.services.forEach(service => {
      const now = new Date();
      const diff = now.getTime() - service.startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      service.uptime = `${hours}h ${minutes}m`;
    });
  }

  private startHeartbeat() {
    setInterval(() => {
      this.updateUptime();
      this.broadcastStatus();
    }, 30000); // Update every 30 seconds
  }

  public addConnection(ws: WebSocket) {
    this.connections.add(ws);
    ws.on('close', () => {
      this.connections.delete(ws);
    });
    
    // Send initial state
    this.sendToClient(ws, {
      type: 'init',
      services: Array.from(this.services.values()),
      agents: Array.from(this.agents.values())
    });
  }

  private sendToClient(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  private broadcastStatus() {
    const status = {
      type: 'status',
      services: Array.from(this.services.values()),
      agents: Array.from(this.agents.values())
    };

    this.connections.forEach(ws => {
      this.sendToClient(ws, status);
    });
  }

  public launchAgent(config: {
    name: string;
    type: Agent['type'];
    capabilities: string[];
  }): Agent {
    const agent: Agent = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      status: 'idle',
      type: config.type,
      lastActivity: 'Just launched',
      capabilities: config.capabilities,
      memory: { used: 0, total: 100 },
      logs: [`Agent ${config.name} launched at ${new Date().toISOString()}`]
    };

    this.agents.set(agent.id, agent);
    this.broadcastStatus();
    this.emit('agentLaunched', agent);

    // Simulate agent activity
    this.simulateAgentActivity(agent);

    return agent;
  }

  private simulateAgentActivity(agent: Agent) {
    const activities = [
      'Analyzing code structure',
      'Processing user request',
      'Generating documentation',
      'Running tests',
      'Reviewing changes',
      'Optimizing performance'
    ];

    setInterval(() => {
      if (agent.status !== 'error') {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        agent.lastActivity = activity;
        agent.memory.used = Math.min(100, agent.memory.used + Math.random() * 5);
        
        if (Math.random() > 0.7) {
          agent.status = agent.status === 'idle' ? 'active' : 'idle';
        }

        agent.logs.push(`${new Date().toISOString()}: ${activity}`);
        if (agent.logs.length > 50) {
          agent.logs.shift();
        }

        this.broadcastStatus();
      }
    }, 5000 + Math.random() * 10000);
  }

  public sendMessageToAgent(agentId: string, message: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'busy';
    agent.lastActivity = `Processing: ${message}`;
    agent.logs.push(`${new Date().toISOString()}: Received message: ${message}`);

    // Simulate processing
    setTimeout(() => {
      if (agent) {
        agent.status = 'active';
        agent.lastActivity = 'Message processed';
        agent.logs.push(`${new Date().toISOString()}: Message processed successfully`);
        this.broadcastStatus();
      }
    }, 2000 + Math.random() * 3000);

    this.broadcastStatus();
    return true;
  }

  public restartAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'idle';
    agent.lastActivity = 'Restarted';
    agent.memory.used = 0;
    agent.logs.push(`${new Date().toISOString()}: Agent restarted`);

    this.broadcastStatus();
    this.emit('agentRestarted', agent);
    return true;
  }

  public terminateAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'error';
    agent.lastActivity = 'Terminated';
    agent.logs.push(`${new Date().toISOString()}: Agent terminated`);

    this.broadcastStatus();
    this.emit('agentTerminated', agent);
    return true;
  }

  public getAgentLogs(agentId: string): string[] {
    const agent = this.agents.get(agentId);
    return agent ? agent.logs : [];
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getAllServices(): AgentService[] {
    return Array.from(this.services.values());
  }

  public getAgentById(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getServiceById(serviceId: string): AgentService | undefined {
    return this.services.get(serviceId);
  }
}

// Singleton instance
export const agentManager = new AgentManager();