export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  lastActive: Date;
  config: AgentConfig;
}

export enum AgentType {
  CURSOR_MAIN = 'cursor_main',
  CODE_ASSISTANT = 'code_assistant',
  TEST_RUNNER = 'test_runner',
  DEBUGGER = 'debugger',
  LINTER = 'linter',
  DOCUMENTATION = 'documentation',
  DEPLOYMENT = 'deployment',
  MONITORING = 'monitoring',
  CUSTOM = 'custom'
}

export enum AgentStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  BUSY = 'busy',
  ERROR = 'error',
  OFFLINE = 'offline'
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  timeout: number;
  retryAttempts: number;
  priority: number;
  autoRestart: boolean;
  healthCheckInterval: number;
}

export interface Task {
  id: string;
  agentId: string;
  type: TaskType;
  status: TaskStatus;
  payload: any;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: number;
}

export enum TaskType {
  CODE_ANALYSIS = 'code_analysis',
  TEST_EXECUTION = 'test_execution',
  DEBUG_SESSION = 'debug_session',
  LINT_CHECK = 'lint_check',
  DOC_GENERATION = 'doc_generation',
  DEPLOY = 'deploy',
  MONITOR = 'monitor',
  CUSTOM = 'custom'
}

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: MessageType;
  payload: any;
  timestamp: Date;
  priority: number;
}

export enum MessageType {
  TASK_REQUEST = 'task_request',
  TASK_RESPONSE = 'task_response',
  STATUS_UPDATE = 'status_update',
  HEALTH_CHECK = 'health_check',
  CONFIG_UPDATE = 'config_update',
  BROADCAST = 'broadcast'
}

export interface OrchestratorConfig {
  port: number;
  maxAgents: number;
  heartbeatInterval: number;
  taskTimeout: number;
  enableLogging: boolean;
  enableMetrics: boolean;
  corsOrigins: string[];
}

export interface AgentMetrics {
  agentId: string;
  tasksCompleted: number;
  tasksFailed: number;
  averageResponseTime: number;
  uptime: number;
  lastHealthCheck: Date;
}

export interface SystemHealth {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  pendingTasks: number;
  systemLoad: number;
  memoryUsage: number;
  cpuUsage: number;
}