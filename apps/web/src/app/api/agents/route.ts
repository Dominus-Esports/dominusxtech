import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '@/lib/agentService';

export async function GET() {
  try {
    const agents = agentManager.getAllAgents();
    const services = agentManager.getAllServices();
    
    return NextResponse.json({
      success: true,
      data: {
        agents,
        services
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'launch':
        const agent = agentManager.launchAgent(data);
        return NextResponse.json({
          success: true,
          data: agent
        });

      case 'sendMessage':
        const success = agentManager.sendMessageToAgent(data.agentId, data.message);
        return NextResponse.json({
          success,
          message: success ? 'Message sent' : 'Agent not found'
        });

      case 'restart':
        const restartSuccess = agentManager.restartAgent(data.agentId);
        return NextResponse.json({
          success: restartSuccess,
          message: restartSuccess ? 'Agent restarted' : 'Agent not found'
        });

      case 'terminate':
        const terminateSuccess = agentManager.terminateAgent(data.agentId);
        return NextResponse.json({
          success: terminateSuccess,
          message: terminateSuccess ? 'Agent terminated' : 'Agent not found'
        });

      case 'getLogs':
        const logs = agentManager.getAgentLogs(data.agentId);
        return NextResponse.json({
          success: true,
          data: logs
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}