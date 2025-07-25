'use client';

import React, { useState } from 'react';
import { useAgentService } from '../../lib/agents/useAgentService';
import { agentDemo } from '../../lib/demo';
import AgentCard from './AgentCard';
import TaskList from './TaskList';
import SystemStats from './SystemStats';
import AgentLauncher from './AgentLauncher';
import CollaborationPanel from './CollaborationPanel';
import styles from './AgentDashboard.module.css';

type TabType = 'overview' | 'tasks' | 'collaboration' | 'performance';

export default function AgentDashboard() {
  const {
    agents,
    tasks,
    stats,
    addAgent,
    removeAgent,
    updateAgentStatus,
    assignTask,
    launchSpecializedAgent,
    enableCollaboration,
    shareKnowledge
  } = useAgentService();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showLauncher, setShowLauncher] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDemoRunning, setIsDemoRunning] = useState(false);

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

  const handleStartDemo = () => {
    setIsDemoRunning(true);
    agentDemo.startDemo();
    console.log('🎬 Demo started! Check the console for detailed logs.');
  };

  const handleStopDemo = () => {
    setIsDemoRunning(false);
    agentDemo.stopDemo();
  };

  const primaryAgent = agents.find(agent => agent.type === 'primary');
  const specializedAgents = agents.filter(agent => agent.type === 'specialized');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
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
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className={styles.fullWidth}>
            <TaskList 
              tasks={tasks}
              agents={agents}
              onAssignTask={handleAssignTask}
            />
          </div>
        );

      case 'collaboration':
        return (
          <CollaborationPanel
            agents={agents}
            onEnableCollaboration={enableCollaboration}
            onShareKnowledge={shareKnowledge}
          />
        );

      case 'performance':
        return (
          <div className={styles.performanceView}>
            <h2>Agent Performance Analytics</h2>
            <div className={styles.performanceGrid}>
              {agents.map(agent => (
                <div key={agent.id} className={styles.performanceCard}>
                  <h3>{agent.name}</h3>
                  <div className={styles.performanceMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Success Rate</span>
                      <span className={styles.metricValue}>{agent.performance.successRate.toFixed(1)}%</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Tasks Completed</span>
                      <span className={styles.metricValue}>{agent.performance.tasksCompleted}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Avg Task Time</span>
                      <span className={styles.metricValue}>{Math.round(agent.performance.averageTaskTime / 1000)}s</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Uptime</span>
                      <span className={styles.metricValue}>{Math.round(agent.performance.uptime / 1000)}s</span>
                    </div>
                  </div>
                  <div className={styles.collaborationInfo}>
                    <span>Collaborating with: {agent.collaboration.collaboratingWith.length} agents</span>
                    <span>Knowledge shared: {agent.collaboration.sharedKnowledge.length} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Agent Management System</h1>
        <div className={styles.headerActions}>
          {!isDemoRunning ? (
            <button 
              className={styles.demoButton}
              onClick={handleStartDemo}
            >
              🎬 Start Demo
            </button>
          ) : (
            <button 
              className={styles.stopDemoButton}
              onClick={handleStopDemo}
            >
              ⏹️ Stop Demo
            </button>
          )}
          <button 
            className={styles.launchButton}
            onClick={() => setShowLauncher(true)}
          >
            Launch New Agent
          </button>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'collaboration' ? styles.active : ''}`}
          onClick={() => setActiveTab('collaboration')}
        >
          Collaboration
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>

      {renderTabContent()}

      {showLauncher && (
        <AgentLauncher
          onLaunch={handleLaunchAgent}
          onClose={() => setShowLauncher(false)}
        />
      )}
    </div>
  );
}