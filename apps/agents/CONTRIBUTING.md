# Contributing to Multi-Agent Orchestration System

Thank you for your interest in contributing to the Multi-Agent Orchestration System! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/multi-agent-system.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes**
5. **Test your changes**: `npm test && npm run lint`
6. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Create a Pull Request**

## 📋 Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Installation
```bash
cd apps/agents
npm install
```

### Development Commands
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build

# Format code
npm run format

# Security audit
npm run security-audit
```

## 🏗️ Project Structure

```
apps/agents/
├── src/
│   ├── agents/           # Agent implementations
│   ├── services/         # Core services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Main orchestrator
├── .github/             # GitHub workflows
├── docs/               # Documentation
├── tests/              # Test files
└── dashboard/          # Web dashboard
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=agent-manager
```

### Writing Tests
- Use Jest as the testing framework
- Place test files next to source files with `.test.ts` extension
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test both success and error scenarios

Example test:
```typescript
import { AgentManager } from '../services/agent-manager';

describe('AgentManager', () => {
  let agentManager: AgentManager;

  beforeEach(() => {
    agentManager = new AgentManager();
  });

  describe('registerAgent', () => {
    it('should register a new agent successfully', () => {
      const agentData = {
        name: 'Test Agent',
        type: 'test',
        capabilities: ['test']
      };

      const result = agentManager.registerAgent(agentData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Agent');
    });
  });
});
```

## 📝 Code Style

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations
- Avoid `any` type when possible

### Naming Conventions
- **Files**: kebab-case (e.g., `agent-manager.ts`)
- **Classes**: PascalCase (e.g., `AgentManager`)
- **Functions/Variables**: camelCase (e.g., `registerAgent`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CONCURRENT_TASKS`)

### Code Formatting
- Use Prettier for code formatting
- Use ESLint for code linting
- Follow the existing code style

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(agents): add new monitoring agent
fix(orchestrator): resolve task assignment issue
docs(readme): update installation instructions
test(services): add unit tests for agent manager
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

## 🤖 Adding New Agents

### 1. Create Agent Class
```typescript
// src/agents/my-new-agent.ts
import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus } from '../types';
import { Logger } from '../utils/logger';

export class MyNewAgent {
  private socket: Socket;
  private agentId: string | null = null;
  private logger: Logger;
  private isConnected: boolean = false;

  constructor(private orchestratorUrl: string = 'http://localhost:3001') {
    this.logger = new Logger('MyNewAgent');
    this.socket = io(this.orchestratorUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logger.info('MyNewAgent connected to orchestrator');
      this.registerAgent();
    });

    this.socket.on('task:assigned', (data: any) => {
      this.handleTask(data);
    });
  }

  private registerAgent(): void {
    const agentData = {
      name: 'My New Agent',
      type: AgentType.CUSTOM,
      status: AgentStatus.IDLE,
      capabilities: ['my_capability'],
      metadata: {
        version: '1.0.0',
        description: 'Description of my new agent'
      }
    };

    this.socket.emit('agent:register', agentData);
  }

  private async handleTask(data: any): Promise<void> {
    const { taskId, type, payload } = data;
    
    this.logger.info(`MyNewAgent received task: ${type} (${taskId})`);
    
    // Implement task handling logic here
    
    this.completeTask(taskId, { result: 'success' });
  }

  private completeTask(taskId: string, result: any): void {
    this.socket.emit('task:complete', { taskId, result });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public isReady(): boolean {
    return this.isConnected && this.agentId !== null;
  }
}
```

### 2. Add Agent Type
```typescript
// src/types/index.ts
export enum AgentType {
  // ... existing types
  CUSTOM = 'custom'
}
```

### 3. Update Launcher
```typescript
// start-agents.ts
import { MyNewAgent } from './src/agents/my-new-agent';

// Add to agent list
const myNewAgent = new MyNewAgent();
```

## 🔧 Adding New Features

### 1. Plan the Feature
- Create an issue describing the feature
- Discuss the approach with maintainers
- Consider backward compatibility

### 2. Implement the Feature
- Follow the existing code patterns
- Add appropriate tests
- Update documentation

### 3. Test Thoroughly
- Unit tests for new functionality
- Integration tests if needed
- Manual testing in development environment

### 4. Update Documentation
- Update README if needed
- Add API documentation
- Update CHANGELOG.md

## 🐛 Reporting Bugs

### Before Reporting
1. Check existing issues
2. Try to reproduce the bug
3. Check the logs for error messages

### Bug Report Template
```markdown
**Bug Description**
Brief description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., Ubuntu 20.04]
- Node.js version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

**Additional Information**
Any other relevant information
```

## 💡 Feature Requests

### Before Requesting
1. Check existing issues
2. Consider if the feature aligns with project goals
3. Think about implementation complexity

### Feature Request Template
```markdown
**Feature Description**
Brief description of the feature

**Use Case**
Why this feature would be useful

**Proposed Implementation**
How you think it could be implemented

**Alternatives Considered**
Other approaches you considered

**Additional Information**
Any other relevant information
```

## 📚 Documentation

### Writing Documentation
- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

### Documentation Structure
- README.md: Project overview and quick start
- API.md: API documentation
- CONTRIBUTING.md: This file
- CHANGELOG.md: Release notes

## 🔒 Security

### Security Guidelines
- Never commit sensitive information
- Use environment variables for secrets
- Validate all inputs
- Follow security best practices
- Report security issues privately

### Reporting Security Issues
If you discover a security vulnerability, please report it privately to the maintainers.

## 🎯 Pull Request Guidelines

### Before Submitting
1. Ensure all tests pass
2. Run linting: `npm run lint`
3. Check code formatting: `npm run format-check`
4. Update documentation if needed
5. Add tests for new features

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors list

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Documentation**: Check the README and API documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Multi-Agent Orchestration System! 🚀