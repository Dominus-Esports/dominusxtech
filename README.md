# 🤖 Agent Management System

A comprehensive system for managing multiple AI agents alongside your main Cursor IDE agent S.O.L. This system allows you to launch, monitor, and control multiple agents simultaneously with a beautiful web interface and robust backend services.

## 🚀 Live Demo

- **Production URL**: [https://agent-management-system.vercel.app](https://agent-management-system.vercel.app)
- **Documentation**: [https://agent-management-system.vercel.app/docs](https://agent-management-system.vercel.app/docs)

## ✨ Features

- 🎯 **Multi-Agent Orchestration**: Launch and manage unlimited AI agents
- 📊 **Real-time Monitoring**: Live status, memory usage, and activity tracking
- 💬 **Agent Communication**: Send messages and receive responses from agents
- 🎨 **Modern UI**: Beautiful glassmorphism design with responsive layout
- 🔧 **CLI Interface**: Command-line tools for service management
- 📡 **REST API**: Programmatic access to all features
- 🔄 **Background Service**: Persistent agent management across sessions
- 🐳 **Docker Support**: Easy deployment with containerization
- 🔒 **Security Ready**: Authentication and authorization framework

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Interface │    │  Background     │    │   API Layer     │
│   (React/Next)  │◄──►│  Service        │◄──►│   (REST/WS)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Agent Manager │    │   Agent Pool    │    │   Message Queue │
│   (TypeScript)  │    │   (Node.js)     │    │   (In-Memory)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agent-management-system.git
   cd agent-management-system/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** (if needed)
3. **Deploy automatically** on push to main branch

#### Self-hosted

1. **Build the application**
   ```bash
   npm run build
   npm start
   ```

2. **Set up reverse proxy** (Nginx/Apache)
3. **Configure SSL certificates**
4. **Set up monitoring and logging**

## 📖 Usage

### Web Interface

1. **Access the dashboard**: [http://localhost:3000/agents](http://localhost:3000/agents)
2. **Launch new agents**: Click "Launch New Agent" button
3. **Monitor activity**: View real-time status and logs
4. **Send messages**: Communicate with individual agents
5. **Manage agents**: Restart, terminate, or configure agents

### CLI Commands

```bash
# Service Management
npm run agent:service    # Start background service
npm run agent:status     # Check service status
npm run agent:list       # List all agents
npm run agent:launch     # Launch new agent

# Direct CLI Usage
node scripts/agentService.js launch "Agent Name" assistant
node scripts/agentService.js list
node scripts/agentService.js status
node scripts/agentService.js logs agent-id
```

### API Usage

```bash
# Get all agents and services
curl http://localhost:3000/api/agents

# Launch a new agent
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "launch",
    "data": {
      "name": "My Agent",
      "type": "assistant",
      "capabilities": ["Code Analysis", "Testing"]
    }
  }'

# Send message to agent
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sendMessage",
    "data": {
      "agentId": "agent-id",
      "message": "Hello, agent!"
    }
  }'
```

## 🎯 Agent Types

- **Assistant**: General-purpose AI assistant
- **Coder**: Specialized in code generation and analysis
- **Reviewer**: Code review and quality assurance
- **Tester**: Automated testing and validation
- **Custom**: User-defined agent with specific capabilities

## 🔧 Configuration

### Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/agent_management

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### Docker Environment

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start services
docker-compose up -d
```

## 📊 Monitoring

### Health Checks

- **Application**: `GET /api/health`
- **Agents**: `GET /api/agents`
- **Services**: `GET /api/services`

### Logs

```bash
# View application logs
docker-compose logs -f agent-management-system

# View agent service logs
npm run agent:service 2>&1 | tee logs/agent-service.log
```

### Metrics

- Agent count and status
- Memory usage per agent
- Response times
- Error rates
- Service uptime

## 🔒 Security

### Authentication

- JWT-based authentication
- Session management
- Role-based access control
- API rate limiting

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Production Checklist

- [ ] Set secure environment variables
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable monitoring and alerting
- [ ] Regular security updates
- [ ] Backup strategy

## 🧪 Testing

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run integration tests
npm run test:integration
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Docker](https://docker.com/) for containerization
- [GitHub Actions](https://github.com/features/actions) for CI/CD

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/agent-management-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agent-management-system/discussions)
- **Documentation**: [https://agent-management-system.vercel.app/docs](https://agent-management-system.vercel.app/docs)

## 🚀 Roadmap

- [ ] Agent-to-agent communication
- [ ] Advanced agent scheduling
- [ ] Integration with external AI services
- [ ] Multi-user support
- [ ] Agent marketplace
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Plugin system

---

**Made with ❤️ by the Agent Management System Team**