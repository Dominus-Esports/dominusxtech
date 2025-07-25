import { agentService } from '../services/agentService';

export class AgentDemo {
  private demoInterval: NodeJS.Timeout | null = null;

  public startDemo() {
    console.log('🚀 Starting Agent Management System Demo...');
    
    // Launch specialized agents
    this.launchDemoAgents();
    
    // Start demo tasks
    this.startDemoTasks();
    
    // Start collaboration demo
    this.startCollaborationDemo();
    
    // Start performance monitoring
    this.startPerformanceDemo();
  }

  private launchDemoAgents() {
    console.log('🤖 Launching specialized agents...');
    
    // Launch Testing Agent
    const testingAgentId = agentService.launchSpecializedAgent('testing', [
      'unit_testing',
      'integration_testing',
      'test_coverage',
      'bug_detection',
      'performance_testing'
    ]);
    
    // Launch Documentation Agent
    const docsAgentId = agentService.launchSpecializedAgent('documentation', [
      'api_documentation',
      'readme_generation',
      'code_comments',
      'tutorial_creation',
      'changelog_management'
    ]);
    
    // Launch Security Agent
    const securityAgentId = agentService.launchSpecializedAgent('security', [
      'security_analysis',
      'vulnerability_detection',
      'code_audit',
      'security_testing',
      'compliance_check'
    ]);
    
    console.log(`✅ Launched agents: Testing, Documentation, Security`);
  }

  private startDemoTasks() {
    console.log('📋 Starting demo tasks...');
    
    // Get all agents
    const agents = agentService.getAllAgents();
    const solAgent = agents.find(a => a.name === 'S.O.L.');
    const testingAgent = agents.find(a => a.name === 'Testing Agent');
    const docsAgent = agents.find(a => a.name === 'Documentation Agent');
    const securityAgent = agents.find(a => a.name === 'Security Agent');
    
    if (solAgent) {
      // Assign tasks to S.O.L.
      agentService.assignTask({
        agentId: solAgent.id,
        type: 'code_review',
        priority: 'high',
        description: 'Review the new authentication system implementation',
        estimatedDuration: 45000,
        collaborationRequired: true,
        collaboratingAgents: testingAgent ? [testingAgent.id] : []
      });
      
      agentService.assignTask({
        agentId: solAgent.id,
        type: 'optimization',
        priority: 'medium',
        description: 'Optimize database queries for better performance',
        estimatedDuration: 60000
      });
    }
    
    if (testingAgent) {
      // Assign testing tasks
      agentService.assignTask({
        agentId: testingAgent.id,
        type: 'testing',
        priority: 'high',
        description: 'Create comprehensive test suite for user authentication',
        estimatedDuration: 30000
      });
      
      agentService.assignTask({
        agentId: testingAgent.id,
        type: 'testing',
        priority: 'medium',
        description: 'Run performance tests on the new API endpoints',
        estimatedDuration: 25000
      });
    }
    
    if (docsAgent) {
      // Assign documentation tasks
      agentService.assignTask({
        agentId: docsAgent.id,
        type: 'documentation',
        priority: 'medium',
        description: 'Update API documentation with new authentication endpoints',
        estimatedDuration: 40000
      });
    }
    
    if (securityAgent) {
      // Assign security tasks
      agentService.assignTask({
        agentId: securityAgent.id,
        type: 'debugging',
        priority: 'high',
        description: 'Security audit of the authentication system',
        estimatedDuration: 50000
      });
    }
  }

  private startCollaborationDemo() {
    console.log('🤝 Starting collaboration demo...');
    
    const agents = agentService.getAllAgents();
    const solAgent = agents.find(a => a.name === 'S.O.L.');
    const testingAgent = agents.find(a => a.name === 'Testing Agent');
    const docsAgent = agents.find(a => a.name === 'Documentation Agent');
    const securityAgent = agents.find(a => a.name === 'Security Agent');
    
    // Enable collaborations
    if (solAgent && testingAgent) {
      agentService.enableCollaboration(solAgent.id, testingAgent.id);
      console.log('✅ Enabled collaboration between S.O.L. and Testing Agent');
    }
    
    if (solAgent && securityAgent) {
      agentService.enableCollaboration(solAgent.id, securityAgent.id);
      console.log('✅ Enabled collaboration between S.O.L. and Security Agent');
    }
    
    if (docsAgent && testingAgent) {
      agentService.enableCollaboration(docsAgent.id, testingAgent.id);
      console.log('✅ Enabled collaboration between Documentation and Testing Agents');
    }
    
    // Share knowledge
    setTimeout(() => {
      if (solAgent && testingAgent) {
        agentService.shareKnowledge(
          solAgent.id,
          testingAgent.id,
          'Authentication best practices: Use JWT tokens with proper expiration and refresh token rotation'
        );
        console.log('🧠 S.O.L. shared authentication knowledge with Testing Agent');
      }
    }, 5000);
    
    setTimeout(() => {
      if (securityAgent && solAgent) {
        agentService.shareKnowledge(
          securityAgent.id,
          solAgent.id,
          'Security findings: Implement rate limiting and input validation for all endpoints'
        );
        console.log('🔒 Security Agent shared security findings with S.O.L.');
      }
    }, 8000);
    
    setTimeout(() => {
      if (docsAgent && testingAgent) {
        agentService.shareKnowledge(
          docsAgent.id,
          testingAgent.id,
          'Documentation patterns: Include code examples and error handling in all API docs'
        );
        console.log('📚 Documentation Agent shared documentation patterns with Testing Agent');
      }
    }, 12000);
  }

  private startPerformanceDemo() {
    console.log('📊 Starting performance monitoring demo...');
    
    // Monitor performance metrics
    this.demoInterval = setInterval(() => {
      const stats = agentService.getSystemStats();
      const agents = agentService.getAllAgents();
      
      console.log('📈 System Stats:', {
        totalAgents: stats.totalAgents,
        activeAgents: stats.activeAgents,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        collaborationCount: stats.collaborationCount,
        knowledgeBaseSize: stats.knowledgeBaseSize
      });
      
      // Show agent performance
      agents.forEach(agent => {
        if (agent.performance.tasksCompleted > 0) {
          console.log(`🤖 ${agent.name} Performance:`, {
            successRate: `${agent.performance.successRate.toFixed(1)}%`,
            tasksCompleted: agent.performance.tasksCompleted,
            avgTaskTime: `${Math.round(agent.performance.averageTaskTime / 1000)}s`,
            collaborators: agent.collaboration.collaboratingWith.length
          });
        }
      });
    }, 10000); // Update every 10 seconds
  }

  public stopDemo() {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
    console.log('🛑 Demo stopped');
  }

  public getDemoStatus() {
    const stats = agentService.getSystemStats();
    const agents = agentService.getAllAgents();
    
    return {
      agents: agents.map(agent => ({
        name: agent.name,
        type: agent.type,
        status: agent.status,
        performance: agent.performance,
        collaboration: {
          collaboratingWith: agent.collaboration.collaboratingWith.length,
          sharedKnowledge: agent.collaboration.sharedKnowledge.length,
          messages: agent.collaboration.communicationHistory.length
        }
      })),
      system: stats
    };
  }
}

// Create demo instance
export const agentDemo = new AgentDemo();