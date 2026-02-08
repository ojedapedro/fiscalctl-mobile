import { AuditLogEntry, KPI, Status } from '../types';

type EventCallback = (data: any) => void;

class MockWebSocketService {
  private listeners: { [key: string]: EventCallback[] } = {};
  private isConnected: boolean = false;
  private simulationInterval: any = null;
  private pingInterval: any = null;

  constructor() {
    this.listeners = {};
  }

  // Simula la conexión al servidor WebSocket
  connect() {
    if (this.isConnected) return;

    console.log('[WS] Connecting to wss://api.fiscalctl.com/stream...');
    
    // Simular latencia de conexión
    setTimeout(() => {
      this.isConnected = true;
      this.emit('status_change', 'connected');
      this.startSimulation();
      this.startHeartbeat();
    }, 1000);
  }

  disconnect() {
    this.isConnected = false;
    this.emit('status_change', 'disconnected');
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.pingInterval) clearInterval(this.pingInterval);
  }

  // Método para suscribirse a eventos
  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Método para desuscribirse
  off(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  // Emitir evento a los suscriptores locales
  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Simulación de datos llegando del servidor
  private startSimulation() {
    this.simulationInterval = setInterval(() => {
      if (!this.isConnected) return;

      const randomChance = Math.random();

      // 1. Evento: Actualización de Impuestos (30% probabilidad)
      if (randomChance > 0.7) {
        const delta = Math.floor(Math.random() * 200) - 50; // Puede subir o bajar
        this.emit('tax_update', { delta });
      }

      // 2. Evento: Nueva transacción en Bitácora (15% probabilidad)
      if (randomChance > 0.85) {
        const now = new Date();
        const categories = ['Impuestos', 'Parafiscales', 'Nómina', 'Proveedores', 'Bancos'];
        const titles = ['Pago ISLR Ret.', 'Transferencia Banesco', 'Pago Nómina Q2', 'Aporte IVSS', 'Factura AWS'];
        
        const newLog: AuditLogEntry = {
          id: `ws-log-${Date.now()}`,
          title: titles[Math.floor(Math.random() * titles.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          amount: Math.floor(Math.random() * 5000) + 100,
          date: `Hoy, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
          status: Math.random() > 0.2 ? Status.APPROVED : Status.PENDING
        };
        
        this.emit('new_log', newLog);
      }

    }, 2000); // Verificar cambios cada 2 segundos
  }

  private startHeartbeat() {
    // Simular inestabilidad de red ocasional
    this.pingInterval = setInterval(() => {
        if (Math.random() > 0.95) {
            console.log('[WS] Connection lost. Reconnecting...');
            this.emit('status_change', 'reconnecting');
            this.isConnected = false;
            setTimeout(() => {
                this.isConnected = true;
                this.emit('status_change', 'connected');
                console.log('[WS] Reconnected.');
            }, 3000);
        }
    }, 10000);
  }
}

// Exportar como Singleton para usar la misma instancia en toda la app
export const wsService = new MockWebSocketService();