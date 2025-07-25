# 🤖 Multi-Agent Orchestration System

A comprehensive multi-agent orchestration system designed to enhance development workflows with AI-powered agents, real-time monitoring, and intelligent task management.

## 🚀 Features

### 🌟 Core System
- **5 Specialized AI Agents**: Each designed for specific development tasks
- **Real-time Web Dashboard**: Beautiful interface with live monitoring and charts
- **Intelligent Task Routing**: Automatic task assignment based on agent capabilities
- **WebSocket Communication**: Real-time updates and messaging
- **RESTful API**: Standard HTTP endpoints for external integrations
- **Health Monitoring**: Comprehensive system health tracking
- **TypeScript Support**: Full type safety and IntelliSense

### 🤖 Agent Ecosystem
- **S.O.L. - Cursor Main Agent**: Primary IDE integration and project oversight
- **Test Runner Agent**: Automated testing and quality assurance
- **Deployment Agent**: Infrastructure and deployment management
- **Code Assistant Agent**: AI-powered code generation and optimization
- **Monitoring Agent**: System monitoring and alerting

### 📊 Dashboard Features
- **Live System Metrics**: Real-time performance monitoring
- **Interactive Charts**: Visual analytics with Chart.js
- **Agent Status Tracking**: Real-time agent health monitoring
- **Task Management**: Create and monitor tasks directly from the UI
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App      │    │  Orchestrator   │    │   Agents        │
│   (Next.js)    │◄──►│   (Express)     │◄──►│   (Socket.IO)   │
│                │    │                 │    │                 │
│ • Dashboard    │    │ • Task Routing  │    │ • S.O.L. Agent  │
│ • API Gateway  │    │ • Agent Mgmt    │    │ • Test Runner   │
│ • Real-time UI │    │ • Health Check  │    │ • Deployment    │
└─────────────────┘    └─────────────────┘    │ • Code Assistant│
                                              │ • Monitoring    │
                                              └─────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/multi-agent-system.git
   cd multi-agent-system
   ```

2. **Install dependencies**
   ```bash
   # Install web app dependencies
   cd apps/web
   npm install
   
   # Install agent system dependencies
   cd ../agents
   npm install
   ```

3. **Start the enhanced system**
   ```bash
   cd apps/agents
   npx tsx start-enhanced-system.ts
   ```

4. **Access the dashboard**
   ```
   http://localhost:3001/dashboard
   ```

## 🎯 Usage

### Starting the System

#### Option 1: Enhanced System (Recommended)
```bash
cd apps/agents
npx tsx start-enhanced-system.ts
```

#### Option 2: Individual Components
```bash
# Start orchestrator
cd apps/agents
npm run dev

# In another terminal, start agents
npx tsx start-agents.ts
```

### API Endpoints

#### Health Check
```bash
curl http://localhost:3001/health
```

#### List Agents
```bash
curl http://localhost:3001/agents
```

#### Create Task
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-id",
    "type": "code_analysis",
    "payload": {
      "file": "src/index.ts",
      "language": "typescript"
    },
    "priority": 1
  }'
```

#### List Tasks
```bash
curl http://localhost:3001/tasks
```

### WebSocket Events

#### Connect to WebSocket
```javascript
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to orchestrator');
});

socket.on('agent:list_updated', (agents) => {
  console.log('Agents updated:', agents);
});

socket.on('task:list_updated', (tasks) => {
  console.log('Tasks updated:', tasks);
});
```

## 🏗️ Development

### Project Structure
```
multi-agent-system/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── agents/              # Multi-agent orchestration system
│       ├── src/
│       │   ├── agents/      # Agent implementations
│       │   ├── services/    # Core services
│       │   ├── types/       # TypeScript types
│       │   ├── utils/       # Utility functions
│       │   └── index.ts     # Main orchestrator
│       ├── .github/         # GitHub workflows
│       ├── dashboard/       # Web dashboard
│       └── package.json
├── .github/                 # GitHub workflows
├── docs/                   # Documentation
└── README.md
```

### Development Commands

#### Agent System
```bash
cd apps/agents

# Development
npm run dev                 # Start orchestrator in dev mode
npm run agent:dev          # Start agent manager in dev mode

# Testing
npm test                   # Run tests
npm run lint              # Run linting
npm run type-check        # TypeScript type checking
npm run security-audit    # Security audit

# Building
npm run build             # Build for production
npm start                 # Start production build
```

