#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AgentService {
  constructor() {
    this.agents = new Map();
    this.services = new Map();
    this.logs = [];
    this.isRunning = false;
  }

  start() {
    console.log('🚀 Starting Agent Management Service...');
    this.isRunning = true;
    this.initializeMainService();
    this.startHeartbeat();
    this.log('Service started successfully');
  }

  stop() {
    console.log('🛑 Stopping Agent Management Service...');
    this.isRunning = false;
    this.terminateAllAgents();
    this.log('Service stopped');
    process.exit(0);
  }

  initializeMainService() {
    const mainService = {
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

  updateUptime() {
    this.services.forEach(service => {
      const now = new Date();
      const diff = now.getTime() - service.startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      service.uptime = `${hours}h ${minutes}m`;
    });
  }

  startHeartbeat() {
    setInterval(() => {
      if (this.isRunning) {
        this.updateUptime();
        this.broadcastStatus();
      }
    }, 30000);
  }

  launchAgent(config) {
    const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const agent = {
      id: agentId,
      name: config.name,
      status: 'idle',
      type: config.type,
      lastActivity: 'Just launched',
      capabilities: config.capabilities,
      memory: { used: 0, total: 100 },
      logs: [`Agent ${config.name} launched at ${new Date().toISOString()}`],
      processId: null
    };

    this.agents.set(agentId, agent);
    this.log(`Agent launched: ${config.name} (${agentId})`);
    this.simulateAgentActivity(agent);
    
    return agent;
  }

  simulateAgentActivity(agent) {
    const activities = [
      'Analyzing code structure',
      'Processing user request',
      'Generating documentation',
      'Running tests',
      'Reviewing changes',
      'Optimizing performance',
      'Learning from interactions',
      'Collaborating with other agents'
    ];

    const interval = setInterval(() => {
      if (!this.isRunning || agent.status === 'error') {
        clearInterval(interval);
        return;
      }

      const activity = activities[Math.floor(Math.random() * activities.length)];
      agent.lastActivity = activity;
      agent.memory.used = Math.min(100, agent.memory.used + Math.random() * 3);
      
      if (Math.random() > 0.8) {
        agent.status = agent.status === 'idle' ? 'active' : 'idle';
      }

      agent.logs.push(`${new Date().toISOString()}: ${activity}`);
      if (agent.logs.length > 100) {
        agent.logs.shift();
      }

      this.broadcastStatus();
    }, 5000 + Math.random() * 10000);
  }

  sendMessageToAgent(agentId, message) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'busy';
    agent.lastActivity = `Processing: ${message}`;
    agent.logs.push(`${new Date().toISOString()}: Received message: ${message}`);

    setTimeout(() => {
      if (agent && this.isRunning) {
        agent.status = 'active';
        agent.lastActivity = 'Message processed';
        agent.logs.push(`${new Date().toISOString()}: Message processed successfully`);
        this.broadcastStatus();
      }
    }, 2000 + Math.random() * 3000);

    this.broadcastStatus();
    return true;
  }

  restartAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'idle';
    agent.lastActivity = 'Restarted';
    agent.memory.used = 0;
    agent.logs.push(`${new Date().toISOString()}: Agent restarted`);

    this.broadcastStatus();
    this.log(`Agent restarted: ${agent.name}`);
    return true;
  }

  terminateAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = 'error';
    agent.lastActivity = 'Terminated';
    agent.logs.push(`${new Date().toISOString()}: Agent terminated`);

    this.agents.delete(agentId);
    this.broadcastStatus();
    this.log(`Agent terminated: ${agent.name}`);
    return true;
  }

  terminateAllAgents() {
    this.agents.forEach((agent, id) => {
      this.terminateAgent(id);
    });
  }

  getAgentLogs(agentId) {
    const agent = this.agents.get(agentId);
    return agent ? agent.logs : [];
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  getAllServices() {
    return Array.from(this.services.values());
  }

  broadcastStatus() {
    const status = {
      type: 'status',
      timestamp: new Date().toISOString(),
      services: this.getAllServices(),
      agents: this.getAllAgents()
    };

    // In a real implementation, this would send to connected WebSocket clients
    console.log('📊 Status Update:', JSON.stringify(status, null, 2));
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      agentsCount: this.agents.size,
      servicesCount: this.services.size,
      uptime: this.services.get('sol-main')?.uptime || '0s'
    };
  }
}

// CLI Interface
if (require.main === module) {
  const service = new AgentService();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    service.stop();
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    service.stop();
  });

  // Start the service
  service.start();

  // CLI commands
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'launch':
      const agentName = args[1] || 'Test Agent';
      const agentType = args[2] || 'assistant';
      const agent = service.launchAgent({
        name: agentName,
        type: agentType,
        capabilities: ['Code Analysis', 'File Management']
      });
      console.log(`✅ Launched agent: ${agent.name} (${agent.id})`);
      break;

    case 'list':
      const agents = service.getAllAgents();
      console.log('📋 Active Agents:');
      agents.forEach(agent => {
        console.log(`  - ${agent.name} (${agent.id}) [${agent.status}]`);
      });
      break;

    case 'status':
      const status = service.getStatus();
      console.log('📊 Service Status:', status);
      break;

    case 'logs':
      const agentId = args[1];
      if (agentId) {
        const logs = service.getAgentLogs(agentId);
        console.log(`📝 Logs for agent ${agentId}:`);
        logs.forEach(log => console.log(`  ${log}`));
      } else {
        console.log('❌ Please provide an agent ID');
      }
      break;

    default:
      console.log(`
🤖 Agent Management Service CLI

Usage:
  node agentService.js [command] [options]

Commands:
  launch [name] [type]    Launch a new agent
  list                    List all active agents
  status                  Show service status
  logs [agentId]         Show logs for specific agent

Examples:
  node agentService.js launch "Code Reviewer" reviewer
  node agentService.js list
  node agentService.js status
  node agentService.js logs agent-1234567890
      `);
  }

  // Keep the process running
  if (!command || ['launch', 'list', 'status', 'logs'].includes(command)) {
    console.log('\n🔄 Service is running. Press Ctrl+C to stop.');
  }
}

module.exports = AgentService;