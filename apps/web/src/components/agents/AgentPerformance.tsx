'use client';

import React from 'react';
import { Agent, PerformanceMetrics } from '../../services/agentService';
import styles from './AgentPerformance.module.css';

interface AgentPerformanceProps {
  agent: Agent;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function AgentPerformance({ agent, isExpanded = false, onToggle }: AgentPerformanceProps) {
  const { performance, collaboration } = agent;

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    if (score >= 60) return '#ef4444';
    return '#6b7280';
  };

  const getTrustColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    if (score >= 60) return '#ef4444';
    return '#6b7280';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  const getCollaborationStatus = () => {
    if (!collaboration.canCollaborate) return 'Independent';
    if (collaboration.trustScore >= 90) return 'Highly Collaborative';
    if (collaboration.trustScore >= 75) return 'Collaborative';
    return 'Limited Collaboration';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={onToggle}>
        <h3>Performance Metrics</h3>
        {onToggle && (
          <button className={styles.toggleButton}>
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Efficiency Score</span>
                <div 
                  className={styles.metricValue}
                  style={{ color: getEfficiencyColor(performance.efficiencyScore) }}
                >
                  {performance.efficiencyScore.toFixed(1)}%
                </div>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${performance.efficiencyScore}%`,
                    backgroundColor: getEfficiencyColor(performance.efficiencyScore)
                  }}
                />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Success Rate</span>
                <div className={styles.metricValue}>
                  {performance.successRate.toFixed(1)}%
                </div>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${performance.successRate}%`,
                    backgroundColor: performance.successRate >= 90 ? '#10b981' : '#f59e0b'
                  }}
                />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Tasks Completed</span>
                <div className={styles.metricValue}>
                  {performance.tasksCompleted}
                </div>
              </div>
              <div className={styles.taskStats}>
                <span className={styles.taskSuccess}>✓ {performance.tasksCompleted}</span>
                <span className={styles.taskFailed}>✗ {performance.tasksFailed}</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Avg Task Time</span>
                <div className={styles.metricValue}>
                  {formatDuration(performance.averageTaskTime)}
                </div>
              </div>
              <div className={styles.timeIndicator}>
                {performance.averageTaskTime < 2000 ? 'Fast' : 
                 performance.averageTaskTime < 5000 ? 'Normal' : 'Slow'}
              </div>
            </div>
          </div>

          <div className={styles.collaborationSection}>
            <h4>Collaboration</h4>
            <div className={styles.collaborationMetrics}>
              <div className={styles.collaborationMetric}>
                <span className={styles.metricLabel}>Status</span>
                <span className={styles.metricValue}>
                  {getCollaborationStatus()}
                </span>
              </div>
              
              <div className={styles.collaborationMetric}>
                <span className={styles.metricLabel}>Trust Score</span>
                <div className={styles.metricValue}>
                  <span style={{ color: getTrustColor(collaboration.trustScore) }}>
                    {collaboration.trustScore}%
                  </span>
                </div>
              </div>

              <div className={styles.collaborationMetric}>
                <span className={styles.metricLabel}>Partners</span>
                <span className={styles.metricValue}>
                  {collaboration.preferredPartners.length}
                </span>
              </div>

              <div className={styles.collaborationMetric}>
                <span className={styles.metricLabel}>History</span>
                <span className={styles.metricValue}>
                  {collaboration.collaborationHistory.length} events
                </span>
              </div>
            </div>

            {collaboration.preferredPartners.length > 0 && (
              <div className={styles.partnersList}>
                <h5>Preferred Partners</h5>
                <div className={styles.partnerTags}>
                  {collaboration.preferredPartners.map(partnerId => (
                    <span key={partnerId} className={styles.partnerTag}>
                      {partnerId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {collaboration.collaborationHistory.length > 0 && (
              <div className={styles.historySection}>
                <h5>Recent Collaborations</h5>
                <div className={styles.historyList}>
                  {collaboration.collaborationHistory.slice(-3).map((event, index) => (
                    <div key={index} className={styles.historyItem}>
                      <div className={styles.historyHeader}>
                        <span className={styles.eventType}>{event.collaborationType}</span>
                        <span className={styles.eventTime}>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={styles.eventDetails}>
                        Task: {event.taskId}
                        <span className={`${styles.eventStatus} ${event.success ? styles.success : styles.failed}`}>
                          {event.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.optimizationSection}>
            <h4>Optimization</h4>
            <div className={styles.optimizationInfo}>
              <div className={styles.optimizationMetric}>
                <span className={styles.metricLabel}>Last Optimized</span>
                <span className={styles.metricValue}>
                  {new Date(performance.lastOptimization).toLocaleDateString()}
                </span>
              </div>
              
              <div className={styles.optimizationStatus}>
                {performance.efficiencyScore >= 90 ? (
                  <span className={styles.optimized}>✓ Optimized</span>
                ) : (
                  <span className={styles.needsOptimization}>⚠ Needs Optimization</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}