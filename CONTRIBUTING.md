# 🤝 Contributing to Multi-Agent Management System

Thank you for your interest in contributing to the Multi-Agent Management System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Questions and Discussions](#questions-and-discussions)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/multi-agent-system.git
   cd multi-agent-system
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/multi-agent-system.git
   ```

## 🛠️ Development Setup

### Installation

1. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Environment Setup

Create a `.env.local` file in `apps/web/`:
```env
NEXT_PUBLIC_AGENT_SERVICE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_COLLABORATION=true
NEXT_PUBLIC_ENABLE_OPTIMIZATION=true
NEXT_PUBLIC_DEBUG_MODE=false
```

## 🔧 Making Changes

### Branch Naming Convention

Use the following format for branch names:
- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `hotfix/description` - for urgent fixes
- `docs/description` - for documentation changes
- `refactor/description` - for code refactoring

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(agents): add new collaboration network visualization
fix(dashboard): resolve agent status update issue
docs(readme): update installation instructions
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write your code
   - Add tests
   - Update documentation

3. **Test your changes**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Submit the PR

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- --testPathPattern=AgentService
```

### Writing Tests

- Write tests for all new features
- Ensure existing tests pass
- Aim for good test coverage
- Use descriptive test names
- Test both success and failure cases

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code has been performed
- [ ] Code has been commented, especially in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] Tests have been added that prove the fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

### PR Guidelines

1. **Use the PR template**: Fill out all sections of the PR template
2. **Provide clear description**: Explain what the PR does and why
3. **Include screenshots**: For UI changes, include before/after screenshots
4. **Link related issues**: Use keywords like "Closes #123" or "Fixes #456"
5. **Keep PRs focused**: One feature or fix per PR
6. **Respond to feedback**: Address review comments promptly

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Documentation** updates if needed
5. **Final approval** and merge

## 📝 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use strict TypeScript configuration
- Add JSDoc comments for complex functions

### React Guidelines

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries
- Optimize for performance

### CSS Guidelines

- Use CSS Modules for styling
- Follow BEM methodology
- Use consistent naming conventions
- Optimize for responsive design
- Maintain accessibility standards

### File Organization

```
src/
├── components/          # React components
│   ├── agents/         # Agent-related components
│   └── common/         # Shared components
├── services/           # Business logic services
├── lib/               # Utility functions and hooks
├── types/             # TypeScript type definitions
└── styles/            # Global styles and themes
```

## 📚 Documentation

### Documentation Standards

- Keep documentation up to date
- Use clear and concise language
- Include code examples
- Add screenshots for UI features
- Maintain consistent formatting

### Required Documentation

- [ ] README.md updates
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guides
- [ ] Contributing guidelines

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues**: Check if the issue has already been reported
2. **Check documentation**: Ensure the issue isn't covered in the docs
3. **Reproduce the issue**: Make sure you can consistently reproduce it
4. **Gather information**: Collect relevant details and screenshots

### Issue Template

Use the provided issue templates:
- [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)

### Required Information

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots or videos
- Error messages or logs

## 💡 Feature Requests

### Before Requesting

1. **Check existing features**: Ensure the feature doesn't already exist
2. **Search issues**: Look for similar feature requests
3. **Consider impact**: Think about the broader impact
4. **Provide details**: Include comprehensive information

### Feature Request Guidelines

- Explain the problem being solved
- Describe the proposed solution
- Provide use cases and examples
- Consider implementation complexity
- Discuss potential alternatives

## 💬 Questions and Discussions

### Getting Help

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check the README and Wiki first

### Community Guidelines

- Be respectful and patient
- Provide context when asking questions
- Help others when you can
- Follow the code of conduct

## 🏆 Recognition

### Contributors

All contributors will be recognized in:
- GitHub contributors list
- README.md contributors section
- Release notes
- Project documentation

### Types of Contributions

- Code contributions
- Documentation improvements
- Bug reports and fixes
- Feature requests and implementations
- Testing and quality assurance
- Community support and mentoring

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/multi-agent-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/multi-agent-system/discussions)
- **Email**: [your-email@example.com]

## 🙏 Thank You

Thank you for contributing to the Multi-Agent Management System! Your contributions help make this project better for everyone in the AI development community.

---

**Happy coding! 🚀**