import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus, TaskType, MessageType } from '../types';
import { Logger } from '../utils/logger';

export class MonitoringAgent {
  private socket: Socket;
  private agentId: string | null = null;
  private logger: Logger;
  private isConnected: boolean = false;
  private metrics: Map<string, any> = new Map();
  private alerts: any[] = [];
  private healthChecks: Map<string, any> = new Map();

  constructor(private orchestratorUrl: string = 'http://localhost:3001') {
    this.logger = new Logger('MonitoringAgent');
    this.socket = io(this.orchestratorUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logger.info('MonitoringAgent connected to orchestrator');
      this.registerAgent();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.logger.warn('MonitoringAgent disconnected from orchestrator');
    });

    this.socket.on('agent:registered', (agent: any) => {
      this.agentId = agent.id;
      this.logger.info(`MonitoringAgent registered as agent: ${agent.name} (${agent.id})`);
    });

    this.socket.on('task:assigned', (data: any) => {
      this.handleTask(data);
    });

    this.socket.on('error', (error: any) => {
      this.logger.error('MonitoringAgent socket error:', error);
    });
  }

  private registerAgent(): void {
    const agentData = {
      name: 'Monitoring Agent',
      type: AgentType.MONITORING,
      status: AgentStatus.IDLE,
      capabilities: [
        'performance_monitoring',
        'health_checking',
        'alert_generation',
        'metrics_collection',
        'anomaly_detection',
        'capacity_planning',
        'trend_analysis',
        'report_generation'
      ],
      metadata: {
        version: '1.0.0',
        description: 'Specialized agent for system monitoring and alerting',
        monitoringTypes: ['performance', 'health', 'security', 'business'],
        features: ['real_time_monitoring', 'predictive_analytics', 'automated_alerting']
      },
      config: {
        maxConcurrentTasks: 6,
        timeout: 600000, // 10 minutes for monitoring tasks
        retryAttempts: 3,
        priority: 1,
        autoRestart: true,
        healthCheckInterval: 15000 // More frequent checks
      }
    };

    this.socket.emit('agent:register', agentData);
  }

  private async handleTask(data: any): Promise<void> {
    const { taskId, agentId, type, payload } = data;
    
    this.logger.info(`MonitoringAgent received task: ${type} (${taskId})`);
    
    switch (type) {
      case 'monitor':
        await this.monitorSystem(taskId, payload);
        break;
      case 'health_check':
        await this.performHealthCheck(taskId, payload);
        break;
      case 'generate_alerts':
        await this.generateAlerts(taskId, payload);
        break;
      case 'analyze_metrics':
        await this.analyzeMetrics(taskId, payload);
        break;
      case 'custom':
        await this.handleCustomMonitoringTask(taskId, payload);
        break;
      default:
        this.logger.warn(`Unknown task type for MonitoringAgent: ${type}`);
        this.completeTask(taskId, { error: `Unknown task type: ${type}` });
    }
  }

  private async monitorSystem(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Monitoring system for task: ${taskId}`);
      
      const { components, metrics, duration } = payload;
      
      // Simulate system monitoring
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const monitoringData = this.simulateSystemMonitoring(components, metrics);
      
      const result = {
        monitoringData,
        status: 'healthy',
        recommendations: [
          'System performance is optimal',
          'Consider scaling if load increases',
          'Monitor memory usage closely',
          'Backup systems are functioning'
        ],
        trends: {
          cpu: 'stable',
          memory: 'stable',
          disk: 'stable',
          network: 'stable'
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `System monitoring failed: ${error}`);
    }
  }

  private simulateSystemMonitoring(components: string[], metrics: string[]): any {
    const data: any = {};
    
    components.forEach(component => {
      data[component] = {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        uptime: Math.floor(Math.random() * 1000) + 100,
        status: Math.random() > 0.1 ? 'healthy' : 'warning'
      };
    });
    
    return data;
  }

  private async performHealthCheck(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Performing health check for task: ${taskId}`);
      
      const { targets, checks } = payload;
      
      // Simulate health checks
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const healthResults = this.simulateHealthChecks(targets, checks);
      
      const result = {
        healthResults,
        overallStatus: healthResults.every((h: any) => h.status === 'healthy') ? 'healthy' : 'degraded',
        issues: healthResults.filter((h: any) => h.status !== 'healthy'),
        recommendations: [
          'All critical services are operational',
          'Monitor response times closely',
          'Consider load balancing if needed'
        ],
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Health check failed: ${error}`);
    }
  }

  private simulateHealthChecks(targets: string[], checks: string[]): any[] {
    return targets.map(target => ({
      target,
      status: Math.random() > 0.15 ? 'healthy' : 'unhealthy',
      responseTime: Math.random() * 1000 + 50,
      lastCheck: new Date().toISOString(),
      checks: checks.map(check => ({
        name: check,
        status: Math.random() > 0.1 ? 'passed' : 'failed',
        details: `Check ${check} completed`
      }))
    }));
  }

  private async generateAlerts(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Generating alerts for task: ${taskId}`);
      
      const { conditions, severity } = payload;
      
      // Simulate alert generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const alerts = this.simulateAlertGeneration(conditions, severity);
      
      const result = {
        alerts,
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter((a: any) => a.severity === 'critical').length,
        recommendations: [
          'Review alert thresholds',
          'Consider automated responses',
          'Update monitoring rules'
        ],
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Alert generation failed: ${error}`);
    }
  }

  private simulateAlertGeneration(conditions: any[], severity: string): any[] {
    const alertTypes = [
      'High CPU Usage',
      'Memory Leak Detected',
      'Disk Space Low',
      'Network Latency High',
      'Service Unavailable',
      'Error Rate Increased'
    ];
    
    return alertTypes.slice(0, Math.floor(Math.random() * 3) + 1).map(type => ({
      id: `alert-${Date.now()}-${Math.random()}`,
      type,
      severity: severity || (Math.random() > 0.7 ? 'critical' : 'warning'),
      message: `Alert: ${type} detected`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }));
  }

  private async analyzeMetrics(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Analyzing metrics for task: ${taskId}`);
      
      const { metrics, timeRange, analysisType } = payload;
      
      // Simulate metrics analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const analysis = this.simulateMetricsAnalysis(metrics, timeRange, analysisType);
      
      const result = {
        analysis,
        insights: [
          'Performance is trending upward',
          'Peak usage occurs during business hours',
          'Weekend usage is significantly lower',
          'Memory usage shows healthy patterns'
        ],
        predictions: {
          nextHour: 'stable',
          nextDay: 'stable',
          nextWeek: 'moderate increase'
        },
        timestamp: new Date().toISOString()
      };
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Metrics analysis failed: ${error}`);
    }
  }

  private simulateMetricsAnalysis(metrics: string[], timeRange: string, type: string): any {
    return {
      trends: metrics.map(metric => ({
        name: metric,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        change: Math.random() * 20 - 10,
        forecast: Math.random() * 30 + 70
      })),
      patterns: [
        'Daily usage patterns detected',
        'Weekly cycles identified',
        'Seasonal variations observed'
      ],
      anomalies: Math.floor(Math.random() * 5),
      correlation: {
        cpu_memory: Math.random() * 0.8 + 0.2,
        disk_network: Math.random() * 0.6 + 0.1
      }
    };
  }

  private async handleCustomMonitoringTask(taskId: string, payload: any): Promise<void> {
    try {
      this.logger.info(`Handling custom monitoring task: ${taskId}`);
      
      const { action, config } = payload;
      
      let result;
      switch (action) {
        case 'capacity_planning':
          result = this.performCapacityPlanning(config);
          break;
        case 'trend_analysis':
          result = this.performTrendAnalysis(config);
          break;
        case 'generate_report':
          result = this.generateMonitoringReport(config);
          break;
        case 'setup_alerting':
          result = this.setupAlerting(config);
          break;
        default:
          result = { error: `Unknown monitoring action: ${action}` };
      }
      
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, `Custom monitoring task failed: ${error}`);
    }
  }

  private performCapacityPlanning(config: any): any {
    return {
      currentCapacity: {
        cpu: '65%',
        memory: '70%',
        disk: '45%',
        network: '30%'
      },
      projectedGrowth: {
        threeMonths: '15%',
        sixMonths: '25%',
        oneYear: '40%'
      },
      recommendations: [
        'Scale horizontally for better performance',
        'Consider upgrading memory in 3 months',
        'Monitor disk usage closely',
        'Network capacity is sufficient'
      ],
      costEstimates: {
        immediate: '$500/month',
        threeMonths: '$800/month',
        sixMonths: '$1200/month'
      }
    };
  }

  private performTrendAnalysis(config: any): any {
    return {
      trends: {
        usage: 'increasing',
        performance: 'stable',
        errors: 'decreasing',
        costs: 'stable'
      },
      seasonality: {
        daily: 'business hours peak',
        weekly: 'weekend dip',
        monthly: 'month-end spike'
      },
      predictions: {
        nextMonth: '10% increase',
        nextQuarter: '20% increase',
        nextYear: '35% increase'
      }
    };
  }

  private generateMonitoringReport(config: any): any {
    return {
      report: {
        summary: 'System health is excellent',
        details: 'All metrics within normal ranges',
        recommendations: 'Continue current monitoring strategy',
        nextSteps: 'Schedule quarterly review'
      },
      metrics: {
        uptime: '99.9%',
        performance: '95%',
        reliability: '98%',
        efficiency: '92%'
      },
      charts: [
        'performance_over_time.png',
        'resource_utilization.png',
        'error_trends.png',
        'capacity_forecast.png'
      ]
    };
  }

  private setupAlerting(config: any): any {
    return {
      alerting: {
        rules: [
          'CPU > 80% for 5 minutes',
          'Memory > 85% for 3 minutes',
          'Disk > 90%',
          'Error rate > 5%'
        ],
        channels: [
          'email: admin@company.com',
          'slack: #alerts',
          'pagerduty: oncall'
        ],
        escalation: {
          level1: '5 minutes',
          level2: '15 minutes',
          level3: '30 minutes'
        }
      },
      status: 'configured'
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