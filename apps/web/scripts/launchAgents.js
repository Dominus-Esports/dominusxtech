#!/usr/bin/env node

const WebSocket = require('ws');

// Agent configurations for demonstration
const agentConfigs = [
  {
    name: "Code Reviewer Agent",
    type: "reviewer",
    capabilities: ["Code Analysis", "Testing", "Documentation"],
    maxMemory: 150,
    autoRestart: true,
    environment: { REVIEW_MODE: "strict" }
  },
  {
    name: "Test Runner Agent",
    type: "tester",
    capabilities: ["Testing", "Code Analysis"],
    maxMemory: 100,
    autoRestart: true,
    environment: { TEST_FRAMEWORK: "jest" }
  },
  {
    name: "Documentation Agent",
    type: "assistant",
    capabilities: ["Documentation", "Code Analysis"],
    maxMemory: 80,
    autoRestart: true,
    environment: { DOC_FORMAT: "markdown" }
  },
  {
    name: "Git Operations Agent",
    type: "coder",
    capabilities: ["Git Operations", "File Management"],
    maxMemory: 60,
    autoRestart: true,
    environment: { GIT_BRANCH: "main" }
  },
  {
    name: "Performance Monitor Agent",
    type: "custom",
    capabilities: ["Code Analysis", "Testing"],
    maxMemory: 120,
    autoRestart: true,
    environment: { MONITOR_INTERVAL: "30s" }
  }
];

function launchAgents() {
  console.log('🚀 Launching multiple agents...\n');
  
  const ws = new WebSocket('ws://localhost:3001');
  
  ws.on('open', () => {
    console.log('✅ Connected to background service');
    
    // Launch agents with delays to simulate real-world scenario
    agentConfigs.forEach((config, index) => {
      setTimeout(() => {
        console.log(`📡 Creating agent: ${config.name}`);
        ws.send(JSON.stringify({
          type: 'create_agent',
          data: config
        }));
        
        // Launch the agent after creation
        setTimeout(() => {
          console.log(`🚀 Launching agent: ${config.name}`);
          // We'll need to get the agent ID from the response
          // For now, we'll simulate this
        }, 1000);
      }, index * 2000); // Launch agents every 2 seconds
    });
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === 'agent:created') {
        console.log(`✅ Agent created: ${message.data.name} (${message.data.id})`);
        
        // Launch the agent after creation
        setTimeout(() => {
          console.log(`🚀 Launching agent: ${message.data.name}`);
          ws.send(JSON.stringify({
            type: 'launch_agent',
            data: { agentId: message.data.id }
          }));
        }, 1000);
      } else if (message.type === 'agent:launched') {
        console.log(`✅ Agent launched: ${message.data.name}`);
      } else if (message.type === 'agent:activity') {
        console.log(`📊 Activity: ${message.data.agent.name} - ${message.data.activity}`);
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

// Also create a REST API version for testing
async function launchAgentsViaAPI() {
  console.log('🌐 Launching agents via REST API...\n');
  
  for (const config of agentConfigs) {
    try {
      const response = await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'create_agent',
          data: config
        })
      });
      
      if (response.ok) {
        console.log(`✅ Agent created via API: ${config.name}`);
      } else {
        console.log(`❌ Failed to create agent: ${config.name}`);
      }
    } catch (error) {
      console.error(`Error creating agent ${config.name}:`, error.message);
    }
    
    // Wait between agent creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Check if background service is running
async function checkServiceStatus() {
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
  console.log('🤖 Agent Launcher Script');
  console.log('========================\n');
  
  const isServiceRunning = await checkServiceStatus();
  if (!isServiceRunning) {
    process.exit(1);
  }
  
  // Launch agents via WebSocket
  launchAgents();
  
  // Also try REST API as backup
  setTimeout(launchAgentsViaAPI, 5000);
  
  // Keep the script running to see agent activities
  console.log('\n📡 Monitoring agent activities... (Press Ctrl+C to exit)\n');
}

main().catch(console.error);