'use client';

import React, { useState } from 'react';
import { Agent, Task } from '../../services/agentService';
import styles from './AgentCard.module.css';

interface AgentCardProps {
  agent: Agent;
  tasks: Task[];
  onStatusChange: (status: Agent['status']) => void;
  onRemove: () => void;
  onAssignTask: (taskType: string, description: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AgentCard({
  agent,
  tasks,
  onStatusChange,
  onRemove,
  onAssignTask,
  isSelected,
  onSelect
}: AgentCardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskType, setTaskType] = useState('code_review');
  const [taskDescription, setTaskDescription] = useState('');

  const runningTasks = tasks.filter(task => task.status === 'running');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const failedTasks = tasks.filter(task => task.status === 'failed');

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'busy': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'idle': return 'Idle';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const handleAssignTask = () => {
    if (taskDescription.trim()) {
      onAssignTask(taskType, taskDescription);
      setTaskDescription('');
      setShowTaskForm(false);
    }
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <div className={styles.header}>
        <div className={styles.agentInfo}>
          <h3 className={styles.name}>{agent.name}</h3>
          <span className={styles.type}>{agent.type}</span>
        </div>
        <div className={styles.status}>
          <div 
            className={styles.statusDot}
            style={{ backgroundColor: getStatusColor(agent.status) }}
          />
          <span>{getStatusText(agent.status)}</span>
        </div>
      </div>

      <div className={styles.capabilities}>
        <h4>Capabilities:</h4>
        <div className={styles.capabilityTags}>
          {agent.capabilities.slice(0, 3).map(capability => (
            <span key={capability} className={styles.capabilityTag}>
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className={styles.moreTag}>
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Running:</span>
          <span className={styles.statValue}>{runningTasks.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Completed:</span>
          <span className={styles.statValue}>{completedTasks.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Failed:</span>
          <span className={styles.statValue}>{failedTasks.length}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <select 
          value={agent.status}
          onChange={(e) => onStatusChange(e.target.value as Agent['status'])}
          className={styles.statusSelect}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>

        <button
          className={styles.assignButton}
          onClick={(e) => {
            e.stopPropagation();
            setShowTaskForm(!showTaskForm);
          }}
          disabled={agent.status === 'offline'}
        >
          Assign Task
        </button>

        <button
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </button>
      </div>

      {showTaskForm && (
        <div className={styles.taskForm} onClick={(e) => e.stopPropagation()}>
          <h4>Assign New Task</h4>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className={styles.taskTypeSelect}
          >
            <option value="code_review">Code Review</option>
            <option value="testing">Testing</option>
            <option value="documentation">Documentation</option>
            <option value="optimization">Optimization</option>
            <option value="debugging">Debugging</option>
            <option value="custom">Custom</option>
          </select>
          
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe the task..."
            className={styles.taskDescription}
            rows={3}
          />
          
          <div className={styles.taskFormActions}>
            <button
              className={styles.assignTaskButton}
              onClick={handleAssignTask}
              disabled={!taskDescription.trim()}
            >
              Assign
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setShowTaskForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {runningTasks.length > 0 && (
        <div className={styles.runningTasks}>
          <h4>Running Tasks:</h4>
          {runningTasks.map(task => (
            <div key={task.id} className={styles.runningTask}>
              <span className={styles.taskType}>{task.type}</span>
              <span className={styles.taskDescription}>{task.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}