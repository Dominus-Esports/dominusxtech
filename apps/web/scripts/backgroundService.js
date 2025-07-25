#!/usr/bin/env node

const { EventEmitter } = require('events');
const http = require('http');
const WebSocket = require('ws');

class BackgroundAgentService extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.services = new Map();
    this.isRunning = false;
    this.startTime = new Date();
    this.clients = new Set();
    
    this.initializeDefaultServices();
    this.setupServer();
  }

  initializeDefaultServices() {
    // Initialize S.O.L. main service
    const solService = {
      id: 'sol-main',
      name: 'S.O.L. - Main Agent',
      status: 'running',
      agents: [],
      uptime: '0h 0m',
      startTime: new Date()
    };

    this.services.set(solService.id, solService);

    // Add S.O.L. core agent
    const solAgent = {
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

  setupServer() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'running',
        uptime: this.calculateUptime(this.startTime),
        agents: this.getAllAgents(),
        services: this.getAllServices()
      }));
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      console.log('Client connected to background service');
      this.clients.add(ws);

      // Send initial state
      this.sendToClient(ws, {
        type: 'initial',
        data: {
          agents: this.getAllAgents(),
          services: this.getAllServices(),
          status: this.getStatus()
        }
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected from background service');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Background Agent Service running on port ${PORT}`);
      this.isRunning = true;
      this.startActivitySimulation();
    });
  }

  handleMessage(ws, message) {
    const { type, data } = message;

    switch (type) {
      case 'create_agent':
        const agent = this.createAgent(data);
        this.broadcast({
          type: 'agent:created',
          data: agent
        });
        break;

      case 'launch_agent':
        const launched = this.launchAgent(data.agentId);
        if (launched) {
          const agent = this.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:launched',
            data: agent
          });
        }
        break;

      case 'terminate_agent':
        const terminated = this.terminateAgent(data.agentId);
        if (terminated) {
          const agent = this.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:terminated',
            data: agent
          });
        }
        break;

      case 'restart_agent':
        const restarted = this.restartAgent(data.agentId);
        if (restarted) {
          const agent = this.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:restarting',
            data: agent
          });
        }
        break;

      case 'send_message':
        const sent = this.sendMessageToAgent(data.agentId, data.message);
        if (sent) {
          this.broadcast({
            type: 'agent:message',
            data: {
              agentId: data.agentId,
              message: data.message,
              timestamp: new Date()
            }
          });
        }
        break;

      case 'get_status':
        this.sendToClient(ws, {
          type: 'status',
          data: this.getStatus()
        });
        break;

      default:
        console.log('Unknown message type:', type);
    }
  }

  createAgent(config) {
    const agent = {
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
    console.log(`Agent created: ${agent.name} (${agent.id})`);
    return agent;
  }

  launchAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'active';
    agent.lastActivity = new Date().toISOString();
    agent.processId = Math.floor(Math.random() * 10000);

    console.log(`Agent launched: ${agent.name} (${agent.id})`);
    return true;
  }

  terminateAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'idle';
    agent.lastActivity = new Date().toISOString();
    delete agent.processId;

    console.log(`Agent terminated: ${agent.name} (${agent.id})`);
    return true;
  }

  restartAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'busy';

    setTimeout(() => {
      agent.status = 'active';
      agent.lastActivity = new Date().toISOString();
      this.broadcast({
        type: 'agent:restarted',
        data: agent
      });
      console.log(`Agent restarted: ${agent.name} (${agent.id})`);
    }, 2000);

    return true;
  }

  sendMessageToAgent(agentId, message) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return false;
    }

    agent.status = 'busy';
    agent.lastActivity = new Date().toISOString();

    console.log(`Message sent to agent ${agent.name}: ${message}`);

    setTimeout(() => {
      agent.status = 'active';
      agent.lastActivity = new Date().toISOString();
      this.broadcast({
        type: 'agent:response',
        data: {
          agentId,
          response: `Processed: ${message}`,
          timestamp: new Date()
        }
      });
    }, 1000);

    return true;
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  getAllServices() {
    return Array.from(this.services.values()).map(service => ({
      ...service,
      uptime: this.calculateUptime(service.startTime)
    }));
  }

  calculateUptime(startTime) {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  getStatus() {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active').length;
    return {
      isRunning: this.isRunning,
      totalAgents: this.agents.size,
      activeAgents,
      uptime: this.calculateUptime(this.startTime)
    };
  }

  startActivitySimulation() {
    setInterval(() => {
      if (!this.isRunning) return;

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

      this.broadcast({
        type: 'agent:activity',
        data: { agent: randomAgent, activity }
      });
    }, 10000);
  }

  sendToClient(ws, data) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcast(data) {
    this.clients.forEach(client => {
      this.sendToClient(client, data);
    });
  }
}

// Start the background service
const backgroundService = new BackgroundAgentService();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down background service...');
  backgroundService.isRunning = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down background service...');
  backgroundService.isRunning = false;
  process.exit(0);
});