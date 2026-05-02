import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';

declare global {
  var __io: SocketIOServer | undefined;
}

export function initIO(httpServer: HttpServer): SocketIOServer {
  if (globalThis.__io) return globalThis.__io;

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    path: '/soc/socket/io',
    addTrailingSlash: false,
    transports: ['polling', 'websocket'],
  });

  registerHandlers(io);
  globalThis.__io = io;
  console.log('[socket.io] Initialized');
  return io;
}
// 
function registerHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log('[socket.io] Connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[socket.io] Disconnected: ${socket.id} — ${reason}`);
    });
  });
}



export function getIOInstance(): SocketIOServer {
  if (globalThis.__io) return globalThis.__io;

  // No-op stub — routes call .to().emit() safely, nothing fires until server initializes
  return {
    to: () => ({ emit: () => {} }),
    emit: () => {},
    in: () => ({ emit: () => {} }),
  } as unknown as SocketIOServer;
}