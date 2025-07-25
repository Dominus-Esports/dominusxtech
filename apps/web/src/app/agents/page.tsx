'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './agents.module.css';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'error';
  type: 'assistant' | 'coder' | 'reviewer' | 'tester' | 'custom';
  lastActivity: string;
  capabilities: string[];
  memory: {
    used: number;
    total: number;
  };
  processId?: number;
  config: AgentConfig;
}

interface AgentConfig {
  name: string;
  type: Agent['type'];
  capabilities: string[];
  maxMemory: number;
  autoRestart: boolean;
  environment: Record<string, string>;
}

interface AgentService {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  agents: Agent[];
  uptime: string;
  startTime: Date;
}

interface WebSocketMessage {
  type: string;
  data: any;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [services, setServices] = useState<AgentService[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newAgentConfig, setNewAgentConfig] = useState({
    name: '',
    type: 'assistant' as Agent['type'],
    capabilities: [] as string[]
  });
  const [messageToSend, setMessageToSend] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3001');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        addLog('Connected to background service');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        addLog('Disconnected from background service');
        // Reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('WebSocket connection error');
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'initial':
        setAgents(message.data.agents || []);
        setServices(message.data.services || []);
        addLog('Received initial agent data');
        break;
      case 'agent:created':
        setAgents(prev => [...prev, message.data]);
        addLog(`Agent created: ${message.data.name}`);
        break;
      case 'agent:launched':
        setAgents(prev => prev.map(agent => 
          agent.id === message.data.id ? message.data : agent
        ));
        addLog(`Agent launched: ${message.data.name}`);
        break;
      case 'agent:terminated':
        setAgents(prev => prev.map(agent => 
          agent.id === message.data.id ? message.data : agent
        ));
        addLog(`Agent terminated: ${message.data.name}`);
        break;
      case 'agent:restarted':
        setAgents(prev => prev.map(agent => 
          agent.id === message.data.id ? message.data : agent
        ));
        addLog(`Agent restarted: ${message.data.name}`);
        break;
      case 'agent:activity':
        setAgents(prev => prev.map(agent => 
          agent.id === message.data.agent.id ? message.data.agent : agent
        ));
        addLog(`Agent activity: ${message.data.agent.name} - ${message.data.activity}`);
        break;
      case 'agent:response':
        addLog(`Agent response: ${message.data.response}`);
        break;
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  };

  const sendWebSocketMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  const launchNewAgent = () => {
    if (!newAgentConfig.name) return;

    const agentData = {
      name: newAgentConfig.name,
      type: newAgentConfig.type,
      capabilities: newAgentConfig.capabilities,
      maxMemory: 100,
      autoRestart: true,
      environment: {}
    };

    sendWebSocketMessage('create_agent', agentData);
    setNewAgentConfig({ name: '', type: 'assistant', capabilities: [] });
    setShowModal(false);
  };

  const launchAgent = (agentId: string) => {
    sendWebSocketMessage('launch_agent', { agentId });
  };

  const terminateAgent = (agentId: string) => {
    sendWebSocketMessage('terminate_agent', { agentId });
  };

  const restartAgent = (agentId: string) => {
    sendWebSocketMessage('restart_agent', { agentId });
  };

  const sendMessageToAgent = (agentId: string, message: string) => {
    if (!message.trim()) return;
    
    sendWebSocketMessage('send_message', { agentId, message });
    setMessageToSend('');
    addLog(`Message sent to agent: ${message}`);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'busy': return '#3b82f6';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getServiceStatusColor = (status: AgentService['status']) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'stopped': return '#ef4444';
      case 'starting': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAgentTypeIcon = (type: Agent['type']) => {
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
        <h1>Agent Management System</h1>
        <div className={styles.connectionStatus}>
          <div className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.servicesSection}>
          <h2>Background Services</h2>
          <div className={styles.servicesGrid}>
            {services.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <h3>{service.name}</h3>
                  <div className={styles.serviceStatus}>
                    <div 
                      className={styles.statusDot} 
                      style={{ backgroundColor: getServiceStatusColor(service.status) }}
                    />
                    <span>{service.status}</span>
                  </div>
                </div>
                <div className={styles.serviceInfo}>
                  <p>Uptime: {service.uptime}</p>
                  <p>Agents: {service.agents.length}</p>
                </div>
                <div className={styles.serviceAgents}>
                  {service.agents.map(agent => (
                    <div key={agent.id} className={styles.agentItem}>
                      <span>{getAgentTypeIcon(agent.type)} {agent.name}</span>
                      <div 
                        className={styles.statusDot} 
                        style={{ backgroundColor: getStatusColor(agent.status) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.agentsSection}>
          <div className={styles.agentsHeader}>
            <h2>Active Agents ({agents.length})</h2>
            <button className={styles.launchButton} onClick={() => setShowModal(true)}>
              + Launch New Agent
            </button>
          </div>

          <div className={styles.agentsGrid}>
            {agents.map(agent => (
              <div 
                key={agent.id} 
                className={`${styles.agentCard} ${selectedAgent?.id === agent.id ? styles.selected : ''}`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className={styles.agentHeader}>
                  <div className={styles.agentTitle}>
                    <span className={styles.agentIcon}>{getAgentTypeIcon(agent.type)}</span>
                    <h3>{agent.name}</h3>
                  </div>
                  <div 
                    className={styles.statusDot} 
                    style={{ backgroundColor: getStatusColor(agent.status) }}
                  />
                </div>
                <div className={styles.agentInfo}>
                  <p>Type: {agent.type}</p>
                  <p>Last Activity: {agent.lastActivity}</p>
                  <div className={styles.memoryBar}>
                    <span>Memory: {agent.memory.used.toFixed(1)}%</span>
                    <div className={styles.memoryProgress}>
                      <div 
                        className={styles.memoryFill} 
                        style={{ width: `${agent.memory.used}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.capabilities}>
                  {agent.capabilities.map(cap => (
                    <span key={cap} className={styles.capability}>{cap}</span>
                  ))}
                </div>
                <div className={styles.agentActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      launchAgent(agent.id);
                    }}
                  >
                    Launch
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      restartAgent(agent.id);
                    }}
                  >
                    Restart
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      terminateAgent(agent.id);
                    }}
                  >
                    Terminate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedAgent && (
          <div className={styles.agentDetails}>
            <h3>Agent Details: {selectedAgent.name}</h3>
            <div className={styles.detailGrid}>
              <div>
                <strong>Status:</strong> {selectedAgent.status}
              </div>
              <div>
                <strong>Type:</strong> {selectedAgent.type}
              </div>
              <div>
                <strong>Last Activity:</strong> {selectedAgent.lastActivity}
              </div>
              <div>
                <strong>Memory Usage:</strong> {selectedAgent.memory.used.toFixed(1)}% / {selectedAgent.memory.total}%
              </div>
              <div>
                <strong>Process ID:</strong> {selectedAgent.processId || 'N/A'}
              </div>
              <div>
                <strong>Capabilities:</strong> {selectedAgent.capabilities.length}
              </div>
            </div>
            
            <div className={styles.messageSection}>
              <h4>Send Message to Agent</h4>
              <div className={styles.messageInput}>
                <input
                  type="text"
                  value={messageToSend}
                  onChange={(e) => setMessageToSend(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessageToAgent(selectedAgent.id, messageToSend);
                    }
                  }}
                />
                <button 
                  onClick={() => sendMessageToAgent(selectedAgent.id, messageToSend)}
                  className={styles.sendButton}
                >
                  Send
                </button>
              </div>
            </div>

            <div className={styles.logsSection}>
              <h4>Activity Logs</h4>
              <div className={styles.logsContainer}>
                {logs.slice(-10).map((log, index) => (
                  <div key={index} className={styles.logEntry}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Agent Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Launch New Agent</h3>
            <div className={styles.formGroup}>
              <label>Agent Name:</label>
              <input 
                type="text" 
                value={newAgentConfig.name}
                onChange={(e) => setNewAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter agent name"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Agent Type:</label>
              <select 
                value={newAgentConfig.type}
                onChange={(e) => setNewAgentConfig(prev => ({ ...prev, type: e.target.value as Agent['type'] }))}
              >
                <option value="assistant">🤖 Assistant</option>
                <option value="coder">💻 Coder</option>
                <option value="reviewer">🔍 Reviewer</option>
                <option value="tester">🧪 Tester</option>
                <option value="custom">⚙️ Custom</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Capabilities:</label>
              <div className={styles.capabilityCheckboxes}>
                {['Code Analysis', 'File Management', 'Git Operations', 'Testing', 'Documentation'].map(cap => (
                  <label key={cap}>
                    <input 
                      type="checkbox"
                      checked={newAgentConfig.capabilities.includes(cap)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAgentConfig(prev => ({ 
                            ...prev, 
                            capabilities: [...prev.capabilities, cap] 
                          }));
                        } else {
                          setNewAgentConfig(prev => ({ 
                            ...prev, 
                            capabilities: prev.capabilities.filter(c => c !== cap) 
                          }));
                        }
                      }}
                    />
                    {cap}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={launchNewAgent} className={styles.launchButton}>
                Launch Agent
              </button>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}