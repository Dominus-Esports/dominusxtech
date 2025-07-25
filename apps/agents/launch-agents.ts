#!/usr/bin/env tsx

import { spawn } from 'child_process';
import { CursorMainAgent } from './src/agents/cursor-main-agent';
import { TestRunnerAgent } from './src/agents/test-runner-agent';
import { DeploymentAgent } from './src/agents/deployment-agent';
import { Logger } from './src/utils/logger';

class AgentLauncher {
  private logger: Logger;
  private agents: Map<string, any> = new Map();
  private orchestratorProcess: any = null;

  constructor() {
    this.logger = new Logger('AgentLauncher');
  }

  public async startOrchestrator(): Promise<void> {
    this.logger.info('Starting orchestrator...');
    
    return new Promise((resolve, reject) => {
      this.orchestratorProcess = spawn('tsx', ['src/index.ts'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      this.orchestratorProcess.stdout?.on('data', (data: Buffer) => {
        const output = data.toString();
        if (output.includes('Orchestrator started')) {
          this.logger.info('Orchestrator started successfully');
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

  public async launchAgent(agentType: string, name: string): Promise<void> {
    this.logger.info(`Launching ${agentType} agent: ${name}`);
    
    let agent: any;
    
    switch (agentType.toLowerCase()) {
      case 'cursor_main':
      case 'main':
        agent = new CursorMainAgent();
        break;
      case 'test_runner':
      case 'test':
        agent = new TestRunnerAgent();
        break;
      case 'deployment':
      case 'deploy':
        agent = new DeploymentAgent();
        break;
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }

    // Wait for agent to be ready
    const maxWaitTime = 10000; // 10 seconds
    const checkInterval = 500; // 500ms
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      if (agent.isReady()) {
        this.agents.set(name, agent);
        this.logger.info(`${name} agent is ready`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    throw new Error(`Agent ${name} failed to become ready within ${maxWaitTime}ms`);
  }

  public async launchMultipleAgents(agentConfigs: Array<{ type: string; name: string }>): Promise<void> {
    this.logger.info(`Launching ${agentConfigs.length} agents...`);
    
    const promises = agentConfigs.map(config => 
      this.launchAgent(config.type, config.name)
    );
    
    await Promise.all(promises);
    this.logger.info('All agents launched successfully');
  }

  public async launchDefaultAgents(): Promise<void> {
    const defaultAgents = [
      { type: 'cursor_main', name: 'S.O.L. - Main Agent' },
      { type: 'test_runner', name: 'Test Runner Agent' },
      { type: 'deployment', name: 'Deployment Agent' }
    ];

    await this.launchMultipleAgents(defaultAgents);
  }

  public getAgent(name: string): any {
    return this.agents.get(name);
  }

  public getAllAgents(): Map<string, any> {
    return this.agents;
  }

  public async stopAllAgents(): Promise<void> {
    this.logger.info('Stopping all agents...');
    
    for (const [name, agent] of this.agents) {
      this.logger.info(`Stopping agent: ${name}`);
      agent.disconnect();
    }
    
    this.agents.clear();
  }

  public async stopOrchestrator(): Promise<void> {
    if (this.orchestratorProcess) {
      this.logger.info('Stopping orchestrator...');
      this.orchestratorProcess.kill('SIGTERM');
      this.orchestratorProcess = null;
    }
  }

  public async stop(): Promise<void> {
    await this.stopAllAgents();
    await this.stopOrchestrator();
    this.logger.info('All services stopped');
  }
}

// Main execution
async function main() {
  const launcher = new AgentLauncher();
  
  try {
    // Start orchestrator
    await launcher.startOrchestrator();
    
    // Wait a moment for orchestrator to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Launch default agents
    await launcher.launchDefaultAgents();
    
    console.log('\n🎉 Multi-Agent System Started Successfully!');
    console.log('============================================');
    console.log('📊 Orchestrator: http://localhost:3001/health');
    console.log('🔌 WebSocket: ws://localhost:3001');
    console.log('📋 Available Agents:');
    
    for (const [name, agent] of launcher.getAllAgents()) {
      console.log(`   • ${name} (${agent.isReady() ? '🟢 Ready' : '🔴 Not Ready'})`);
    }
    
    console.log('\n💡 You can now:');
    console.log('   • View system health: curl http://localhost:3001/health');
    console.log('   • List agents: curl http://localhost:3001/agents');
    console.log('   • Create tasks via WebSocket or HTTP API');
    console.log('\nPress Ctrl+C to stop all services');
    
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      await launcher.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down...');
      await launcher.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start multi-agent system:', error);
    await launcher.stop();
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { AgentLauncher };