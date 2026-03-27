import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
    transports: ['polling', 'websocket'],
  });

  io.on('connection', (socket) => {
    socket.on('join_cafeteria', (cafeteriaId) => {
    socket.join(`cafeteria:${cafeteriaId}`);
    });
  });

  return io;
};

export const emitUpdate = <T extends object>(room: string, event: string, data: T) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};


