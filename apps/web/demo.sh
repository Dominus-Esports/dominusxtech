#!/bin/bash

echo "🤖 Agent Management System Demo"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if the web server is running
print_info "Checking if web server is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_status "Web server is running on http://localhost:3000"
else
    print_error "Web server is not running. Please start it with: npm run dev"
    exit 1
fi

echo ""
print_info "Testing API endpoints..."

# Test the main API endpoint
print_info "Testing GET /api/agents..."
RESPONSE=$(curl -s http://localhost:3000/api/agents)
if echo "$RESPONSE" | grep -q "success.*true"; then
    print_status "API endpoint is working"
else
    print_error "API endpoint failed"
fi

# Launch a test agent
print_info "Launching a test agent..."
AGENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "launch",
    "data": {
      "name": "Demo Agent",
      "type": "assistant",
      "capabilities": ["Code Analysis", "File Management", "Testing"]
    }
  }')

if echo "$AGENT_RESPONSE" | grep -q "success.*true"; then
    print_status "Agent launched successfully"
    AGENT_ID=$(echo "$AGENT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_info "Agent ID: $AGENT_ID"
else
    print_error "Failed to launch agent"
fi

# Send a message to the agent
if [ ! -z "$AGENT_ID" ]; then
    print_info "Sending message to agent..."
    MESSAGE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/agents \
      -H "Content-Type: application/json" \
      -d "{
        \"action\": \"sendMessage\",
        \"data\": {
          \"agentId\": \"$AGENT_ID\",
          \"message\": \"Hello from demo script!\"
        }
      }")
    
    if echo "$MESSAGE_RESPONSE" | grep -q "success.*true"; then
        print_status "Message sent successfully"
    else
        print_error "Failed to send message"
    fi
fi

echo ""
print_info "System Status:"
echo "================"

# Get current status
STATUS=$(curl -s http://localhost:3000/api/agents)
AGENT_COUNT=$(echo "$STATUS" | grep -o '"agents":\[[^]]*\]' | grep -o '\[.*\]' | jq 'length' 2>/dev/null || echo "0")
SERVICE_COUNT=$(echo "$STATUS" | grep -o '"services":\[[^]]*\]' | grep -o '\[.*\]' | jq 'length' 2>/dev/null || echo "0")

print_info "Active Agents: $AGENT_COUNT"
print_info "Background Services: $SERVICE_COUNT"

echo ""
print_info "Available URLs:"
echo "=================="
echo -e "${BLUE}🌐 Main Page:${NC} http://localhost:3000"
echo -e "${BLUE}🤖 Agent Management:${NC} http://localhost:3000/agents"
echo -e "${BLUE}🔌 API Endpoint:${NC} http://localhost:3000/api/agents"

echo ""
print_info "CLI Commands:"
echo "==============="
echo -e "${BLUE}📋 List agents:${NC} npm run agent:list"
echo -e "${BLUE}🚀 Launch agent:${NC} npm run agent:launch"
echo -e "${BLUE}📊 Check status:${NC} npm run agent:status"
echo -e "${BLUE}🔧 Start service:${NC} npm run agent:service"

echo ""
print_info "Features Available:"
echo "======================"
echo "✅ Real-time agent monitoring"
echo "✅ Multiple agent types (assistant, coder, reviewer, tester, custom)"
echo "✅ Agent communication and messaging"
echo "✅ Memory usage tracking"
echo "✅ Activity logging"
echo "✅ Background service management"
echo "✅ Modern web interface"
echo "✅ REST API endpoints"
echo "✅ CLI interface"

echo ""
print_warning "Note: This is a demonstration system. In production, implement proper authentication and security measures."

echo ""
print_status "Demo completed! The agent management system is ready to use."
echo ""
echo "🎯 Next steps:"
echo "1. Open http://localhost:3000/agents in your browser"
echo "2. Launch new agents using the web interface"
echo "3. Monitor agent activity and status"
echo "4. Send messages to agents and view their responses"
echo "5. Explore the CLI commands for advanced management"