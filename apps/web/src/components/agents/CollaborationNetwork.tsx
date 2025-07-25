'use client';

import React, { useMemo } from 'react';
import { Agent } from '../../services/agentService';
import styles from './CollaborationNetwork.module.css';

interface CollaborationNetworkProps {
  agents: Agent[];
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
}

interface NetworkNode {
  id: string;
  name: string;
  type: Agent['type'];
  status: Agent['status'];
  x: number;
  y: number;
  connections: string[];
}

export default function CollaborationNetwork({ 
  agents, 
  selectedAgentId, 
  onAgentSelect 
}: CollaborationNetworkProps) {
  const networkData = useMemo(() => {
    const nodes: NetworkNode[] = agents.map((agent, index) => {
      const angle = (index / agents.length) * 2 * Math.PI;
      const radius = 150;
      const centerX = 200;
      const centerY = 200;
      
      return {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        connections: agent.collaboration.preferredPartners
      };
    });

    return { nodes };
  }, [agents]);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'busy': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: Agent['type']) => {
    switch (type) {
      case 'primary': return '#667eea';
      case 'secondary': return '#8b5cf6';
      case 'specialized': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getNodeSize = (agent: Agent) => {
    if (agent.type === 'primary') return 60;
    if (agent.type === 'specialized') return 50;
    return 40;
  };

  return (
    <div className={styles.container}>
      <h3>Collaboration Network</h3>
      
      <div className={styles.networkContainer}>
        <svg 
          width="400" 
          height="400" 
          viewBox="0 0 400 400"
          className={styles.networkSvg}
        >
          {/* Connection lines */}
          {networkData.nodes.map(node => 
            node.connections.map(connectionId => {
              const targetNode = networkData.nodes.find(n => n.id === connectionId);
              if (!targetNode) return null;
              
              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  className={styles.connectionLine}
                />
              );
            })
          )}

          {/* Agent nodes */}
          {networkData.nodes.map(node => {
            const agent = agents.find(a => a.id === node.id);
            if (!agent) return null;

            const isSelected = selectedAgentId === node.id;
            const nodeSize = getNodeSize(agent);

            return (
              <g key={node.id}>
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize / 2}
                  fill={getTypeColor(node.type)}
                  stroke={isSelected ? '#1f2937' : 'white'}
                  strokeWidth={isSelected ? '3' : '2'}
                  className={styles.node}
                  onClick={() => onAgentSelect?.(node.id)}
                />
                
                {/* Status indicator */}
                <circle
                  cx={node.x + nodeSize / 3}
                  cy={node.y - nodeSize / 3}
                  r="6"
                  fill={getStatusColor(node.status)}
                  className={styles.statusIndicator}
                />
                
                {/* Agent name */}
                <text
                  x={node.x}
                  y={node.y + nodeSize / 2 + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="500"
                  className={styles.nodeLabel}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <h4>Agent Types</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ backgroundColor: getTypeColor('primary') }}
              />
              <span>Primary</span>
            </div>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ backgroundColor: getTypeColor('specialized') }}
              />
              <span>Specialized</span>
            </div>
          </div>
        </div>

        <div className={styles.legendSection}>
          <h4>Status</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ backgroundColor: getStatusColor('active') }}
              />
              <span>Active</span>
            </div>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ backgroundColor: getStatusColor('idle') }}
              />
              <span>Idle</span>
            </div>
            <div className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ backgroundColor: getStatusColor('busy') }}
              />
              <span>Busy</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Agents</span>
          <span className={styles.statValue}>{agents.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Collaborative</span>
          <span className={styles.statValue}>
            {agents.filter(a => a.collaboration.canCollaborate).length}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Active</span>
          <span className={styles.statValue}>
            {agents.filter(a => a.status === 'active').length}
          </span>
        </div>
      </div>
    </div>
  );
}