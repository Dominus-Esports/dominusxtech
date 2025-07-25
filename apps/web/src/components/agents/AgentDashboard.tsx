'use client';

import React, { useState } from 'react';
import { useAgentService } from '../../lib/agents/useAgentService';
import AgentCard from './AgentCard';
import TaskList from './TaskList';
import SystemStats from './SystemStats';
import AgentLauncher from './AgentLauncher';
import CollaborationNetwork from './CollaborationNetwork';
import NotificationCenter from './NotificationCenter';
import styles from './AgentDashboard.module.css';

export default function AgentDashboard() {
  const {
    agents,
    tasks,
    stats,
    addAgent,
    removeAgent,
    updateAgentStatus,
    assignTask,
    launchSpecializedAgent
  } = useAgentService();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showLauncher, setShowLauncher] = useState(false);

  const handleLaunchAgent = (type: string, capabilities: string[]) => {
    launchSpecializedAgent(type, capabilities);
    setShowLauncher(false);
  };

  const handleAssignTask = (agentId: string, taskType: string, description: string) => {
    assignTask({
      agentId,
      type: taskType as any,
      priority: 'medium',
      description
    });
  };

  const primaryAgent = agents.find(agent => agent.type === 'primary');
  const specializedAgents = agents.filter(agent => agent.type === 'specialized');

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Agent Management System</h1>
        <div className={styles.headerActions}>
          <NotificationCenter />
          <button 
            className={styles.launchButton}
            onClick={() => setShowLauncher(true)}
          >
            Launch New Agent
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <SystemStats stats={stats} />
          
          <section className={styles.primaryAgent}>
            <h2>Primary Agent (S.O.L.)</h2>
            {primaryAgent && (
              <AgentCard
                agent={primaryAgent}
                tasks={tasks.filter(task => task.agentId === primaryAgent.id)}
                onStatusChange={(status) => updateAgentStatus(primaryAgent.id, status)}
                onRemove={() => removeAgent(primaryAgent.id)}
                onAssignTask={(taskType, description) => 
                  handleAssignTask(primaryAgent.id, taskType, description)
                }
                isSelected={selectedAgent === primaryAgent.id}
                onSelect={() => setSelectedAgent(primaryAgent.id)}
              />
            )}
          </section>

          <section className={styles.specializedAgents}>
            <h2>Specialized Agents ({specializedAgents.length})</h2>
            <div className={styles.agentGrid}>
              {specializedAgents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  tasks={tasks.filter(task => task.agentId === agent.id)}
                  onStatusChange={(status) => updateAgentStatus(agent.id, status)}
                  onRemove={() => removeAgent(agent.id)}
                  onAssignTask={(taskType, description) => 
                    handleAssignTask(agent.id, taskType, description)
                  }
                  isSelected={selectedAgent === agent.id}
                  onSelect={() => setSelectedAgent(agent.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.rightPanel}>
          <TaskList 
            tasks={tasks}
            agents={agents}
            onAssignTask={handleAssignTask}
          />
          
          <CollaborationNetwork
            agents={agents}
            selectedAgentId={selectedAgent}
            onAgentSelect={setSelectedAgent}
          />
        </div>
      </div>

      {showLauncher && (
        <AgentLauncher
          onLaunch={handleLaunchAgent}
          onClose={() => setShowLauncher(false)}
        />
      )}
    </div>
  );
}