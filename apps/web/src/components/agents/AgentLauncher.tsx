'use client';

import React, { useState } from 'react';
import styles from './AgentLauncher.module.css';

interface AgentLauncherProps {
  onLaunch: (type: string, capabilities: string[]) => void;
  onClose: () => void;
}

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  color: string;
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'testing',
    name: 'Testing Agent',
    description: 'Specialized in automated testing, unit tests, and quality assurance',
    icon: '🧪',
    capabilities: ['testing', 'unit_testing', 'integration_testing', 'test_coverage', 'bug_detection'],
    color: '#10b981'
  },
  {
    id: 'documentation',
    name: 'Documentation Agent',
    description: 'Creates comprehensive documentation, README files, and API docs',
    icon: '📚',
    capabilities: ['documentation', 'api_documentation', 'readme_generation', 'code_comments', 'tutorial_creation'],
    color: '#3b82f6'
  },
  {
    id: 'optimization',
    name: 'Optimization Agent',
    description: 'Focuses on performance optimization and code efficiency',
    icon: '⚡',
    capabilities: ['optimization', 'performance_analysis', 'memory_optimization', 'algorithm_improvement', 'profiling'],
    color: '#f59e0b'
  },
  {
    id: 'security',
    name: 'Security Agent',
    description: 'Specialized in security analysis and vulnerability detection',
    icon: '🔒',
    capabilities: ['security_analysis', 'vulnerability_detection', 'code_audit', 'security_testing', 'compliance_check'],
    color: '#ef4444'
  },
  {
    id: 'ui',
    name: 'UI/UX Agent',
    description: 'Focuses on user interface design and user experience improvements',
    icon: '🎨',
    capabilities: ['ui_design', 'ux_improvement', 'accessibility', 'responsive_design', 'user_testing'],
    color: '#8b5cf6'
  },
  {
    id: 'database',
    name: 'Database Agent',
    description: 'Specialized in database design, queries, and data management',
    icon: '🗄️',
    capabilities: ['database_design', 'query_optimization', 'data_migration', 'schema_management', 'backup_strategy'],
    color: '#06b6d4'
  }
];

export default function AgentLauncher({ onLaunch, onClose }: AgentLauncherProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [customCapabilities, setCustomCapabilities] = useState<string[]>([]);
  const [customCapability, setCustomCapability] = useState('');

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
    setCustomCapabilities([]);
  };

  const handleAddCustomCapability = () => {
    if (customCapability.trim() && !customCapabilities.includes(customCapability.trim())) {
      setCustomCapabilities([...customCapabilities, customCapability.trim()]);
      setCustomCapability('');
    }
  };

  const handleRemoveCustomCapability = (capability: string) => {
    setCustomCapabilities(customCapabilities.filter(c => c !== capability));
  };

  const handleLaunch = () => {
    if (selectedTemplate) {
      const allCapabilities = [...selectedTemplate.capabilities, ...customCapabilities];
      onLaunch(selectedTemplate.id, allCapabilities);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Launch New Agent</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.templateSection}>
            <h3>Choose Agent Template</h3>
            <div className={styles.templateGrid}>
              {agentTemplates.map(template => (
                <div
                  key={template.id}
                  className={`${styles.templateCard} ${selectedTemplate?.id === template.id ? styles.selected : ''}`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div 
                    className={styles.templateIcon}
                    style={{ backgroundColor: template.color }}
                  >
                    {template.icon}
                  </div>
                  <div className={styles.templateInfo}>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <div className={styles.capabilityTags}>
                      {template.capabilities.slice(0, 3).map(capability => (
                        <span key={capability} className={styles.capabilityTag}>
                          {capability}
                        </span>
                      ))}
                      {template.capabilities.length > 3 && (
                        <span className={styles.moreTag}>
                          +{template.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div className={styles.customizationSection}>
              <h3>Customize Capabilities</h3>
              <p>Add additional capabilities to your agent:</p>
              
              <div className={styles.customCapabilityInput}>
                <input
                  type="text"
                  value={customCapability}
                  onChange={(e) => setCustomCapability(e.target.value)}
                  placeholder="Enter custom capability..."
                  className={styles.input}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCapability()}
                />
                <button
                  className={styles.addButton}
                  onClick={handleAddCustomCapability}
                  disabled={!customCapability.trim()}
                >
                  Add
                </button>
              </div>

              {customCapabilities.length > 0 && (
                <div className={styles.customCapabilities}>
                  <h4>Custom Capabilities:</h4>
                  <div className={styles.customCapabilityTags}>
                    {customCapabilities.map(capability => (
                      <span key={capability} className={styles.customCapabilityTag}>
                        {capability}
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveCustomCapability(capability)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.finalCapabilities}>
                <h4>Final Capabilities ({selectedTemplate.capabilities.length + customCapabilities.length}):</h4>
                <div className={styles.finalCapabilityTags}>
                  {[...selectedTemplate.capabilities, ...customCapabilities].map(capability => (
                    <span key={capability} className={styles.finalCapabilityTag}>
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.launchButton}
            onClick={handleLaunch}
            disabled={!selectedTemplate}
          >
            Launch Agent
          </button>
        </div>
      </div>
    </div>
  );
}