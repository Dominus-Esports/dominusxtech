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

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getSuccessRate = () => {
    if (stats.completedTasks + stats.failedTasks === 0) return 0;
    return Math.round((stats.completedTasks / (stats.completedTasks + stats.failedTasks)) * 100);
  };

  return (
    <div className={styles.container}>
      <h2>System Statistics</h2>
      
      <div className={styles.statsGrid}>
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
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.failedTasks}</div>
            <div className={styles.statLabel}>Failed</div>
          </div>
        </div>
      </div>

      <div className={styles.additionalStats}>
        <div className={styles.successRate}>
          <div className={styles.successRateLabel}>Success Rate</div>
          <div className={styles.successRateValue}>{getSuccessRate()}%</div>
          <div className={styles.successRateBar}>
            <div 
              className={styles.successRateFill}
              style={{ width: `${getSuccessRate()}%` }}
            />
          </div>
        </div>

        <div className={styles.uptime}>
          <div className={styles.uptimeLabel}>System Uptime</div>
          <div className={styles.uptimeValue}>{formatUptime(stats.uptime)}</div>
        </div>
      </div>
    </div>
  );
}