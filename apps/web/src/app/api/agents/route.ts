import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '@/services/agentService';

export async function GET() {
  try {
    const agents = agentManager.getAllAgents();
    const services = agentManager.getAllServices();
    const status = agentManager.getStatus();

    return NextResponse.json({
      success: true,
      data: {
        agents,
        services,
        status
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'create':
        const { name, type, capabilities, maxMemory = 100, autoRestart = true } = params;
        const agent = agentManager.createAgent({
          name,
          type,
          capabilities,
          maxMemory,
          autoRestart,
          environment: {}
        });
        return NextResponse.json({ success: true, data: agent });

      case 'launch':
        const { agentId } = params;
        const launched = agentManager.launchAgent(agentId);
        return NextResponse.json({ success: launched });

      case 'terminate':
        const terminated = agentManager.terminateAgent(params.agentId);
        return NextResponse.json({ success: terminated });

      case 'restart':
        const restarted = agentManager.restartAgent(params.agentId);
        return NextResponse.json({ success: restarted });

      case 'message':
        const { agentId: msgAgentId, message } = params;
        const sent = agentManager.sendMessageToAgent(msgAgentId, message);
        return NextResponse.json({ success: sent });

      case 'start':
        agentManager.start();
        return NextResponse.json({ success: true });

      case 'stop':
        agentManager.stop();
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}