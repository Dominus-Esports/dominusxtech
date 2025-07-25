# Agent Management System

A comprehensive system for managing multiple AI agents alongside your main Cursor IDE agent S.O.L. This system allows you to launch, monitor, and control multiple agents simultaneously.

## Features

- 🚀 **Launch Multiple Agents**: Create different types of agents (assistant, coder, reviewer, tester, custom)
- 📊 **Real-time Monitoring**: Monitor agent status, memory usage, and activity in real-time
- 🔄 **Background Service**: Run agents as background services that persist across sessions
- 💬 **Agent Communication**: Send messages to individual agents and view their responses
- 📝 **Log Management**: View detailed logs for each agent
- 🎨 **Modern UI**: Beautiful, responsive interface for managing agents
- 🔧 **CLI Interface**: Command-line tools for service management

## Quick Start

### 1. Start the Background Service

```bash
# Start the agent management service
npm run agent:service

# Or run directly
node scripts/agentService.js
```

### 2. Launch the Web Application

```bash
# In a new terminal
npm run dev
```

### 3. Access the Agent Management Interface

Open your browser and navigate to `http://localhost:3000/agents`

## Agent Types

- **Assistant**: General-purpose AI assistant
- **Coder**: Specialized in code generation and analysis
- **Reviewer**: Code review and quality assurance
- **Tester**: Automated testing and validation
- **Custom**: User-defined agent with specific capabilities

## CLI Commands

### Service Management

```bash
# Start the background service
npm run agent:service

# Check service status
npm run agent:status

# List all active agents
npm run agent:list
```

### Direct CLI Usage

```bash
# Launch a new agent
node scripts/agentService.js launch "Code Reviewer" reviewer

# List all agents
node scripts/agentService.js list

# Check service status
node scripts/agentService.js status

# View agent logs
node scripts/agentService.js logs agent-1234567890
```

## Web Interface Features

### Dashboard
- **Service Status**: Monitor background services and their uptime
- **Agent Grid**: View all active agents with their current status
- **Real-time Updates**: See agent activity and memory usage in real-time

### Agent Management
- **Launch New Agents**: Create agents with custom names, types, and capabilities
- **Agent Details**: Click on any agent to view detailed information
- **Agent Actions**: Send messages, view logs, restart, or terminate agents

### Agent Capabilities
- Code Analysis
- File Management
- Git Operations
- Testing
- Documentation

## Architecture

### Components

1. **AgentManager** (`src/lib/agentService.ts`)
   - Core service for managing agents
   - Handles agent lifecycle (launch, restart, terminate)
   - Manages agent communication and status updates

2. **Web Interface** (`src/app/agents/`)
   - React components for agent management
   - Real-time status updates
   - Modern, responsive UI

3. **Background Service** (`scripts/agentService.js`)
   - Standalone Node.js service
   - CLI interface for service management
   - Persistent agent management

4. **API Routes** (`src/app/api/agents/`)
   - REST API for agent operations
   - WebSocket support for real-time updates

### Data Flow

```
Background Service ←→ AgentManager ←→ Web Interface
       ↓                    ↓              ↓
   CLI Commands      Agent Operations   User Interface
```

## Agent Lifecycle

1. **Launch**: Agent is created and initialized
2. **Active**: Agent is processing tasks and responding to requests
3. **Idle**: Agent is waiting for new tasks
4. **Busy**: Agent is currently processing a request
5. **Error**: Agent has encountered an error
6. **Terminated**: Agent has been stopped

## Memory Management

Each agent has a memory limit (default: 100 units) that increases as the agent processes tasks. Memory usage is tracked and displayed in the web interface.

## Logging

All agent activities are logged with timestamps. Logs include:
- Agent launch/termination events
- Message processing
- Status changes
- Error events

## Integration with S.O.L.

The system is designed to work alongside your main Cursor IDE agent S.O.L.:

- S.O.L. appears as the main service in the dashboard
- Additional agents can be launched to handle specific tasks
- All agents can communicate and collaborate
- The system maintains separation between different agent types

## Development

### Adding New Agent Types

1. Update the `Agent` interface in `src/lib/agentService.ts`
2. Add the new type to the agent creation form
3. Implement specific behavior in the agent simulation

### Adding New Capabilities

1. Update the capabilities array in the agent creation form
2. Add capability-specific logic in the agent simulation
3. Update the UI to display new capabilities

### Customizing Agent Behavior

Modify the `simulateAgentActivity` method in `AgentManager` to implement custom agent behaviors.

## Troubleshooting

### Service Won't Start
- Check if port 3000 is available
- Ensure Node.js is installed
- Check console for error messages

### Agents Not Appearing
- Verify the background service is running
- Check the web interface connection status
- Review agent service logs

### WebSocket Connection Issues
- Ensure the service is running on the correct port
- Check browser console for connection errors
- Verify firewall settings

## Security Considerations

- The current implementation is for development use
- For production, implement proper authentication
- Add rate limiting for agent operations
- Implement proper error handling and validation

## Future Enhancements

- [ ] Agent-to-agent communication
- [ ] Persistent agent storage
- [ ] Advanced agent scheduling
- [ ] Integration with external AI services
- [ ] Agent performance metrics
- [ ] Multi-user support
- [ ] Agent marketplace

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.