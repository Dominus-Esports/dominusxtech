'use client';

import React from 'react';
import styles from './SystemStats.module.css';

interface SystemStatsProps {
  stats: {
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    failedTasks: number;
    uptime: number;
  };
}

export default function SystemStats({ stats }: SystemStatsProps) {
  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  const getSuccessRate = () => {
    const totalCompleted = stats.completedTasks + stats.failedTasks;
    if (totalCompleted === 0) return 0;
    return Math.round((stats.completedTasks / totalCompleted) * 100);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Statistics</h2>
      
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🤖</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalAgents}</div>
            <div className={styles.statLabel}>Total Agents</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🟢</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeAgents}</div>
            <div className={styles.statLabel}>Active Agents</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalTasks}</div>
            <div className={styles.statLabel}>Total Tasks</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingTasks}</div>
            <div className={styles.statLabel}>Pending Tasks</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.completedTasks}</div>
            <div className={styles.statLabel}>Completed Tasks</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.failedTasks}</div>
            <div className={styles.statLabel}>Failed Tasks</div>
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Completion Rate</div>
          <div className={styles.metricValue}>{getCompletionRate()}%</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${getCompletionRate()}%` }}
            />
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Success Rate</div>
          <div className={styles.metricValue}>{getSuccessRate()}%</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${getSuccessRate()}%` }}
            />
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>System Uptime</div>
          <div className={styles.metricValue}>{formatUptime(stats.uptime)}</div>
        </div>
      </div>
    </div>
  );
}