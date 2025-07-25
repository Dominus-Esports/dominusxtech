#!/usr/bin/env node

const WebSocket = require('ws');

console.log('🤖 Agent Management System Demo');
console.log('===============================\n');

// Demo agent configurations
const demoAgents = [
  {
    name: "Frontend Specialist",
    type: "coder",
    capabilities: ["Code Analysis", "File Management"],
    maxMemory: 120,
    autoRestart: true,
    environment: { FRAMEWORK: "react" }
  },
  {
    name: "Backend Architect",
    type: "coder",
    capabilities: ["Code Analysis", "Testing", "Documentation"],
    maxMemory: 150,
    autoRestart: true,
    environment: { LANGUAGE: "typescript" }
  },
  {
    name: "Quality Assurance",
    type: "tester",
    capabilities: ["Testing", "Code Analysis"],
    maxMemory: 100,
    autoRestart: true,
    environment: { TEST_TYPE: "integration" }
  }
];

function runDemo() {
  console.log('🚀 Starting demo...\n');
  
  const ws = new WebSocket('ws://localhost:3001');
  
  ws.on('open', () => {
    console.log('✅ Connected to background service');
    
    // Step 1: Create agents
    console.log('\n📝 Step 1: Creating demo agents...');
    demoAgents.forEach((config, index) => {
      setTimeout(() => {
        console.log(`Creating agent: ${config.name}`);
        ws.send(JSON.stringify({
          type: 'create_agent',
          data: config
        }));
      }, index * 1000);
    });
    
    // Step 2: Launch agents after creation
    setTimeout(() => {
      console.log('\n🚀 Step 2: Launching agents...');
      // This will be handled by the response from agent creation
    }, 4000);
    
    // Step 3: Send messages to agents
    setTimeout(() => {
      console.log('\n💬 Step 3: Sending messages to agents...');
      // We'll send messages to the first agent
    }, 8000);
    
    // Step 4: Monitor activities
    setTimeout(() => {
      console.log('\n📊 Step 4: Monitoring agent activities...');
      console.log('Agents are now running and performing tasks automatically.');
      console.log('Check the web interface at http://localhost:3000/agents to see the full dashboard.\n');
    }, 12000);
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'agent:created':
          console.log(`✅ Created: ${message.data.name} (${message.data.id})`);
          
          // Launch the agent after creation
          setTimeout(() => {
            console.log(`🚀 Launching: ${message.data.name}`);
            ws.send(JSON.stringify({
              type: 'launch_agent',
              data: { agentId: message.data.id }
            }));
          }, 500);
          break;
          
        case 'agent:launched':
          console.log(`✅ Launched: ${message.data.name}`);
          break;
          
        case 'agent:activity':
          console.log(`📊 ${message.data.agent.name}: ${message.data.activity}`);
          break;
          
        case 'agent:response':
          console.log(`💬 Response: ${message.data.response}`);
          break;
          
        case 'initial':
          console.log(`📊 Current agents: ${message.data.agents.length}`);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('❌ Disconnected from background service');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

// Check service status first
async function checkService() {
  try {
    const response = await fetch('http://localhost:3001');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Background service is running');
      console.log(`📊 Current agents: ${data.agents.length}`);
      console.log(`⏱️  Uptime: ${data.uptime}\n`);
      return true;
    }
  } catch (error) {
    console.log('❌ Background service is not running');
    console.log('Please start the background service first: npm run background\n');
    return false;
  }
}

async function main() {
  const isServiceRunning = await checkService();
  if (!isServiceRunning) {
    process.exit(1);
  }
  
  runDemo();
  
  // Keep the script running
  console.log('\n📡 Demo is running... (Press Ctrl+C to exit)\n');
}

main().catch(console.error);