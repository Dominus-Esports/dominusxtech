# Contributing to Agent Management System

Thank you for your interest in contributing to the Agent Management System! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test your changes**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Architecture Overview](#architecture-overview)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Docker (for containerized development)
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/agent-management-system.git
   cd agent-management-system/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev:full
   ```

## 🏗️ Development Setup

### Local Development

```bash
# Start both web interface and background service
npm run dev:full

# Start only web interface
npm run dev

# Start only background service
npm run background

# Run tests
npm run test

# Build for production
npm run build
```

### Docker Development

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Follow the naming convention: `PascalCase` for components
- Use CSS modules for styling
- Keep components focused and reusable

### File Structure

```
src/
├── app/                    # Next.js app directory
│   ├── agents/            # Agent management pages
│   ├── api/               # API routes
│   └── ...
├── services/              # Business logic services
│   ├── agentService.ts    # Agent management
│   └── websocketService.ts # WebSocket handling
└── ...
```

### Git Commit Messages

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(agents): add agent creation modal
fix(websocket): handle connection errors gracefully
docs(readme): update deployment instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run specific test file
npm test -- --testPathPattern=agentService
```

### Test Structure

- Unit tests: `__tests__/` directories
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

### Writing Tests

```typescript
import { agentManager } from '@/services/agentService';

describe('Agent Manager', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should create a new agent', () => {
    const agent = agentManager.createAgent({
      name: 'Test Agent',
      type: 'assistant',
      capabilities: ['Code Analysis']
    });

    expect(agent.name).toBe('Test Agent');
    expect(agent.status).toBe('idle');
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure tests pass**: `npm run test`
2. **Check code style**: `npm run lint`
3. **Update documentation** if needed
4. **Add tests** for new features
5. **Update CHANGELOG.md** if applicable

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Security considerations addressed

### Review Process

1. **Automated checks** must pass
2. **At least 2 maintainer approvals** required
3. **Security scan** completed
4. **Performance impact** assessed
5. **Documentation** updated

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Steps

1. **Create release branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update version**
   ```bash
   npm version patch|minor|major
   ```

3. **Update CHANGELOG.md**

4. **Create PR** for release

5. **Merge and tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

6. **Deploy to production**

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Interface │◄──►│ Background Service│◄──►│  Agent Manager  │
│   (Next.js)     │    │   (Node.js)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │   WebSocket      │    │   Agent Pool    │
│   Components    │    │   Communication  │    │   Management    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Services

- **Agent Manager**: Core agent lifecycle management
- **WebSocket Service**: Real-time communication
- **Background Service**: Standalone agent orchestration
- **API Routes**: RESTful endpoints for agent operations

### Data Flow

1. **User Action** → Web Interface
2. **API Call** → Background Service
3. **Agent Operation** → Agent Manager
4. **Real-time Update** → WebSocket → Web Interface

## 🐛 Debugging

### Common Issues

1. **WebSocket Connection Failed**
   - Check if background service is running
   - Verify port 3001 is available
   - Check firewall settings

2. **Agent Not Responding**
   - Check agent status in interface
   - Review agent logs
   - Restart agent if necessary

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`
   - Verify dependencies: `npm audit`

### Logging

```typescript
// Use structured logging
console.log('Agent created:', { id: agent.id, name: agent.name });

// For debugging
console.debug('WebSocket message:', message);

// For errors
console.error('Agent creation failed:', error);
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the README and inline code comments

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame

Thank you for contributing to the Agent Management System! 🚀