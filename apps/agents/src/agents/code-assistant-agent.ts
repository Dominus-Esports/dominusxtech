import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus, TaskType, MessageType } from '../types';
import { Logger } from '../utils/logger';

export class CodeAssistantAgent {
  private socket: Socket;
  private agentId: string | null = null;
  private logger: Logger;
  private isConnected: boolean = false;
  private codeCache: Map<string, any> = new Map();

  constructor(private orchestratorUrl: string = 'http://localhost:3001') {
    this.logger = new Logger('CodeAssistantAgent');
    this.socket = io(this.orchestratorUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logger.info('CodeAssistant connected to orchestrator');
      this.registerAgent();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.logger.warn('CodeAssistant disconnected from orchestrator');
    });

    this.socket.on('agent:registered', (agent: any) => {
      this.agentId = agent.id;
      this.logger.info(`CodeAssistant registered as agent: ${agent.name} (${agent.id})`);
    });

    this.socket.on('task:assigned', (data: any) => {
      this.handleTask(data);
    });

    this.socket.on('error', (error: any) => {
      this.logger.error('CodeAssistant socket error:', error);
    });
  }

  private registerAgent(): void {
    const agentData = {
      name: 'Code Assistant Agent',
      type: AgentType.CODE_ASSISTANT,
      status: AgentStatus.IDLE,
      capabilities: [
        'code_generation',
        'code_refactoring',
        'code_optimization',
        'bug_fixing',
        'code_review',
        'documentation_generation',
        'test_generation',
        'dependency_analysis'
      ],
      metadata: {
        version: '1.0.0',
        description: 'Specialized agent for code assistance and generation',
        supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'go', 'rust', 'c++'],
        features: ['ai_code_generation', 'smart_refactoring', 'performance_optimization']
      },
      config: {
        maxConcurrentTasks: 8,
        timeout: 300000,
        retryAttempts: 2,
        priority: 2,
        autoRestart: true,
        healthCheckInterval: 30000
      }
    };

    this.socket.emit('agent:register', agentData);
  }

  private async handleTask(data: any): Promise<void> {
    const { taskId, agentId, type, payload } = data;
    
    this.logger.info(`CodeAssistant received task: ${type} (${taskId})`);
    
    switch (type) {
      case 'code_generation':
        await this.generateCode(taskId, payload);
        break;
      case 'code_refactoring':
        await this.refactorCode(taskId, payload);
        break;
      case 'code_optimization':
        await this.optimizeCode(taskId, payload);
        break;
      case 'bug_fixing':
        await this.fixBugs(taskId, payload);
        break;
      case 'code_review':
        await this.reviewCode(taskId, payload);
        break;
      case 'custom':
        await this.handleCustomCodeTask(taskId, payload);
        break;
      default:
        this.logger.warn(`Unknown task type for CodeAssistant: ${type}`);
        this.completeTask(taskId, { error: `Unknown task type: ${type}` });
    }
  }

  private async generateCode(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Generating code for task: ${taskId}`);
      
      const { language, requirements, context, template } = payload;
      
      // Simulate code generation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const generatedCode = this.simulateCodeGeneration(language, requirements, context);
      
      const result = {
        generatedCode,
        suggestions: [
          'Consider adding error handling',
          'Add input validation',
          'Include unit tests',
          'Add JSDoc comments'
        ],
        complexity: {
          cyclomatic: 3,
          maintainability: 'high',
          testability: 'good'
        },
        dependencies: this.analyzeDependencies(generatedCode),
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Code generation failed: ${error}`);
    }
  }

  private simulateCodeGeneration(language: string, requirements: string, context: any): any {
    const templates = {
      typescript: {
        class: `export class ${context?.className || 'MyClass'} {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }
}`,
        function: `export function ${context?.functionName || 'processData'}(data: any[]): any[] {
  return data
    .filter(item => item !== null)
    .map(item => ({ ...item, processed: true }))
    .sort((a, b) => a.id - b.id);
}`,
        api: `import express from 'express';

const router = express.Router();

router.get('/${context?.endpoint || 'items'}', async (req, res) => {
  try {
    const items = await getItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;`
      }
    };

    return {
      code: templates[language]?.[context?.type || 'function'] || '// Generated code here',
      language,
      type: context?.type || 'function',
      filename: `${context?.name || 'generated'}.${language === 'typescript' ? 'ts' : 'js'}`
    };
  }

  private async refactorCode(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Refactoring code for task: ${taskId}`);
      
      const { code, language, goals } = payload;
      
      // Simulate refactoring
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const refactoredCode = this.simulateRefactoring(code, language, goals);
      
      const result = {
        originalCode: code,
        refactoredCode,
        improvements: [
          'Extracted reusable functions',
          'Improved naming conventions',
          'Reduced code duplication',
          'Enhanced readability'
        ],
        metrics: {
          linesReduced: Math.floor(Math.random() * 20) + 5,
          complexityReduced: Math.floor(Math.random() * 5) + 1,
          maintainabilityImproved: 'high'
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Code refactoring failed: ${error}`);
    }
  }

  private simulateRefactoring(code: string, language: string, goals: string[]): any {
    // Simulate refactoring by adding comments and improving structure
    return {
      code: `// Refactored code with improved structure
${code}
// Additional improvements applied`,
      language,
      changes: goals.map(goal => `Applied: ${goal}`)
    };
  }

  private async optimizeCode(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Optimizing code for task: ${taskId}`);
      
      const { code, language, optimizationType } = payload;
      
      // Simulate optimization
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const optimizedCode = this.simulateOptimization(code, language, optimizationType);
      
      const result = {
        originalCode: code,
        optimizedCode,
        performance: {
          executionTime: 'reduced by 40%',
          memoryUsage: 'reduced by 25%',
          cpuUsage: 'optimized by 30%'
        },
        optimizations: [
          'Cached expensive computations',
          'Used more efficient algorithms',
          'Reduced unnecessary iterations',
          'Optimized data structures'
        ],
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Code optimization failed: ${error}`);
    }
  }

  private simulateOptimization(code: string, language: string, type: string): any {
    return {
      code: `// Optimized code for ${type}
${code}
// Performance optimizations applied`,
      language,
      optimizationType: type
    };
  }

  private async fixBugs(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Fixing bugs for task: ${taskId}`);
      
      const { code, error, language } = payload;
      
      // Simulate bug fixing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fixedCode = this.simulateBugFixing(code, error, language);
      
      const result = {
        originalCode: code,
        fixedCode,
        bugsFixed: [
          'Null pointer exception',
          'Type mismatch error',
          'Logic error in loop condition',
          'Missing error handling'
        ],
        explanations: [
          'Added null checks',
          'Fixed type annotations',
          'Corrected loop condition',
          'Added try-catch blocks'
        ],
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Bug fixing failed: ${error}`);
    }
  }

  private simulateBugFixing(code: string, error: string, language: string): any {
    return {
      code: `// Bug fixes applied
${code}
// Fixed: ${error}`,
      language,
      fixes: [error]
    };
  }

  private async reviewCode(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Reviewing code for task: ${taskId}`);
      
      const { code, language, reviewType } = payload;
      
      // Simulate code review
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const review = this.simulateCodeReview(code, language, reviewType);
      
      const result = {
        code,
        review,
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        recommendations: [
          'Add more comprehensive error handling',
          'Consider using more descriptive variable names',
          'Add unit tests for edge cases',
          'Consider breaking down large functions'
        ],
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Code review failed: ${error}`);
    }
  }

  private simulateCodeReview(code: string, language: string, type: string): any {
    return {
      quality: 'good',
      security: 'secure',
      performance: 'efficient',
      maintainability: 'high',
      comments: [
        'Well-structured code',
        'Good separation of concerns',
        'Appropriate error handling',
        'Clear naming conventions'
      ]
    };
  }

  private analyzeDependencies(code: any): any {
    return {
      direct: ['express', 'typescript', 'jest'],
      dev: ['@types/node', 'eslint'],
      peer: [],
      optional: []
    };
  }

  private async handleCustomCodeTask(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Handling custom code task: ${taskId}`);
      
      const { action, codeConfig } = payload;
      
      let result;
      switch (action) {
        case 'analyze_complexity':
          result = this.analyzeCodeComplexity(codeConfig);
          break;
        case 'generate_tests':
          result = this.generateTests(codeConfig);
          break;
        case 'create_documentation':
          result = this.createDocumentation(codeConfig);
          break;
        default:
          result = { error: `Unknown code action: ${action}` };
      }
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Custom code task failed: ${error}`);
    }
  }

  private analyzeCodeComplexity(config: any): any {
    return {
      complexity: {
        cyclomatic: Math.floor(Math.random() * 10) + 1,
        halstead: Math.floor(Math.random() * 20) + 5,
        maintainability: Math.floor(Math.random() * 50) + 50
      },
      recommendations: [
        'Consider breaking down complex functions',
        'Reduce nesting levels',
        'Extract common patterns'
      ]
    };
  }

  private generateTests(config: any): any {
    return {
      tests: [
        'test-basic-functionality.test.js',
        'test-edge-cases.test.js',
        'test-error-handling.test.js'
      ],
      coverage: '85%',
      testTypes: ['unit', 'integration', 'edge-cases']
    };
  }

  private createDocumentation(config: any): any {
    return {
      documentation: {
        readme: 'Generated README.md',
        apiDocs: 'Generated API documentation',
        examples: 'Code examples provided',
        diagrams: 'Architecture diagrams'
      }
    };
  }

  private completeTask(taskId: string, result: any): void {
    this.socket.emit('task:complete', { taskId, result });
  }

  private failTask(taskId: string, error: string): void {
    this.socket.emit('task:fail', { taskId, error });
  }

  public sendMessage(to: string, type: MessageType, payload: any): void {
    this.socket.emit('message:send', {
      from: this.agentId,
      to,
      type,
      payload,
      priority: 1
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public isReady(): boolean {
    return this.isConnected && this.agentId !== null;
  }
}