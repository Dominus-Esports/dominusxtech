'use client';

import React, { useState, useMemo } from 'react';
import { Task, Agent } from '../../services/agentService';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  agents: Agent[];
  onAssignTask: (agentId: string, taskType: string, description: string) => void;
}

export default function TaskList({ tasks, agents, onAssignTask }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'type'>('created');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskAgent, setNewTaskAgent] = useState('');
  const [newTaskType, setNewTaskType] = useState('code_review');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = tasks.filter(task => task.status === filter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [tasks, filter, sortBy]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'running': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'running': return 'Running';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleCreateTask = () => {
    if (newTaskAgent && newTaskDescription.trim()) {
      onAssignTask(newTaskAgent, newTaskType, newTaskDescription);
      setNewTaskAgent('');
      setNewTaskDescription('');
      setShowNewTaskForm(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Task Management</h2>
        <button
          className={styles.newTaskButton}
          onClick={() => setShowNewTaskForm(true)}
        >
          + New Task
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className={styles.select}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={styles.select}
          >
            <option value="created">Created Date</option>
            <option value="priority">Priority</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <div className={styles.taskList}>
        {filteredAndSortedTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p>No tasks found</p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => {
            const agent = agents.find(a => a.id === task.agentId);
            return (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskInfo}>
                    <span className={styles.taskType}>{task.type}</span>
                    <span 
                      className={styles.taskPriority}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div 
                    className={styles.taskStatus}
                    style={{ color: getStatusColor(task.status) }}
                  >
                    {getStatusText(task.status)}
                  </div>
                </div>

                <div className={styles.taskDescription}>
                  {task.description}
                </div>

                <div className={styles.taskDetails}>
                  <div className={styles.taskAgent}>
                    <span className={styles.label}>Agent:</span>
                    <span className={styles.value}>{agent?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className={styles.taskDates}>
                    <div>
                      <span className={styles.label}>Created:</span>
                      <span className={styles.value}>{formatDate(task.createdAt)}</span>
                    </div>
                    {task.startedAt && (
                      <div>
                        <span className={styles.label}>Started:</span>
                        <span className={styles.value}>{formatDate(task.startedAt)}</span>
                      </div>
                    )}
                    {task.completedAt && (
                      <div>
                        <span className={styles.label}>Completed:</span>
                        <span className={styles.value}>{formatDate(task.completedAt)}</span>
                      </div>
                    )}
                  </div>

                  {task.error && (
                    <div className={styles.taskError}>
                      <span className={styles.label}>Error:</span>
                      <span className={styles.error}>{task.error}</span>
                    </div>
                  )}

                  {task.result && (
                    <div className={styles.taskResult}>
                      <span className={styles.label}>Result:</span>
                      <span className={styles.result}>{JSON.stringify(task.result)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewTaskForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Task</h3>
            
            <div className={styles.formGroup}>
              <label>Agent:</label>
              <select
                value={newTaskAgent}
                onChange={(e) => setNewTaskAgent(e.target.value)}
                className={styles.formSelect}
              >
                <option value="">Select an agent</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.status})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Task Type:</label>
              <select
                value={newTaskType}
                onChange={(e) => setNewTaskType(e.target.value)}
                className={styles.formSelect}
              >
                <option value="code_review">Code Review</option>
                <option value="testing">Testing</option>
                <option value="documentation">Documentation</option>
                <option value="optimization">Optimization</option>
                <option value="debugging">Debugging</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Description:</label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Describe the task..."
                className={styles.formTextarea}
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.createButton}
                onClick={handleCreateTask}
                disabled={!newTaskAgent || !newTaskDescription.trim()}
              >
                Create Task
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowNewTaskForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}