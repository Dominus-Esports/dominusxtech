'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './dashboard.module.css';

interface SystemStatus {
  isRunning: boolean;
  totalAgents: number;
  activeAgents: number;
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
}

interface AgentMetrics {
  id: string;
  name: string;
  type: string;
  status: string;
  memoryUsed: number;
  memoryTotal: number;
  lastActivity: string;
  responseTime: number;
  messagesSent: number;
  messagesReceived: number;
}

export default function DashboardPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3001');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        addLog('Dashboard connected to background service');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        addLog('Dashboard disconnected from background service');
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();
    fetchSystemStatus();

    const interval = setInterval(fetchSystemStatus, 5000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001');
      if (response.ok) {
        const data = await response.json();
        setSystemStatus({
          isRunning: data.status === 'running',
          totalAgents: data.agents.length,
          activeAgents: data.agents.filter((a: any) => a.status === 'active').length,
          uptime: data.uptime,
          memoryUsage: data.agents.reduce((sum: number, agent: any) => sum + agent.memory.used, 0),
          cpuUsage: Math.random() * 30 + 20 // Simulated CPU usage
        });
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'initial':
        updateAgentMetrics(message.data.agents);
        break;
      case 'agent:created':
      case 'agent:launched':
      case 'agent:terminated':
      case 'agent:restarted':
        updateAgentMetrics(message.data);
        break;
      case 'agent:activity':
        addLog(`Activity: ${message.data.agent.name} - ${message.data.activity}`);
        break;
    }
  };

  const updateAgentMetrics = (agents: any[]) => {
    const metrics = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      status: agent.status,
      memoryUsed: agent.memory.used,
      memoryTotal: agent.memory.total,
      lastActivity: agent.lastActivity,
      responseTime: Math.random() * 100 + 50, // Simulated response time
      messagesSent: Math.floor(Math.random() * 20), // Simulated message count
      messagesReceived: Math.floor(Math.random() * 15)
    }));
    setAgentMetrics(metrics);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'busy': return '#3b82f6';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'assistant': return '🤖';
      case 'coder': return '💻';
      case 'reviewer': return '🔍';
      case 'tester': return '🧪';
      case 'custom': return '⚙️';
      default: return '🤖';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>System Dashboard</h1>
        <div className={styles.connectionStatus}>
          <div className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* System Overview */}
        <div className={styles.overviewSection}>
          <h2>System Overview</h2>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricContent}>
                <h3>Total Agents</h3>
                <p className={styles.metricValue}>{systemStatus?.totalAgents || 0}</p>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>✅</div>
              <div className={styles.metricContent}>
                <h3>Active Agents</h3>
                <p className={styles.metricValue}>{systemStatus?.activeAgents || 0}</p>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>⏱️</div>
              <div className={styles.metricContent}>
                <h3>Uptime</h3>
                <p className={styles.metricValue}>{systemStatus?.uptime || '0h 0m'}</p>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💾</div>
              <div className={styles.metricContent}>
                <h3>Memory Usage</h3>
                <p className={styles.metricValue}>{systemStatus?.memoryUsage.toFixed(1) || 0}%</p>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🖥️</div>
              <div className={styles.metricContent}>
                <h3>CPU Usage</h3>
                <p className={styles.metricValue}>{systemStatus?.cpuUsage.toFixed(1) || 0}%</p>
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🔗</div>
              <div className={styles.metricContent}>
                <h3>Connection</h3>
                <p className={styles.metricValue}>{isConnected ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Metrics */}
        <div className={styles.agentsSection}>
          <h2>Agent Performance Metrics</h2>
          <div className={styles.agentsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Agent</div>
              <div className={styles.tableCell}>Type</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Memory</div>
              <div className={styles.tableCell}>Response Time</div>
              <div className={styles.tableCell}>Messages</div>
              <div className={styles.tableCell}>Last Activity</div>
            </div>
            {agentMetrics.map(agent => (
              <div key={agent.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.agentInfo}>
                    <span className={styles.agentIcon}>{getAgentTypeIcon(agent.type)}</span>
                    <span>{agent.name}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>{agent.type}</div>
                <div className={styles.tableCell}>
                  <div className={styles.statusIndicator}>
                    <div 
                      className={styles.statusDot} 
                      style={{ backgroundColor: getStatusColor(agent.status) }}
                    />
                    <span>{agent.status}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.memoryBar}>
                    <span>{agent.memoryUsed.toFixed(1)}%</span>
                    <div className={styles.memoryProgress}>
                      <div 
                        className={styles.memoryFill} 
                        style={{ width: `${agent.memoryUsed}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.tableCell}>{agent.responseTime.toFixed(0)}ms</div>
                <div className={styles.tableCell}>
                  <div className={styles.messageCount}>
                    <span>📤 {agent.messagesSent}</span>
                    <span>📥 {agent.messagesReceived}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>{agent.lastActivity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Logs */}
        <div className={styles.logsSection}>
          <h2>Real-time Activity Logs</h2>
          <div className={styles.logsContainer}>
            {logs.map((log, index) => (
              <div key={index} className={styles.logEntry}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}