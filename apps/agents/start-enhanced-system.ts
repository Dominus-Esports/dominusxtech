#!/usr/bin/env tsx

import { spawn } from 'child_process';
import { CursorMainAgent } from './src/agents/cursor-main-agent';
import { TestRunnerAgent } from './src/agents/test-runner-agent';
import { DeploymentAgent } from './src/agents/deployment-agent';
import { CodeAssistantAgent } from './src/agents/code-assistant-agent';
import { MonitoringAgent } from './src/agents/monitoring-agent';
import { Logger } from './src/utils/logger';

class EnhancedAgentLauncher {
  private logger: Logger;
  private agents: Map<string, any> = new Map();
  private orchestratorProcess: any = null;

  constructor() {
    this.logger = new Logger('EnhancedAgentLauncher');
  }

  public async startOrchestrator(): Promise<void> {
    this.logger.info('Starting enhanced orchestrator...');
    
    return new Promise((resolve, reject) => {
      this.orchestratorProcess = spawn('tsx', ['src/index.ts'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      this.orchestratorProcess.stdout?.on('data', (data: Buffer) => {
        const output = data.toString();
        if (output.includes('Orchestrator started')) {
          this.logger.info('Enhanced orchestrator started successfully');
          resolve();
        }
      });

      this.orchestratorProcess.stderr?.on('data', (data: Buffer) => {
        this.logger.error(`Orchestrator error: ${data.toString()}`);
      });

      this.orchestratorProcess.on('error', (error: Error) => {
        this.logger.error(`Failed to start orchestrator: ${error.message}`);
        reject(error);
      });

      // Wait a bit for the orchestrator to start
      setTimeout(() => {
        if (this.orchestratorProcess?.exitCode === null) {
          resolve();
        }
      }, 3000);
    });
  }

  public async launchAllAgents(): Promise<void> {
    const agentConfigs = [
      { name: 'S.O.L. - Cursor Main Agent', agent: new CursorMainAgent() },
      { name: 'Test Runner Agent', agent: new TestRunnerAgent() },
      { name: 'Deployment Agent', agent: new DeploymentAgent() },
      { name: 'Code Assistant Agent', agent: new CodeAssistantAgent() },
      { name: 'Monitoring Agent', agent: new MonitoringAgent() }
    ];

    this.logger.info(`Launching ${agentConfigs.length} enhanced agents...`);
    
    for (const config of agentConfigs) {
      this.logger.info(`Starting ${config.name}...`);
      this.agents.set(config.name, config.agent);
    }

    // Wait for all agents to be ready
    const maxWaitTime = 25000; // 25 seconds
    const checkInterval = 1000; // 1 second
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      const readyAgents = Array.from(this.agents.entries())
        .filter(([name, agent]) => agent.isReady())
        .map(([name]) => name);

      const totalAgents = this.agents.size;
      const readyCount = readyAgents.length;

      console.log(`\r⏳ Agents ready: ${readyCount}/${totalAgents} - ${readyAgents.join(', ')}`);

      if (readyCount === totalAgents) {
        this.logger.info('All enhanced agents are ready!');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    throw new Error('Some agents failed to become ready within the timeout period');
  }

  public async stop(): Promise<void> {
    this.logger.info('Stopping enhanced system...');
    
    for (const [name, agent] of this.agents) {
      this.logger.info(`Stopping agent: ${name}`);
      agent.disconnect();
    }
    
    this.agents.clear();
    
    if (this.orchestratorProcess) {
      this.orchestratorProcess.kill('SIGTERM');
      this.orchestratorProcess = null;
    }
    
    this.logger.info('Enhanced system stopped');
  }
}

// Main execution
async function main() {
  const launcher = new EnhancedAgentLauncher();
  
  try {
    // Start orchestrator
    await launcher.startOrchestrator();
    
    // Wait a moment for orchestrator to fully initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Launch all agents
    await launcher.launchAllAgents();
    
    console.log('\n🎉 Enhanced Multi-Agent System Started Successfully!');
    console.log('====================================================');
    console.log('📊 Orchestrator: http://localhost:3001/health');
    console.log('🔌 WebSocket: ws://localhost:3001');
    console.log('📊 Dashboard: http://localhost:3001/dashboard');
    console.log('📋 Available Agents:');
    console.log('   • S.O.L. - Cursor Main Agent 🟢');
    console.log('   • Test Runner Agent 🟢');
    console.log('   • Deployment Agent 🟢');
    console.log('   • Code Assistant Agent 🟢');
    console.log('   • Monitoring Agent 🟢');
    console.log('\n💡 You can now:');
    console.log('   • View system health: curl http://localhost:3001/health');
    console.log('   • List agents: curl http://localhost:3001/agents');
    console.log('   • Access dashboard: http://localhost:3001/dashboard');
    console.log('   • Create tasks via WebSocket or HTTP API');
    console.log('\n🚀 New Features:');
    console.log('   • Real-time web dashboard with charts');
    console.log('   • Code generation and refactoring');
    console.log('   • System monitoring and alerting');
    console.log('   • Enhanced task management');
    console.log('\nPress Ctrl+C to stop all services');
    
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down enhanced system...');
      await launcher.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down enhanced system...');
      await launcher.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start enhanced multi-agent system:', error);
    await launcher.stop();
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { EnhancedAgentLauncher };