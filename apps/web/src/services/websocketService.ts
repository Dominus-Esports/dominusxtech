import { agentManager } from './agentService';

import { Server as WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected to WebSocket');
      this.clients.add(ws);

      // Send initial state
      this.sendToClient(ws, {
        type: 'initial',
        data: {
          agents: agentManager.getAllAgents(),
          services: agentManager.getAllServices(),
          status: agentManager.getStatus()
        }
      });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch {
          console.error('Error parsing WebSocket message');
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
        this.clients.delete(ws);
      });

      ws.on('error', () => {
        console.error('WebSocket error');
        this.clients.delete(ws);
      });
    });

    // Set up agent manager event listeners
    this.setupAgentManagerListeners();
  }

  private setupAgentManagerListeners() {
    const events = [
      'agent:created',
      'agent:launched',
      'agent:terminated',
      'agent:restarted',
      'agent:message',
      'agent:response',
      'agent:activity',
      'agent:memory:updated',
      'service:started',
      'service:stopped'
    ];

    events.forEach(event => {
      agentManager.on(event, (data) => {
        this.broadcast({
          type: event,
          data
        });
      });
    });
  }

  private handleMessage(ws: WebSocket, message: { type: string; data: unknown }) {
    const { type, data } = message;

    switch (type) {
      case 'create_agent':
        const agent = agentManager.createAgent(data);
        this.broadcast({
          type: 'agent:created',
          data: agent
        });
        break;

      case 'launch_agent':
        const launched = agentManager.launchAgent(data.agentId);
        if (launched) {
          const agent = agentManager.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:launched',
            data: agent
          });
        }
        break;

      case 'terminate_agent':
        const terminated = agentManager.terminateAgent(data.agentId);
        if (terminated) {
          const agent = agentManager.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:terminated',
            data: agent
          });
        }
        break;

      case 'restart_agent':
        const restarted = agentManager.restartAgent(data.agentId);
        if (restarted) {
          const agent = agentManager.getAgent(data.agentId);
          this.broadcast({
            type: 'agent:restarting',
            data: agent
          });
        }
        break;

      case 'send_message':
        const sent = agentManager.sendMessageToAgent(data.agentId, data.message);
        if (sent) {
          this.broadcast({
            type: 'agent:message',
            data: {
              agentId: data.agentId,
              message: data.message,
              timestamp: new Date()
            }
          });
        }
        break;

      case 'get_status':
        this.sendToClient(ws, {
          type: 'status',
          data: agentManager.getStatus()
        });
        break;

      default:
        console.log('Unknown message type:', type);
    }
  }

  private sendToClient(ws: WebSocket, data: unknown) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  private broadcast(data: unknown) {
    this.clients.forEach(client => {
      this.sendToClient(client, data);
    });
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}