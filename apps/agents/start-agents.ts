#!/usr/bin/env tsx

import { CursorMainAgent } from './src/agents/cursor-main-agent';
import { TestRunnerAgent } from './src/agents/test-runner-agent';
import { DeploymentAgent } from './src/agents/deployment-agent';
import { CodeAssistantAgent } from './src/agents/code-assistant-agent';
import { MonitoringAgent } from './src/agents/monitoring-agent';

async function startAgents() {
  console.log('🚀 Starting Multi-Agent System...\n');

  // Start Cursor Main Agent (S.O.L.)
  console.log('📋 Starting S.O.L. - Cursor Main Agent...');
  const mainAgent = new CursorMainAgent();
  
  // Start Test Runner Agent
  console.log('🧪 Starting Test Runner Agent...');
  const testAgent = new TestRunnerAgent();
  
  // Start Deployment Agent
  console.log('🚀 Starting Deployment Agent...');
  const deployAgent = new DeploymentAgent();

  // Start Code Assistant Agent
  console.log('💻 Starting Code Assistant Agent...');
  const codeAgent = new CodeAssistantAgent();

  // Start Monitoring Agent
  console.log('📊 Starting Monitoring Agent...');
  const monitorAgent = new MonitoringAgent();

  // Wait for agents to be ready
  console.log('\n⏳ Waiting for agents to connect...');
  
  const maxWaitTime = 20000; // 20 seconds for more agents
  const checkInterval = 1000; // 1 second
  let elapsed = 0;

  while (elapsed < maxWaitTime) {
    const mainReady = mainAgent.isReady();
    const testReady = testAgent.isReady();
    const deployReady = deployAgent.isReady();
    const codeReady = codeAgent.isReady();
    const monitorReady = monitorAgent.isReady();
    
    console.log(`\r⏳ Main: ${mainReady ? '🟢' : '🔴'} | Test: ${testReady ? '🟢' : '🔴'} | Deploy: ${deployReady ? '🟢' : '🔴'} | Code: ${codeReady ? '🟢' : '🔴'} | Monitor: ${monitorReady ? '🟢' : '🔴'}`);
    
    if (mainReady && testReady && deployReady && codeReady && monitorReady) {
      console.log('\n\n🎉 All agents are ready!');
      console.log('============================================');
      console.log('📊 Orchestrator: http://localhost:3001/health');
      console.log('🔌 WebSocket: ws://localhost:3001');
      console.log('📋 Available Agents:');
      console.log('   • S.O.L. - Cursor Main Agent 🟢');
      console.log('   • Test Runner Agent 🟢');
      console.log('   • Deployment Agent 🟢');
      console.log('   • Code Assistant Agent 🟢');
      console.log('   • Monitoring Agent 🟢');
      console.log('\n💡 You can now:');
      console.log('   • View system health: curl http://localhost:3001/health');
      console.log('   • List agents: curl http://localhost:3001/agents');
      console.log('   • Create tasks via WebSocket or HTTP API');
      console.log('\nPress Ctrl+C to stop all agents');
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down agents...');
        mainAgent.disconnect();
        testAgent.disconnect();
        deployAgent.disconnect();
        codeAgent.disconnect();
        monitorAgent.disconnect();
        process.exit(0);
      });
      
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    elapsed += checkInterval;
  }

  console.log('\n❌ Some agents failed to connect within the timeout period');
  process.exit(1);
}

startAgents().catch(console.error);