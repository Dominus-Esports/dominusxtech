'use client';

import React, { useState } from 'react';
import { Agent, Message } from '../../services/agentService';
import styles from './CollaborationPanel.module.css';

interface CollaborationPanelProps {
  agents: Agent[];
  onEnableCollaboration: (agentId1: string, agentId2: string) => void;
  onShareKnowledge: (fromAgentId: string, toAgentId: string, knowledge: string) => void;
}

export default function CollaborationPanel({ 
  agents, 
  onEnableCollaboration, 
  onShareKnowledge 
}: CollaborationPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [knowledgeToShare, setKnowledgeToShare] = useState('');
  const [targetAgent, setTargetAgent] = useState('');

  const getAgentById = (id: string) => agents.find(agent => agent.id === id);

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'task_update': return '📋';
      case 'knowledge_share': return '🧠';
      case 'collaboration_request': return '🤝';
      default: return '💬';
    }
  };

  const getMessageTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'task_update': return '#3b82f6';
      case 'knowledge_share': return '#10b981';
      case 'collaboration_request': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Agent Collaboration</h2>
        <div className={styles.stats}>
          <span>Active Collaborations: {agents.filter(a => a.collaboration.collaboratingWith.length > 0).length}</span>
          <span>Knowledge Shared: {agents.reduce((sum, a) => sum + a.collaboration.sharedKnowledge.length, 0)}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <h3>Agent Network</h3>
          <div className={styles.agentList}>
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`${styles.agentItem} ${selectedAgent === agent.id ? styles.selected : ''}`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className={styles.agentInfo}>
                  <h4>{agent.name}</h4>
                  <span className={styles.agentType}>{agent.type}</span>
                </div>
                <div className={styles.collaborationInfo}>
                  <span className={styles.collaborationCount}>
                    {agent.collaboration.collaboratingWith.length} collaborators
                  </span>
                  <span className={styles.knowledgeCount}>
                    {agent.collaboration.sharedKnowledge.length} knowledge items
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedAgent && (
            <div className={styles.collaborationControls}>
              <h4>Enable Collaboration</h4>
              <div className={styles.collaborationForm}>
                <select
                  value={targetAgent}
                  onChange={(e) => setTargetAgent(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select agent to collaborate with</option>
                  {agents
                    .filter(agent => agent.id !== selectedAgent)
                    .map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.type})
                      </option>
                    ))}
                </select>
                <button
                  className={styles.enableButton}
                  onClick={() => {
                    if (targetAgent) {
                      onEnableCollaboration(selectedAgent, targetAgent);
                      setTargetAgent('');
                    }
                  }}
                  disabled={!targetAgent}
                >
                  Enable Collaboration
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightPanel}>
          {selectedAgent ? (
            <div className={styles.agentDetails}>
              <h3>{getAgentById(selectedAgent)?.name} Details</h3>
              
              <div className={styles.section}>
                <h4>Collaborating With</h4>
                <div className={styles.collaboratingList}>
                  {getAgentById(selectedAgent)?.collaboration.collaboratingWith.map(agentId => {
                    const collaborator = getAgentById(agentId);
                    return collaborator ? (
                      <div key={agentId} className={styles.collaborator}>
                        <span className={styles.collaboratorName}>{collaborator.name}</span>
                        <span className={styles.collaboratorType}>{collaborator.type}</span>
                      </div>
                    ) : null;
                  })}
                  {getAgentById(selectedAgent)?.collaboration.collaboratingWith.length === 0 && (
                    <p className={styles.noCollaborators}>No active collaborations</p>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h4>Shared Knowledge</h4>
                <div className={styles.knowledgeList}>
                  {getAgentById(selectedAgent)?.collaboration.sharedKnowledge.map((knowledge, index) => (
                    <div key={index} className={styles.knowledgeItem}>
                      {knowledge}
                    </div>
                  ))}
                  {getAgentById(selectedAgent)?.collaboration.sharedKnowledge.length === 0 && (
                    <p className={styles.noKnowledge}>No shared knowledge yet</p>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h4>Communication History</h4>
                <div className={styles.messageList}>
                  {getAgentById(selectedAgent)?.collaboration.communicationHistory.map(message => {
                    const fromAgent = getAgentById(message.from);
                    const toAgent = getAgentById(message.to);
                    return (
                      <div key={message.id} className={styles.message}>
                        <div className={styles.messageHeader}>
                          <span className={styles.messageIcon}>
                            {getMessageTypeIcon(message.type)}
                          </span>
                          <span className={styles.messageFrom}>
                            {fromAgent?.name || 'Unknown'} → {toAgent?.name || 'Unknown'}
                          </span>
                          <span className={styles.messageTime}>
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <div className={styles.messageContent}>
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                  {getAgentById(selectedAgent)?.collaboration.communicationHistory.length === 0 && (
                    <p className={styles.noMessages}>No communication history</p>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h4>Share Knowledge</h4>
                <div className={styles.shareForm}>
                  <textarea
                    value={knowledgeToShare}
                    onChange={(e) => setKnowledgeToShare(e.target.value)}
                    placeholder="Enter knowledge to share..."
                    className={styles.knowledgeInput}
                    rows={3}
                  />
                  <div className={styles.shareControls}>
                    <select
                      value={targetAgent}
                      onChange={(e) => setTargetAgent(e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Select target agent</option>
                      {agents
                        .filter(agent => agent.id !== selectedAgent)
                        .map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                    </select>
                    <button
                      className={styles.shareButton}
                      onClick={() => {
                        if (knowledgeToShare.trim() && targetAgent) {
                          onShareKnowledge(selectedAgent, targetAgent, knowledgeToShare);
                          setKnowledgeToShare('');
                          setTargetAgent('');
                        }
                      }}
                      disabled={!knowledgeToShare.trim() || !targetAgent}
                    >
                      Share Knowledge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <div className={styles.noSelectionIcon}>🤝</div>
              <p>Select an agent to view collaboration details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}