'use client';

import { useState, useEffect, useCallback } from 'react';
import { agentService, Agent, Task } from '../../services/agentService';

export interface AgentServiceState {
  agents: Agent[];
  tasks: Task[];
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

export function useAgentService() {
  const [state, setState] = useState<AgentServiceState>({
    agents: [],
    tasks: [],
    stats: {
      totalAgents: 0,
      activeAgents: 0,
      totalTasks: 0,
      pendingTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      uptime: 0
    }
  });

  const updateState = useCallback(() => {
    setState({
      agents: agentService.getAllAgents(),
      tasks: agentService.getAllTasks(),
      stats: agentService.getSystemStats()
    });
  }, []);

  useEffect(() => {
    // Initial state update
    updateState();

    // Set up event listeners
    const events = [
      'agentAdded',
      'agentRemoved',
      'agentStatusChanged',
      'taskAdded',
      'taskStarted',
      'taskCompleted',
      'taskFailed'
    ];

    events.forEach(event => {
      agentService.on(event, updateState);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        agentService.off(event, updateState);
      });
    };
  }, [updateState]);

  const addAgent = useCallback((agent: Omit<Agent, 'id' | 'lastActivity'>) => {
    return agentService.addAgent(agent);
  }, []);

  const removeAgent = useCallback((agentId: string) => {
    return agentService.removeAgent(agentId);
  }, []);

  const updateAgentStatus = useCallback((agentId: string, status: Agent['status']) => {
    return agentService.updateAgentStatus(agentId, status);
  }, []);

  const assignTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    return agentService.assignTask(task);
  }, []);

  const launchSpecializedAgent = useCallback((type: string, capabilities: string[]) => {
    return agentService.launchSpecializedAgent(type, capabilities);
  }, []);

  const getAgent = useCallback((agentId: string) => {
    return agentService.getAgent(agentId);
  }, []);

  const getTasksByAgent = useCallback((agentId: string) => {
    return agentService.getTasksByAgent(agentId);
  }, []);

  return {
    ...state,
    addAgent,
    removeAgent,
    updateAgentStatus,
    assignTask,
    launchSpecializedAgent,
    getAgent,
    getTasksByAgent
  };
}