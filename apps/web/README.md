# Agent Management System

A comprehensive system for managing multiple AI agents alongside your main Cursor IDE agent S.O.L. This system allows you to launch, monitor, and control multiple agents in real-time.

## Features

- **Multi-Agent Management**: Launch and manage multiple AI agents simultaneously
- **Real-time Monitoring**: WebSocket-based real-time updates of agent status and activities
- **Agent Types**: Support for different agent types (Assistant, Coder, Reviewer, Tester, Custom)
- **Memory Management**: Track and monitor agent memory usage
- **Background Service**: Standalone background service for agent orchestration
- **Modern UI**: Beautiful, responsive interface for agent management

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Full System

To run both the web interface and background service:

```bash
npm run dev:full
```

This will start:
- Web interface on `http://localhost:3000`
- Background service on `http://localhost:3001`

### 3. Alternative: Run Services Separately

**Web Interface Only:**
```bash
npm run dev
```

**Background Service Only:**
```bash
npm run background
```

## Usage

### Web Interface

1. Navigate to `http://localhost:3000`
2. Click "Manage Agents" to access the agent management interface
3. View running services and agents
4. Launch new agents with custom configurations
5. Monitor agent status, memory usage, and activities in real-time

### Agent Management

#### Creating New Agents

1. Click "Launch New Agent" in the agents interface
2. Configure the agent:
   - **Name**: Choose a descriptive name
   - **Type**: Select from Assistant, Coder, Reviewer, Tester, or Custom
   - **Capabilities**: Choose from available capabilities:
     - Code Analysis
     - File Management
     - Git Operations
     - Testing
     - Documentation

#### Agent Actions

- **Send Message**: Communicate directly with agents
- **View Logs**: Monitor agent activity logs
- **Restart**: Restart an agent (useful for recovery)
- **Terminate**: Stop an agent

### Background Service API

The background service provides a REST API and WebSocket interface:

#### REST Endpoints

- `GET /` - Get service status and agent information
- `POST /` - Send commands to agents

#### WebSocket Events

- `agent:created` - New agent created
- `agent:launched` - Agent launched
- `agent:terminated` - Agent terminated
- `agent:restarted` - Agent restarted
- `agent:message` - Message sent to agent
- `agent:response` - Response from agent
- `agent:activity` - Agent activity update
- `agent:memory:updated` - Memory usage update

## Architecture

### Components

1. **Agent Manager** (`src/services/agentService.ts`)
   - Core agent management logic
   - Event-driven architecture
   - Agent lifecycle management

2. **WebSocket Service** (`src/services/websocketService.ts`)
   - Real-time communication
   - Client connection management
   - Event broadcasting

3. **Background Service** (`scripts/backgroundService.js`)
   - Standalone service for agent orchestration
   - HTTP and WebSocket server
   - Activity simulation

4. **Web Interface** (`src/app/agents/`)
   - React-based management interface
   - Real-time updates via WebSocket
   - Agent configuration and monitoring

### Agent Types

- **Assistant**: General-purpose AI assistant
- **Coder**: Specialized in code generation and analysis
- **Reviewer**: Code review and quality assurance
- **Tester**: Automated testing and validation
- **Custom**: User-defined agent type

### Capabilities

- **Code Analysis**: Analyze code structure and patterns
- **File Management**: Handle file operations and organization
- **Git Operations**: Version control and repository management
- **Testing**: Automated test execution and validation
- **Documentation**: Generate and maintain documentation

## Development

### Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── agents/           # Agent management interface
│   │   ├── api/agents/       # REST API endpoints
│   │   └── ...
│   ├── services/
│   │   ├── agentService.ts   # Agent management logic
│   │   └── websocketService.ts # WebSocket handling
│   └── ...
├── scripts/
│   └── backgroundService.js  # Standalone background service
└── ...
```

### Adding New Agent Types

1. Extend the agent type interface in `agentService.ts`
2. Add UI components for the new type
3. Implement type-specific logic in the agent manager

### Customizing Agent Capabilities

1. Modify the capabilities array in the agent configuration
2. Update the UI to reflect new capabilities
3. Implement capability-specific logic in the agent manager

## Configuration

### Environment Variables

- `PORT`: Background service port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Agent Configuration

Each agent can be configured with:
- **Memory Limits**: Maximum memory usage
- **Auto Restart**: Automatic restart on failure
- **Environment Variables**: Custom environment configuration
- **Capabilities**: Specific agent capabilities

## Monitoring

### Real-time Metrics

- Agent status and health
- Memory usage per agent
- Activity logs and timestamps
- Service uptime and performance

### Logs

- Agent creation and termination logs
- Message communication logs
- Error and warning logs
- Performance metrics

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure background service is running
   - Check port 3001 is available
   - Verify firewall settings

2. **Agent Not Responding**
   - Check agent status in the interface
   - Restart the agent if necessary
   - Review agent logs for errors

3. **Memory Issues**
   - Monitor agent memory usage
   - Terminate agents if memory usage is high
   - Adjust memory limits in agent configuration

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=agent-manager npm run dev:full
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
