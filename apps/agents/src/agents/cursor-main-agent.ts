import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus, TaskType, MessageType } from '../types';
import { Logger } from '../utils/logger';

export class CursorMainAgent {
  private socket: Socket;
  private agentId: string | null = null;
  private logger: Logger;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(private orchestratorUrl: string = 'http://localhost:3001') {
    this.logger = new Logger('CursorMainAgent');
    this.socket = io(this.orchestratorUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.logger.info('Connected to orchestrator');
      this.registerAgent();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.logger.warn('Disconnected from orchestrator');
      this.attemptReconnect();
    });

    this.socket.on('agent:registered', (agent: any) => {
      this.agentId = agent.id;
      this.logger.info(`Registered as agent: ${agent.name} (${agent.id})`);
    });

    this.socket.on('task:assigned', (data: any) => {
      this.handleTask(data);
    });

    this.socket.on('message:received', (message: any) => {
      this.handleMessage(message);
    });

    this.socket.on('error', (error: any) => {
      this.logger.error('Socket error:', error);
    });
  }

  private registerAgent(): void {
    const agentData = {
      name: 'S.O.L. - Cursor Main Agent',
      type: AgentType.CURSOR_MAIN,
      status: AgentStatus.IDLE,
      capabilities: [
        'code_analysis',
        'task_coordination',
        'agent_management',
        'project_oversight',
        'debugging_assistance',
        'documentation_generation'
      ],
      metadata: {
        version: '1.0.0',
        description: 'Main Cursor IDE agent for coordinating development tasks',
        features: ['multi-agent orchestration', 'real-time collaboration', 'intelligent task routing']
      },
      config: {
        maxConcurrentTasks: 10,
        timeout: 300000,
        retryAttempts: 3,
        priority: 1,
        autoRestart: true,
        healthCheckInterval: 30000
      }
    };

    this.socket.emit('agent:register', agentData);
  }

  private handleTask(data: any): void {
    const { taskId, agentId, type, payload } = data;
    
    this.logger.info(`Received task: ${type} (${taskId})`);
    
    switch (type) {
      case TaskType.CODE_ANALYSIS:
        this.performCodeAnalysis(taskId, payload);
        break;
      case TaskType.DEBUG_SESSION:
        this.assistDebugging(taskId, payload);
        break;
      case TaskType.DOC_GENERATION:
        this.generateDocumentation(taskId, payload);
        break;
      case 'custom':
        this.handleCustomTask(taskId, payload);
        break;
      default:
        this.logger.warn(`Unknown task type: ${type}`);
        this.completeTask(taskId, { error: `Unknown task type: ${type}` });
    }
  }

  private async performCodeAnalysis(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Performing code analysis for task: ${taskId}`);
      
      // Simulate code analysis work
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        analysis: {
          complexity: 'medium',
          issues: ['potential memory leak', 'unused variable'],
          suggestions: ['add error handling', 'optimize loop'],
          score: 85
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Code analysis failed: ${error}`);
    }
  }

  private async assistDebugging(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Assisting with debugging for task: ${taskId}`);
      
      // Simulate debugging assistance
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        debugging: {
          breakpoints: payload.breakpoints || [],
          variables: payload.variables || {},
          callStack: payload.callStack || [],
          suggestions: ['check variable scope', 'verify data types']
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Debugging assistance failed: ${error}`);
    }
  }

  private async generateDocumentation(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Generating documentation for task: ${taskId}`);
      
      // Simulate documentation generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = {
        documentation: {
          apiDocs: payload.apiDocs || {},
          readme: payload.readme || '',
          comments: payload.comments || [],
          diagrams: payload.diagrams || []
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Documentation generation failed: ${error}`);
    }
  }

  private async handleCustomTask(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Handling custom task: ${taskId}`);
      
      // Handle custom task logic
      const result = {
        custom: {
          action: payload.action,
          data: payload.data,
          processed: true
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Custom task failed: ${error}`);
    }
  }

  private handleMessage(message: any): void {
    this.logger.info(`Received message: ${message.type} from ${message.from}`);
    
    switch (message.type) {
      case MessageType.STATUS_UPDATE:
        this.updateStatus(message.payload.status);
        break;
      case MessageType.CONFIG_UPDATE:
        this.updateConfig(message.payload.config);
        break;
      case MessageType.BROADCAST:
        this.handleBroadcast(message.payload);
        break;
      default:
        this.logger.warn(`Unknown message type: ${message.type}`);
    }
  }

  private updateStatus(status: AgentStatus): void {
    this.socket.emit('agent:status_update', {
      agentId: this.agentId,
      status
    });
  }

  private updateConfig(config: any): void {
    this.logger.info('Updating agent configuration');
    // Update local configuration
  }

  private handleBroadcast(payload: any): void {
    this.logger.info(`Broadcast received: ${payload.message}`);
    // Handle broadcast messages
  }

  private completeTask(taskId: string, result: any): void {
    this.socket.emit('task:complete', { taskId, result });
  }

  private failTask(taskId: string, error: string): void {
    this.socket.emit('task:fail', { taskId, error });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.socket.connect();
      }, 5000 * this.reconnectAttempts);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
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

  public broadcastMessage(type: MessageType, payload: any): void {
    this.socket.emit('message:send', {
      from: this.agentId,
      to: 'broadcast',
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