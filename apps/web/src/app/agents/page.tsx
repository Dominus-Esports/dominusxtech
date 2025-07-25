'use client';

import { useState, useEffect } from 'react';
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
}

interface AgentService {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  agents: Agent[];
  uptime: string;
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

  useEffect(() => {
    // Simulate WebSocket connection
    const connectToAgentService = () => {
      setIsConnected(true);
      // Initialize with mock data
      setServices([
        {
          id: 'sol-main',
          name: 'S.O.L. - Main Agent',
          status: 'running',
          uptime: '2h 34m',
          agents: [
            {
              id: 'sol-1',
              name: 'S.O.L. Core',
              status: 'active',
              type: 'assistant',
              lastActivity: '2 minutes ago',
              capabilities: ['Code Analysis', 'File Management', 'Git Operations'],
              memory: { used: 45, total: 100 }
            }
          ]
        }
      ]);
    };

    connectToAgentService();
  }, []);

  const launchNewAgent = () => {
    if (!newAgentConfig.name) return;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentConfig.name,
      status: 'idle',
      type: newAgentConfig.type,
      lastActivity: 'Just launched',
      capabilities: newAgentConfig.capabilities,
      memory: { used: 0, total: 100 }
    };

    setAgents(prev => [...prev, newAgent]);
    setNewAgentConfig({ name: '', type: 'assistant', capabilities: [] });
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
                      <span>{agent.name}</span>
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
            <h2>Active Agents</h2>
            <button className={styles.launchButton} onClick={() => setNewAgentConfig({ name: '', type: 'assistant', capabilities: [] })}>
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
                  <h3>{agent.name}</h3>
                  <div 
                    className={styles.statusDot} 
                    style={{ backgroundColor: getStatusColor(agent.status) }}
                  />
                </div>
                <div className={styles.agentInfo}>
                  <p>Type: {agent.type}</p>
                  <p>Last Activity: {agent.lastActivity}</p>
                  <div className={styles.memoryBar}>
                    <span>Memory: {agent.memory.used}%</span>
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
                <strong>Memory Usage:</strong> {selectedAgent.memory.used}% / {selectedAgent.memory.total}%
              </div>
            </div>
            <div className={styles.agentActions}>
              <button className={styles.actionButton}>Send Message</button>
              <button className={styles.actionButton}>View Logs</button>
              <button className={styles.actionButton}>Restart</button>
              <button className={styles.actionButton}>Terminate</button>
            </div>
          </div>
        )}
      </div>

      {/* New Agent Modal */}
      {newAgentConfig.name === '' && (
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
                <option value="assistant">Assistant</option>
                <option value="coder">Coder</option>
                <option value="reviewer">Reviewer</option>
                <option value="tester">Tester</option>
                <option value="custom">Custom</option>
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
              <button onClick={() => setNewAgentConfig({ name: '', type: 'assistant', capabilities: [] })} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}