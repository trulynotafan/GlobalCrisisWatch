import { io, Socket } from 'socket.io-client';
import { Alert, Incident, Resource, Task } from '@/types';

interface ServerToClientEvents {
  'alert:new': (alert: Alert) => void;
  'alert:update': (alert: Alert) => void;
  'incident:new': (incident: Incident) => void;
  'incident:update': (incident: Incident) => void;
  'resource:update': (resource: Resource) => void;
  'task:update': (task: Task) => void;
  'stats:update': (stats: any) => void;
}

interface ClientToServerEvents {
  'alert:acknowledge': (alertId: string) => void;
  'incident:respond': (incidentId: string, responderId: string) => void;
  'resource:request': (resourceId: string, requesterId: string) => void;
  'task:status': (taskId: string, status: Task['status']) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Alert handlers
    this.socket.on('alert:new', (alert) => {
      this.notifyListeners('alert:new', alert);
    });

    this.socket.on('alert:update', (alert) => {
      this.notifyListeners('alert:update', alert);
    });

    // Incident handlers
    this.socket.on('incident:new', (incident) => {
      this.notifyListeners('incident:new', incident);
    });

    this.socket.on('incident:update', (incident) => {
      this.notifyListeners('incident:update', incident);
    });

    // Resource handlers
    this.socket.on('resource:update', (resource) => {
      this.notifyListeners('resource:update', resource);
    });

    // Task handlers
    this.socket.on('task:update', (task) => {
      this.notifyListeners('task:update', task);
    });

    // Stats handlers
    this.socket.on('stats:update', (stats) => {
      this.notifyListeners('stats:update', stats);
    });
  }

  // Event listener management
  addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  removeEventListener(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  // Emit events
  acknowledgeAlert(alertId: string) {
    this.socket?.emit('alert:acknowledge', alertId);
  }

  respondToIncident(incidentId: string, responderId: string) {
    this.socket?.emit('incident:respond', incidentId, responderId);
  }

  requestResource(resourceId: string, requesterId: string) {
    this.socket?.emit('resource:request', resourceId, requesterId);
  }

  updateTaskStatus(taskId: string, status: Task['status']) {
    this.socket?.emit('task:status', taskId, status);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }
}

export const socketService = new SocketService(); 