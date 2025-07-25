import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { AgentManager } from './services/agent-manager';
import { AgentType, AgentStatus, TaskStatus } from './types';
import { Logger } from './utils/logger';
import { OrchestratorConfig } from './types';

class Orchestrator {
  private app: express.Application;
  private server: any;
  private io: Server;
  private agentManager: AgentManager;
  private logger: Logger;
  private config: OrchestratorConfig;

  constructor() {
    this.logger = new Logger('Orchestrator');
    this.config = this.loadConfig();
    this.agentManager = new AgentManager();
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: this.config.corsOrigins,
        methods: ['GET', 'POST']
      }
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupEventListeners();
  }

  private loadConfig(): OrchestratorConfig {
    return {
      port: parseInt(process.env.PORT || '3001'),
      maxAgents: parseInt(process.env.MAX_AGENTS || '50'),
      heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL || '30000'),
      taskTimeout: parseInt(process.env.TASK_TIMEOUT || '300000'),
      enableLogging: process.env.ENABLE_LOGGING !== 'false',
      enableMetrics: process.env.ENABLE_METRICS !== 'false',
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
    };
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: this.config.corsOrigins,
      credentials: true
    }));
    
    if (this.config.enableLogging) {
      this.app.use(morgan('combined'));
    }
    
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files for dashboard
    this.app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      const health = this.agentManager.getSystemHealth();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        ...health
      });
    });

    // Agent management
    this.app.post('/agents', (req, res) => {
      try {
        const agent = this.agentManager.registerAgent(req.body);
        res.status(201).json(agent);
      } catch (error) {
        this.logger.error('Failed to register agent', error);
        res.status(400).json({ error: 'Invalid agent data' });
      }
    });

    this.app.get('/agents', (req, res) => {
      const agents = this.agentManager.getAllAgents();
      res.json(agents);
    });

    this.app.get('/agents/:id', (req, res) => {
      const agent = this.agentManager.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.json(agent);
    });

    this.app.delete('/agents/:id', (req, res) => {
      const success = this.agentManager.unregisterAgent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.status(204).send();
    });

    this.app.patch('/agents/:id/status', (req, res) => {
      const { status } = req.body;
      const success = this.agentManager.updateAgentStatus(req.params.id, status);
      if (!success) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.json({ success: true });
    });

    // Task management
    this.app.post('/tasks', (req, res) => {
      try {
        const { agentId, type, payload, priority } = req.body;
        const task = this.agentManager.createTask(agentId, type, payload, priority);
        res.status(201).json(task);
      } catch (error) {
        this.logger.error('Failed to create task', error);
        res.status(400).json({ error: 'Invalid task data' });
      }
    });

    this.app.get('/tasks', (req, res) => {
      const { agentId, status } = req.query;
      let tasks;
      
      if (agentId) {
        tasks = this.agentManager.getTasksByAgent(agentId as string);
      } else if (status) {
        tasks = Array.from(this.agentManager['tasks'].values())
          .filter(task => task.status === status);
      } else {
        tasks = Array.from(this.agentManager['tasks'].values());
      }
      
      res.json(tasks);
    });

    this.app.get('/tasks/:id', (req, res) => {
      const task = this.agentManager.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(task);
    });

    this.app.post('/tasks/:id/assign', (req, res) => {
      const { agentId } = req.body;
      const success = this.agentManager.assignTask(req.params.id, agentId);
      if (!success) {
        return res.status(400).json({ error: 'Failed to assign task' });
      }
      return res.json({ success: true });
    });

    this.app.post('/tasks/:id/complete', (req, res) => {
      const { result } = req.body;
      const success = this.agentManager.completeTask(req.params.id, result);
      if (!success) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json({ success: true });
    });

    this.app.post('/tasks/:id/fail', (req, res) => {
      const { error } = req.body;
      const success = this.agentManager.failTask(req.params.id, error);
      if (!success) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json({ success: true });
    });

    // Metrics
    this.app.get('/metrics/agents/:id', (req, res) => {
      const metrics = this.agentManager.getAgentMetrics(req.params.id);
      if (!metrics) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.json(metrics);
    });

    this.app.get('/metrics/system', (req, res) => {
      const health = this.agentManager.getSystemHealth();
      res.json(health);
    });

    // Agent discovery
    this.app.get('/agents/available', (req, res) => {
      const agents = this.agentManager.getAvailableAgents();
      res.json(agents);
    });

    this.app.get('/agents/type/:type', (req, res) => {
      const agents = this.agentManager.getAgentsByType(req.params.type as AgentType);
      res.json(agents);
    });
  }

  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      this.logger.info(`Client connected: ${socket.id}`);

      socket.on('agent:register', (data) => {
        try {
          const agent = this.agentManager.registerAgent(data);
          socket.emit('agent:registered', agent);
          this.io.emit('agent:list_updated', this.agentManager.getAllAgents());
        } catch (error) {
          socket.emit('error', { message: 'Failed to register agent' });
        }
      });

      socket.on('agent:unregister', (agentId) => {
        const success = this.agentManager.unregisterAgent(agentId);
        if (success) {
          socket.emit('agent:unregistered', { agentId });
          this.io.emit('agent:list_updated', this.agentManager.getAllAgents());
        } else {
          socket.emit('error', { message: 'Agent not found' });
        }
      });

      socket.on('agent:status_update', (data) => {
        const { agentId, status } = data;
        const success = this.agentManager.updateAgentStatus(agentId, status);
        if (success) {
          this.io.emit('agent:status_updated', { agentId, status });
        }
      });

      socket.on('task:create', (data) => {
        try {
          const task = this.agentManager.createTask(
            data.agentId,
            data.type,
            data.payload,
            data.priority
          );
          socket.emit('task:created', task);
          this.io.emit('task:list_updated', Array.from(this.agentManager['tasks'].values()));
        } catch (error) {
          socket.emit('error', { message: 'Failed to create task' });
        }
      });

      socket.on('task:assign', (data) => {
        const { taskId, agentId } = data;
        const success = this.agentManager.assignTask(taskId, agentId);
        if (success) {
          this.io.emit('task:assigned', { taskId, agentId });
        } else {
          socket.emit('error', { message: 'Failed to assign task' });
        }
      });

      socket.on('task:complete', (data) => {
        const { taskId, result } = data;
        const success = this.agentManager.completeTask(taskId, result);
        if (success) {
          this.io.emit('task:completed', { taskId, result });
        } else {
          socket.emit('error', { message: 'Task not found' });
        }
      });

      socket.on('task:fail', (data) => {
        const { taskId, error } = data;
        const success = this.agentManager.failTask(taskId, error);
        if (success) {
          this.io.emit('task:failed', { taskId, error });
        } else {
          socket.emit('error', { message: 'Task not found' });
        }
      });

      socket.on('message:send', (data) => {
        const message = this.agentManager.sendMessage(data);
        this.io.emit('message:received', message);
      });

      socket.on('disconnect', () => {
        this.logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupEventListeners(): void {
    this.agentManager.on('agent:registered', (agent) => {
      this.io.emit('agent:registered', agent);
      this.io.emit('agent:list_updated', this.agentManager.getAllAgents());
    });

    this.agentManager.on('agent:unregistered', (agent) => {
      this.io.emit('agent:unregistered', agent);
      this.io.emit('agent:list_updated', this.agentManager.getAllAgents());
    });

    this.agentManager.on('agent:status_updated', (agent) => {
      this.io.emit('agent:status_updated', agent);
    });

    this.agentManager.on('task:created', (task) => {
      this.io.emit('task:created', task);
      this.io.emit('task:list_updated', Array.from(this.agentManager['tasks'].values()));
    });

    this.agentManager.on('task:assigned', (task) => {
      this.io.emit('task:assigned', task);
    });

    this.agentManager.on('task:completed', (task) => {
      this.io.emit('task:completed', task);
      this.io.emit('task:list_updated', Array.from(this.agentManager['tasks'].values()));
    });

    this.agentManager.on('task:failed', (task) => {
      this.io.emit('task:failed', task);
      this.io.emit('task:list_updated', Array.from(this.agentManager['tasks'].values()));
    });

    this.agentManager.on('message:sent', (message) => {
      this.io.emit('message:sent', message);
    });
  }

  public start(): void {
    this.server.listen(this.config.port, () => {
      this.logger.info(`Orchestrator started on port ${this.config.port}`);
      this.logger.info(`WebSocket server ready for connections`);
      this.logger.info(`Health check available at http://localhost:${this.config.port}/health`);
    });
  }

  public stop(): void {
    this.agentManager.stop();
    this.server.close(() => {
      this.logger.info('Orchestrator stopped');
    });
  }
}

// Start the orchestrator
const orchestrator = new Orchestrator();

// Handle graceful shutdown
process.on('SIGINT', () => {
  orchestrator.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  orchestrator.stop();
  process.exit(0);
});

orchestrator.start();