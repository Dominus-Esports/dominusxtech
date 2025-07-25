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
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'type'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = tasks.filter(task => task.status === filter);
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, filter, sortBy, sortOrder]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'running': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unknown Agent';
  };

  return (
    <div className={styles.container}>
      <h2>Task Management</h2>
      
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

        <div className={styles.sortGroup}>
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className={styles.select}
          >
            <option value="createdAt">Created Date</option>
            <option value="priority">Priority</option>
            <option value="type">Type</option>
          </select>
        </div>

        <button
          className={styles.sortButton}
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className={styles.taskList}>
        {filteredAndSortedTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p>No tasks found</p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <div key={task.id} className={`${styles.taskItem} ${styles[task.status]}`}>
              <div className={styles.taskHeader}>
                <div className={styles.taskType}>
                  <span className={styles.typeBadge}>{task.type}</span>
                  <span 
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className={styles.taskStatus}>
                  <div 
                    className={styles.statusDot}
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  />
                  <span>{task.status}</span>
                </div>
              </div>

              <div className={styles.taskContent}>
                <p className={styles.taskDescription}>{task.description}</p>
                <div className={styles.taskMeta}>
                  <span className={styles.agentName}>
                    Agent: {getAgentName(task.agentId)}
                  </span>
                  <span className={styles.taskDate}>
                    Created: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>

              {task.startedAt && (
                <div className={styles.taskTiming}>
                  <span>Started: {formatDate(task.startedAt)}</span>
                  {task.completedAt && (
                    <span>Completed: {formatDate(task.completedAt)}</span>
                  )}
                </div>
              )}

              {task.error && (
                <div className={styles.taskError}>
                  <strong>Error:</strong> {task.error}
                </div>
              )}

              {task.result && (
                <div className={styles.taskResult}>
                  <strong>Result:</strong> {JSON.stringify(task.result)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Total:</span>
          <span>{tasks.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Pending:</span>
          <span>{tasks.filter(t => t.status === 'pending').length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Running:</span>
          <span>{tasks.filter(t => t.status === 'running').length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Completed:</span>
          <span>{tasks.filter(t => t.status === 'completed').length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Failed:</span>
          <span>{tasks.filter(t => t.status === 'failed').length}</span>
        </div>
      </div>
    </div>
  );
}