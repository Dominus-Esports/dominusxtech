# Agent Management System

A comprehensive system for managing multiple AI agents alongside your main Cursor IDE agent S.O.L. This system allows you to launch, monitor, and control multiple agents in real-time with a beautiful, modern interface.

## 🚀 Features

- **Multi-Agent Management**: Launch and manage multiple AI agents simultaneously
- **Real-time Monitoring**: WebSocket-based real-time updates of agent status and activities
- **Agent Types**: Support for different agent types (Assistant, Coder, Reviewer, Tester, Custom)
- **Memory Management**: Track and monitor agent memory usage
- **Background Service**: Standalone service for agent orchestration
- **Modern UI**: Beautiful, responsive interface with glass-morphism effects
- **Event-Driven Architecture**: Loose coupling between components
- **Scalable Design**: Horizontal scaling capabilities
- **Security First**: Input validation and secure communication
- **Performance Optimized**: Efficient data structures and lazy loading

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [Support](#support)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/agent-management-system.git
   cd agent-management-system
   ```

2. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev:full
   ```

5. **Access the application**
   - Web Interface: http://localhost:3000
   - Agent Management: http://localhost:3000/agents
   - System Dashboard: http://localhost:3000/dashboard
   - Background Service: http://localhost:3001

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Interface │    │ Background      │    │ Agent Manager   │
│   (React/Next)  │◄──►│ Service         │◄──►│ (TypeScript)    │
│   Port: 3000    │    │ Port: 3001      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   REST API      │    │   Event System  │
│   Communication │    │   Endpoints     │    │   (EventEmitter)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Backend**: Node.js with WebSocket support
- **Build Tool**: Next.js 15.4.3 with Turbopack
- **Styling**: CSS Modules with modern design patterns
- **Communication**: WebSocket for real-time updates
- **API**: RESTful endpoints with JSON responses
- **Testing**: Jest for unit and integration tests
- **Linting**: ESLint with TypeScript support
- **Deployment**: Vercel-ready configuration

## 🎯 Features

### Agent Management

- **Create Agents**: Launch new agents with custom configurations
- **Monitor Status**: Real-time status updates and activity monitoring
- **Memory Tracking**: Monitor agent memory usage and performance
- **Message Communication**: Send messages to individual agents
- **Agent Types**: Support for specialized agent types

### Agent Types

- **🤖 Assistant**: General-purpose AI assistant
- **💻 Coder**: Specialized in code generation and analysis
- **🔍 Reviewer**: Code review and quality assurance
- **🧪 Tester**: Automated testing and validation
- **⚙️ Custom**: User-defined agent type

### Capabilities

- **Code Analysis**: Analyze code structure and patterns
- **File Management**: Handle file operations and organization
- **Git Operations**: Version control and repository management
- **Testing**: Automated test execution and validation
- **Documentation**: Generate and maintain documentation

### Real-time Features

- **Live Updates**: WebSocket-based real-time communication
- **Activity Logs**: Real-time activity monitoring and logging
- **Status Indicators**: Visual status indicators for all agents
- **Performance Metrics**: Real-time performance monitoring
- **System Dashboard**: Comprehensive system overview

## 📚 API Documentation

### REST Endpoints

#### GET `/api/agents`
Get all agents and system status.

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": [...],
    "services": [...],
    "status": {...}
  }
}
```

#### POST `/api/agents`
Perform agent operations.

**Request Body:**
```json
{
  "action": "create|launch|terminate|restart|message",
  "data": {...}
}
```

### WebSocket Events

#### Client to Server
- `create_agent`: Create a new agent
- `launch_agent`: Launch an agent
- `terminate_agent`: Terminate an agent
- `restart_agent`: Restart an agent
- `send_message`: Send message to agent

#### Server to Client
- `agent:created`: Agent created event
- `agent:launched`: Agent launched event
- `agent:terminated`: Agent terminated event
- `agent:restarted`: Agent restarted event
- `agent:activity`: Agent activity update
- `agent:response`: Agent response to message

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start web interface only
npm run background       # Start background service only
npm run dev:full         # Start both services

# Testing
npm test                 # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run end-to-end tests

# Building
npm run build            # Build for production
npm run start            # Start production server

# Utilities
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run launch-agents    # Launch demo agents
npm run demo             # Run interactive demo
```

### Project Structure

```
agent-management-system/
├── apps/
│   └── web/                    # Main web application
│       ├── src/
│       │   ├── app/            # Next.js app directory
│       │   │   ├── agents/     # Agent management interface
│       │   │   ├── dashboard/  # System dashboard
│       │   │   └── api/        # REST API endpoints
│       │   ├── services/       # Business logic services
│       │   └── components/     # Reusable components
│       ├── scripts/            # Utility scripts
│       └── public/             # Static assets
├── .github/                    # GitHub workflows and templates
├── docs/                       # Documentation
└── README.md                   # This file
```

### Environment Variables

```env
# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Background Service
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```env
   NODE_ENV=production
   PORT=3000
   ```

3. **Start the services**
   ```bash
   npm run start
   ```

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard**

3. **Deploy background service separately**

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000 3001
CMD ["npm", "run", "start"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint for code quality
- Write comprehensive tests
- Follow conventional commit messages
- Update documentation as needed

## 🔒 Security

We take security seriously. Please see our [Security Policy](SECURITY.md) for details.

### Security Features

- Input validation for all user inputs
- Secure WebSocket communication
- Environment variable configuration
- No sensitive data exposure in logs
- Proper error handling without information leakage

### Reporting Vulnerabilities

If you discover a security vulnerability, please email us at security@your-org.com.

## 📊 Monitoring

### Metrics

- Agent status and health
- Memory usage per agent
- Response times and performance
- System uptime and availability
- Error rates and logs

### Logging

- Structured logging with timestamps
- Error tracking and monitoring
- Performance metrics collection
- Security event logging

## 🆘 Support

### Getting Help

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/agent-management-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/agent-management-system/discussions)
- **Security**: [Security Policy](SECURITY.md)

### Troubleshooting

#### Common Issues

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

Enable debug logging:
```bash
DEBUG=agent-manager npm run dev:full
```

## 📈 Roadmap

### Upcoming Features

- [ ] **Authentication System**: User authentication and authorization
- [ ] **Agent Templates**: Pre-configured agent templates
- [ ] **Plugin System**: Extensible agent capabilities
- [ ] **Advanced Analytics**: Detailed performance analytics
- [ ] **Mobile App**: Native mobile application
- [ ] **API Rate Limiting**: Advanced rate limiting and throttling
- [ ] **Multi-tenancy**: Support for multiple organizations
- [ ] **Advanced Security**: Enhanced security features

### Version History

See [CHANGELOG.md](CHANGELOG.md) for a complete version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **React Team**: For the incredible UI library
- **TypeScript Team**: For the type safety
- **WebSocket Community**: For real-time communication standards
- **Open Source Contributors**: For all the amazing tools and libraries

---

**Made with ❤️ by the Agent Management System Team**

For questions, support, or contributions, please reach out to us!