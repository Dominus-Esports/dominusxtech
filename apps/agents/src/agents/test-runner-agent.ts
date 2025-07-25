import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus, TaskType, MessageType } from '../types';
import { Logger } from '../utils/logger';

export class TestRunnerAgent {
  private socket: Socket;
  private agentId: string | null = null;
  private logger: Logger;
  private isConnected: boolean = false;

  constructor(private orchestratorUrl: string = 'http://localhost:3001') {
    this.logger = new Logger('TestRunnerAgent');
    this.socket = io(this.orchestratorUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logger.info('TestRunner connected to orchestrator');
      this.registerAgent();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.logger.warn('TestRunner disconnected from orchestrator');
    });

    this.socket.on('agent:registered', (agent: any) => {
      this.agentId = agent.id;
      this.logger.info(`TestRunner registered as agent: ${agent.name} (${agent.id})`);
    });

    this.socket.on('task:assigned', (data: any) => {
      this.handleTask(data);
    });

    this.socket.on('error', (error: any) => {
      this.logger.error('TestRunner socket error:', error);
    });
  }

  private registerAgent(): void {
    const agentData = {
      name: 'Test Runner Agent',
      type: AgentType.TEST_RUNNER,
      status: AgentStatus.IDLE,
      capabilities: [
        'unit_testing',
        'integration_testing',
        'e2e_testing',
        'performance_testing',
        'test_coverage',
        'test_reporting'
      ],
      metadata: {
        version: '1.0.0',
        description: 'Specialized agent for running and managing tests',
        supportedFrameworks: ['jest', 'mocha', 'cypress', 'playwright', 'k6']
      },
      config: {
        maxConcurrentTasks: 5,
        timeout: 600000, // 10 minutes for tests
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
    
    this.logger.info(`TestRunner received task: ${type} (${taskId})`);
    
    switch (type) {
      case TaskType.TEST_EXECUTION:
        await this.runTests(taskId, payload);
        break;
      case 'custom':
        await this.handleCustomTestTask(taskId, payload);
        break;
      default:
        this.logger.warn(`Unknown task type for TestRunner: ${type}`);
        this.completeTask(taskId, { error: `Unknown task type: ${type}` });
    }
  }

  private async runTests(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Running tests for task: ${taskId}`);
      
      const { testType, framework, files, options } = payload;
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock test results
      const testResults = this.generateMockTestResults(testType, framework);
      
      const result = {
        testResults,
        coverage: {
          statements: 85,
          branches: 78,
          functions: 92,
          lines: 87
        },
        performance: {
          totalTime: 2.5,
          averageTime: 0.8,
          slowestTest: 'integration.test.js'
        },
        summary: {
          total: testResults.length,
          passed: testResults.filter((t: any) => t.status === 'passed').length,
          failed: testResults.filter((t: any) => t.status === 'failed').length,
          skipped: testResults.filter((t: any) => t.status === 'skipped').length
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Test execution failed: ${error}`);
    }
  }

  private generateMockTestResults(testType: string, framework: string): any[] {
    const testResults = [];
    const testCount = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 0; i < testCount; i++) {
      const status = Math.random() > 0.1 ? 'passed' : 'failed';
      testResults.push({
        name: `Test ${i + 1}`,
        status,
        duration: Math.random() * 2 + 0.1,
        error: status === 'failed' ? 'Assertion failed' : null,
        file: `test-${i}.test.js`,
        line: Math.floor(Math.random() * 100) + 1
      });
    }
    
    return testResults;
  }

  private async handleCustomTestTask(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Handling custom test task: ${taskId}`);
      
      const { action, testConfig } = payload;
      
      let result;
      switch (action) {
        case 'generate_tests':
          result = this.generateTestFiles(testConfig);
          break;
        case 'analyze_coverage':
          result = this.analyzeTestCoverage(testConfig);
          break;
        case 'optimize_tests':
          result = this.optimizeTests(testConfig);
          break;
        default:
          result = { error: `Unknown test action: ${action}` };
      }
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Custom test task failed: ${error}`);
    }
  }

  private generateTestFiles(config: any): any {
    return {
      generatedTests: [
        'unit.test.js',
        'integration.test.js',
        'e2e.test.js'
      ],
      templates: {
        unit: 'describe("Unit Test", () => { ... })',
        integration: 'describe("Integration Test", () => { ... })',
        e2e: 'describe("E2E Test", () => { ... })'
      },
      timestamp: new Date().toISOString()
    };
  }

  private analyzeTestCoverage(config: any): any {
    return {
      coverage: {
        statements: 85,
        branches: 78,
        functions: 92,
        lines: 87
      },
      recommendations: [
        'Add tests for error handling paths',
        'Increase coverage for utility functions',
        'Add integration tests for API endpoints'
      ],
      timestamp: new Date().toISOString()
    };
  }

  private optimizeTests(config: any): any {
    return {
      optimizations: [
        'Parallel test execution enabled',
        'Reduced test setup time by 30%',
        'Optimized test data generation',
        'Cached test fixtures'
      ],
      performance: {
        before: { totalTime: 5.2, averageTime: 1.3 },
        after: { totalTime: 3.8, averageTime: 0.9 }
      },
      timestamp: new Date().toISOString()
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