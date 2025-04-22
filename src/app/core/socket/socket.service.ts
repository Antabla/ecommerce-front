import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor Socket.IO');
    });
  }

  /**
   * Escuchar eventos del servidor
   */
  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket?.on(eventName, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  /**
   * Cerrar conexión manualmente
   */
  disconnect(): void {
    this.socket?.disconnect();
  }
}
