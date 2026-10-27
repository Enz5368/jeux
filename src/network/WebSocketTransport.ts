import type { ClientMessage, NetworkTransport, ServerMessage } from './protocol';
export class WebSocketTransport implements NetworkTransport {
  private socket: WebSocket | null = null; private listeners = new Set<(message: ServerMessage) => void>();
  connect(url: string): Promise<void> { return new Promise((resolve, reject) => { const socket = new WebSocket(url); this.socket = socket; socket.addEventListener('open', () => resolve(), { once: true }); socket.addEventListener('error', () => reject(new Error('Connexion WebSocket impossible')), { once: true }); socket.addEventListener('message', (event) => { try { const message = JSON.parse(String(event.data)) as ServerMessage; this.listeners.forEach((listener) => listener(message)); } catch { /* Paquet mal formé ignoré. */ } }); }); }
  send(message: ClientMessage): void { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message)); }
  close(): void { this.socket?.close(); this.socket = null; }
  onMessage(handler: (message: ServerMessage) => void): () => void { this.listeners.add(handler); return () => { this.listeners.delete(handler); }; }
}
