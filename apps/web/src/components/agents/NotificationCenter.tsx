'use client';

import React, { useState, useEffect } from 'react';
import { useAgentService } from '../../lib/agents/useAgentService';
import styles from './NotificationCenter.module.css';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  agentId?: string;
  taskId?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { agents, tasks } = useAgentService();

  useEffect(() => {
    const handleAgentEvent = (event: string, data: any) => {
      let notification: Notification | null = null;

      switch (event) {
        case 'agentAdded':
          notification = {
            id: `agent-added-${Date.now()}`,
            type: 'success',
            title: 'Agent Launched',
            message: `${data.name} has been successfully launched and is ready for tasks.`,
            timestamp: new Date(),
            agentId: data.id
          };
          break;

        case 'agentRemoved':
          notification = {
            id: `agent-removed-${Date.now()}`,
            type: 'warning',
            title: 'Agent Removed',
            message: `${data.name} has been removed from the system.`,
            timestamp: new Date(),
            agentId: data.id
          };
          break;

        case 'agentStatusChanged':
          notification = {
            id: `status-changed-${Date.now()}`,
            type: 'info',
            title: 'Status Update',
            message: `${data.name} is now ${data.status}.`,
            timestamp: new Date(),
            agentId: data.id
          };
          break;

        case 'taskAdded':
          notification = {
            id: `task-added-${Date.now()}`,
            type: 'info',
            title: 'Task Assigned',
            message: `New task assigned: ${data.description}`,
            timestamp: new Date(),
            taskId: data.id
          };
          break;

        case 'taskStarted':
          notification = {
            id: `task-started-${Date.now()}`,
            type: 'info',
            title: 'Task Started',
            message: `Task execution has begun: ${data.description}`,
            timestamp: new Date(),
            taskId: data.id
          };
          break;

        case 'taskCompleted':
          notification = {
            id: `task-completed-${Date.now()}`,
            type: 'success',
            title: 'Task Completed',
            message: `Task completed successfully: ${data.description}`,
            timestamp: new Date(),
            taskId: data.id
          };
          break;

        case 'taskFailed':
          notification = {
            id: `task-failed-${Date.now()}`,
            type: 'error',
            title: 'Task Failed',
            message: `Task failed: ${data.description} - ${data.error}`,
            timestamp: new Date(),
            taskId: data.id
          };
          break;

        case 'agentPerformanceUpdated':
          notification = {
            id: `performance-updated-${Date.now()}`,
            type: 'info',
            title: 'Performance Update',
            message: `${data.name} efficiency: ${data.performance.efficiencyScore.toFixed(1)}%`,
            timestamp: new Date(),
            agentId: data.id
          };
          break;

        case 'agentOptimized':
          notification = {
            id: `agent-optimized-${Date.now()}`,
            type: 'success',
            title: 'Agent Optimized',
            message: `${data.name} has been automatically optimized for better performance.`,
            timestamp: new Date(),
            agentId: data.id
          };
          break;

        case 'collaborationOpportunity':
          notification = {
            id: `collaboration-${Date.now()}`,
            type: 'info',
            title: 'Collaboration Opportunity',
            message: `${data.agent.name} and ${data.potentialPartners[0].name} can collaborate on ${data.suggestedTask.type} tasks.`,
            timestamp: new Date(),
            agentId: data.agent.id
          };
          break;
      }

      if (notification) {
        setNotifications(prev => [notification!, ...prev.slice(0, 9)]); // Keep last 10
      }
    };

    // Subscribe to all events
    const events = [
      'agentAdded', 'agentRemoved', 'agentStatusChanged',
      'taskAdded', 'taskStarted', 'taskCompleted', 'taskFailed',
      'agentPerformanceUpdated', 'agentOptimized', 'collaborationOpportunity'
    ];

    events.forEach(event => {
      // This would need to be connected to the actual agent service events
      // For now, we'll simulate some notifications
    });

    // Simulate some initial notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 'welcome-1',
          type: 'success',
          title: 'System Ready',
          message: 'Agent management system is online and ready.',
          timestamp: new Date()
        }
      ]);
    }, 1000);

  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ℹ';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor(diff / 1000);

    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 0) return `${seconds}s ago`;
    return 'Just now';
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.notificationButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.notificationIcon}>🔔</span>
        {notifications.length > 0 && (
          <span className={styles.notificationBadge}>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.notificationPanel}>
          <div className={styles.panelHeader}>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className={styles.clearAllButton}
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`${styles.notificationItem} ${styles[notification.type]}`}
                >
                  <div className={styles.notificationHeader}>
                    <div 
                      className={styles.notificationIcon}
                      style={{ color: getNotificationColor(notification.type) }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>
                        {notification.title}
                      </div>
                      <div className={styles.notificationMessage}>
                        {notification.message}
                      </div>
                      <div className={styles.notificationTime}>
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                    <button
                      className={styles.closeButton}
                      onClick={() => clearNotification(notification.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}