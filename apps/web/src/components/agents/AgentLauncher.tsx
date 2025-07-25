'use client';

import React, { useState } from 'react';
import styles from './AgentLauncher.module.css';

interface AgentLauncherProps {
  onLaunch: (type: string, capabilities: string[]) => void;
  onClose: () => void;
}

const agentTemplates = [
  {
    name: 'Testing Agent',
    type: 'testing',
    description: 'Specialized in automated testing and quality assurance',
    capabilities: ['unit_testing', 'integration_testing', 'e2e_testing', 'test_generation'],
    icon: '🧪'
  },
  {
    name: 'Documentation Agent',
    type: 'documentation',
    description: 'Creates and maintains project documentation',
    capabilities: ['api_documentation', 'user_guides', 'technical_writing', 'code_comments'],
    icon: '📚'
  },
  {
    name: 'Performance Agent',
    type: 'performance',
    description: 'Optimizes code performance and monitors metrics',
    capabilities: ['performance_analysis', 'optimization', 'profiling', 'benchmarking'],
    icon: '⚡'
  },
  {
    name: 'Security Agent',
    type: 'security',
    description: 'Identifies and fixes security vulnerabilities',
    capabilities: ['vulnerability_scanning', 'code_audit', 'security_testing', 'compliance_check'],
    icon: '🔒'
  },
  {
    name: 'UI/UX Agent',
    type: 'ui_ux',
    description: 'Focuses on user interface and experience improvements',
    capabilities: ['ui_review', 'accessibility_check', 'design_optimization', 'user_testing'],
    icon: '🎨'
  },
  {
    name: 'Data Agent',
    type: 'data',
    description: 'Handles data processing and analytics tasks',
    capabilities: ['data_analysis', 'etl_processing', 'reporting', 'data_validation'],
    icon: '📊'
  }
];

export default function AgentLauncher({ onLaunch, onClose }: AgentLauncherProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customType, setCustomType] = useState('');
  const [customCapabilities, setCustomCapabilities] = useState('');

  const handleLaunch = () => {
    if (selectedTemplate) {
      const template = agentTemplates.find(t => t.type === selectedTemplate);
      if (template) {
        onLaunch(template.type, template.capabilities);
      }
    } else if (customType && customCapabilities) {
      const capabilities = customCapabilities.split(',').map(c => c.trim()).filter(c => c);
      onLaunch(customType, capabilities);
    }
  };

  const canLaunch = selectedTemplate || (customType && customCapabilities);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Launch New Agent</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.templates}>
            <h3>Choose a Template</h3>
            <div className={styles.templateGrid}>
              {agentTemplates.map(template => (
                <div
                  key={template.type}
                  className={`${styles.templateCard} ${selectedTemplate === template.type ? styles.selected : ''}`}
                  onClick={() => setSelectedTemplate(template.type)}
                >
                  <div className={styles.templateIcon}>{template.icon}</div>
                  <div className={styles.templateInfo}>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <div className={styles.capabilities}>
                      {template.capabilities.slice(0, 2).map(cap => (
                        <span key={cap} className={styles.capability}>
                          {cap}
                        </span>
                      ))}
                      {template.capabilities.length > 2 && (
                        <span className={styles.moreCapabilities}>
                          +{template.capabilities.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.customAgent}>
            <h3>Create Custom Agent</h3>
            <div className={styles.customForm}>
              <div className={styles.formGroup}>
                <label>Agent Type:</label>
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="e.g., monitoring, backup, deployment"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Capabilities (comma-separated):</label>
                <textarea
                  value={customCapabilities}
                  onChange={(e) => setCustomCapabilities(e.target.value)}
                  placeholder="e.g., monitoring, alerting, reporting"
                  className={styles.textarea}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button 
            className={styles.launchButton}
            onClick={handleLaunch}
            disabled={!canLaunch}
          >
            Launch Agent
          </button>
        </div>
      </div>
    </div>
  );
}