#### Web Application
```bash
cd apps/web

# Development
npm run dev               # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linting
```

### Adding New Agents

1. **Create agent class**
   ```typescript
   // src/agents/my-new-agent.ts
   export class MyNewAgent {
     // Implementation
   }
   ```

2. **Add agent type**
   ```typescript
   // src/types/index.ts
   export enum AgentType {
     // ... existing types
     CUSTOM = 'custom'
   }
   ```

3. **Update launcher**
   ```typescript
   // start-agents.ts
   import { MyNewAgent } from './src/agents/my-new-agent';
   ```

## 🧪 Testing

### Running Tests
```bash
cd apps/agents

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=agent-manager
```

### Integration Testing
```bash
# Start orchestrator
npm run dev

# In another terminal, run integration tests
curl -f http://localhost:3001/health
curl -f http://localhost:3001/agents
```

## 📊 Monitoring

### Dashboard
Access the real-time dashboard at `http://localhost:3001/dashboard` to monitor:
- System health metrics
- Agent status and performance
- Task execution and completion
- Real-time performance charts

### Health Checks
```bash
# System health
curl http://localhost:3001/health

# Agent status
curl http://localhost:3001/agents

# Task status
curl http://localhost:3001/tasks
```

### Logs
The system provides comprehensive logging:
- Agent registration and status changes
- Task creation, assignment, and completion
- System health and performance metrics
- Error tracking and debugging information

## 🔧 Configuration

### Environment Variables
```bash
# Orchestrator configuration
PORT=3001                    # Orchestrator port
NODE_ENV=development         # Environment mode
LOG_LEVEL=info              # Logging level

# Agent configuration
AGENT_TIMEOUT=300000        # Agent task timeout
MAX_CONCURRENT_TASKS=10     # Maximum concurrent tasks
HEALTH_CHECK_INTERVAL=30000 # Health check interval
```

### Agent Configuration
Each agent can be configured with:
- Task timeout settings
- Retry attempts
- Priority levels
- Health check intervals
- Auto-restart capabilities

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Dockerfile for agent system
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY src/ ./src/

EXPOSE 3001
CMD ["npm", "start"]
```

### Cloud Deployment
The system is designed to be deployed on various cloud platforms:
- **AWS**: ECS, Lambda, or EC2
- **Google Cloud**: Cloud Run or Compute Engine
- **Azure**: Container Instances or App Service
- **Kubernetes**: For container orchestration

### CI/CD Pipeline
The project includes comprehensive GitHub Actions workflows:
- **CI Pipeline**: Testing, linting, and security checks
- **Deployment Pipeline**: Staging and production deployments
- **Release Management**: Automated releases and versioning

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](apps/agents/CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📚 Documentation

- **[API Documentation](apps/agents/docs/API.md)**: Complete API reference
- **[Agent Development Guide](apps/agents/docs/AGENT_DEVELOPMENT.md)**: How to create new agents
- **[Deployment Guide](apps/agents/docs/DEPLOYMENT.md)**: Deployment instructions
- **[Troubleshooting](apps/agents/docs/TROUBLESHOOTING.md)**: Common issues and solutions

## 🐛 Troubleshooting

### Common Issues

#### Agents Not Connecting
```bash
# Check orchestrator status
curl http://localhost:3001/health

# Check agent logs
# Look for connection errors in agent output
```

#### Dashboard Not Loading
```bash
# Verify orchestrator is running
curl http://localhost:3001/health

# Check browser console for errors
# Ensure WebSocket connection is established
```

#### Tasks Not Completing
```bash
# Check agent status
curl http://localhost:3001/agents

# Check task status
curl http://localhost:3001/tasks

# Review agent logs for errors
```

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check detailed logs
tail -f logs/orchestrator.log
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](apps/agents/LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.IO**: For real-time communication
- **Express.js**: For the web server framework
- **TypeScript**: For type safety
- **Chart.js**: For dashboard visualizations
- **Winston**: For structured logging

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/multi-agent-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/multi-agent-system/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-org/multi-agent-system/wiki)

---

**Built with ❤️ by the Multi-Agent Orchestration System Team**