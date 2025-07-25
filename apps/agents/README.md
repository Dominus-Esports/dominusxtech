# Multi-Agent Orchestration System

A powerful multi-agent orchestration system designed to work alongside your main Cursor IDE agent S.O.L. and launch additional specialized agents for enhanced development workflows.

## 🚀 Features

- **Multi-Agent Coordination**: Seamlessly coordinate between multiple specialized agents
- **Real-time Communication**: WebSocket-based real-time messaging between agents
- **Task Distribution**: Intelligent task routing and load balancing
- **Health Monitoring**: Comprehensive health checks and metrics
- **Extensible Architecture**: Easy to add new agent types
- **RESTful API**: Full HTTP API for external integrations
- **WebSocket Support**: Real-time bidirectional communication

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cursor Main   │    │  Test Runner    │    │   Deployment    │
│   Agent (S.O.L) │    │     Agent       │    │     Agent       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Orchestrator  │
                    │   (Port 3001)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   HTTP API &    │
                    │   WebSocket     │
                    └─────────────────┘
```

## 🎯 Agent Types

### 1. Cursor Main Agent (S.O.L.)
- **Type**: `cursor_main`
- **Capabilities**: Code analysis, task coordination, debugging assistance
- **Role**: Primary IDE integration and project oversight

### 2. Test Runner Agent
- **Type**: `test_runner`
- **Capabilities**: Unit testing, integration testing, E2E testing, test coverage
- **Role**: Automated test execution and reporting

### 3. Deployment Agent
- **Type**: `deployment`
- **Capabilities**: Deployment, rollback, infrastructure management
- **Role**: Application deployment and infrastructure operations

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/agents
npm install
```

### 2. Start the Multi-Agent System

```bash
# Start orchestrator and all default agents
npm run dev

# Or use the launcher directly
npx tsx launch-agents.ts
```

### 3. Verify System Health

```bash
# Check system health
curl http://localhost:3001/health

# List all agents
curl http://localhost:3001/agents

# Get system metrics
curl http://localhost:3001/metrics/system
```

## 📋 API Endpoints

### Health & Status
- `GET /health` - System health check
- `GET /metrics/system` - System metrics

### Agent Management
- `GET /agents` - List all agents
- `GET /agents/:id` - Get specific agent
- `POST /agents` - Register new agent
- `DELETE /agents/:id` - Unregister agent
- `PATCH /agents/:id/status` - Update agent status
- `GET /agents/available` - Get available agents
- `GET /agents/type/:type` - Get agents by type

### Task Management
- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get specific task
- `POST /tasks` - Create new task
- `POST /tasks/:id/assign` - Assign task to agent
- `POST /tasks/:id/complete` - Complete task
- `POST /tasks/:id/fail` - Fail task

### Metrics
- `GET /metrics/agents/:id` - Get agent metrics

## 🔌 WebSocket Events

### Client to Server
- `agent:register` - Register new agent
- `agent:unregister` - Unregister agent
- `agent:status_update` - Update agent status
- `task:create` - Create new task
- `task:assign` - Assign task
- `task:complete` - Complete task
- `task:fail` - Fail task
- `message:send` - Send message

### Server to Client
- `agent:registered` - Agent registration confirmed
- `agent:unregistered` - Agent unregistration confirmed
- `agent:status_updated` - Agent status updated
- `agent:list_updated` - Agent list updated
- `task:created` - Task created
- `task:assigned` - Task assigned
- `task:completed` - Task completed
- `task:failed` - Task failed
- `task:list_updated` - Task list updated
- `message:received` - Message received

## 🛠️ Development

### Adding New Agents

1. Create a new agent class in `src/agents/`
2. Extend the base agent functionality
3. Register the agent type in the launcher
4. Add to the default agent configuration

Example:
```typescript
export class CustomAgent {
  // Implement agent functionality
  // Register with orchestrator
  // Handle tasks and messages
}
```

### Environment Variables

```bash
PORT=3001                          # Orchestrator port
MAX_AGENTS=50                      # Maximum agents
HEARTBEAT_INTERVAL=30000          # Health check interval (ms)
TASK_TIMEOUT=300000               # Task timeout (ms)
ENABLE_LOGGING=true               # Enable request logging
ENABLE_METRICS=true               # Enable metrics collection
CORS_ORIGINS=http://localhost:3000 # CORS origins
```

### Scripts

```bash
npm run dev          # Start orchestrator in development mode
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run agent:dev    # Start agent manager in development
npm run agent:start  # Start agent manager in production
npm run test         # Run tests
npm run lint         # Run linting
```

## 📊 Monitoring & Metrics

The system provides comprehensive monitoring:

- **Agent Health**: Real-time status of all agents
- **Task Metrics**: Success/failure rates, response times
- **System Load**: CPU, memory, and task queue status
- **Performance**: Average response times and throughput

## 🔧 Configuration

### Agent Configuration
```typescript
{
  maxConcurrentTasks: 10,    // Max concurrent tasks
  timeout: 300000,           // Task timeout (ms)
  retryAttempts: 3,          // Retry attempts
  priority: 1,               // Agent priority
  autoRestart: true,         // Auto restart on failure
  healthCheckInterval: 30000 // Health check interval
}
```

### Orchestrator Configuration
```typescript
{
  port: 3001,                    // Server port
  maxAgents: 50,                // Maximum agents
  heartbeatInterval: 30000,      // Heartbeat interval
  taskTimeout: 300000,          // Task timeout
  enableLogging: true,          // Enable logging
  enableMetrics: true,          // Enable metrics
  corsOrigins: ['http://localhost:3000']
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Agent not connecting**
   - Check orchestrator is running on port 3001
   - Verify WebSocket connection
   - Check agent registration data

2. **Tasks not being assigned**
   - Verify agent status is not OFFLINE
   - Check agent capabilities match task requirements
   - Review task priority and agent load

3. **Performance issues**
   - Monitor system metrics
   - Check agent health status
   - Review task timeout settings

### Logs

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review the logs in `logs/` directory
- Open an issue on GitHub

---

**Happy coding with your multi-agent development team! 🎉**