import { Server, type Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyJWT } from '@/utils&types/utils/jwt';
import { prisma } from '@/utils&types/utils/db';

let io: Server | null = null;
export interface SocketUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthedSocket extends Socket {
  user?: SocketUser;
}

export const init = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
    transports: ['websocket', 'polling'],
  });

  io.use(async (socket: AuthedSocket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const headerToken = socket.handshake.headers.authorization?.replace('Bearer ', '');
      const token = authToken || headerToken;

      if (!token) {
        return next(new Error('Authentication failed: No token provided'));
      }

      const payload = await verifyJWT(token);
      if (!payload || typeof payload.id !== 'string') {
        return next(new Error('Authentication failed: Invalid token'));
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(new Error('Authentication failed: User not found or inactive'));
      }

      socket.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      //go to connection
      return next();
    } catch (error) {
      return next(new Error('Authentication failed'));
    }
  });

  // when connected
  io.on('connection', (socket: AuthedSocket) => {
    console.log(`[socket] User connected: ${socket.user?.id ?? 'unknown'}`);

    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    socket.on('join_conversation', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.join(`conversation:${conversationId}`);
      socket.emit('joined_conversation', { conversationId });
      console.log(`[socket] User ${socket.user.id} joined conversation ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.to(`conversation:${conversationId}`)
            .emit('user_typing', {
                 userId: socket.user.id,
                 conversationId,
              });
    });

    socket.on('stop_typing', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.to(`conversation:${conversationId}`)
            .emit('user_stopped_typing', {
               userId: socket.user.id,
               conversationId,
               });
    });

    socket.on('join_session', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.join(`session:${sessionId}`);
      socket.emit('joined_session', { sessionId });

      socket.to(`session:${sessionId}`)
            .emit('session_user_joined', {
                userId: socket.user.id,
                sessionId,
              });
    });

    socket.on('leave_session', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`)
            .emit('session_user_left', {
                userId: socket.user.id,
                sessionId,
              });
    });

    socket.on('session_started', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.to(`session:${sessionId}`).emit('session_started', {
        userId: socket.user.id,
        sessionId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('session_ended', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.to(`session:${sessionId}`).emit('session_ended', {
        userId: socket.user.id,
        sessionId,
        timestamp: new Date().toISOString(),
      });

      socket.leave(`session:${sessionId}`);
    });

    socket.on('request_received', (data: { mentorId?: string; body?: string; requestId?: string }) => {
      if (!data.mentorId || !io) return;

      io.to(`user:${data.mentorId}`).emit('notification', {
        type: 'REQUEST_RECEIVED',
        title: 'New Mentorship Request',
        body: data.body,
        requestId: data.requestId,
      });
    });

    socket.on('session_reminder', (data: { studentId?: string; mentorId?: string; body?: string; sessionId?: string }) => {
      if (!io) return;

      if (data.studentId) {
        io.to(`user:${data.studentId}`).emit('notification', {
          type: 'SESSION_REMINDER',
          title: 'Upcoming Session',
          body: data.body,
          sessionId: data.sessionId,
        });
      }

      if (data.mentorId) {
        io.to(`user:${data.mentorId}`).emit('notification', {
          type: 'SESSION_REMINDER',
          title: 'Upcoming Session',
          body: data.body,
          sessionId: data.sessionId,
        });
      }
    });

    socket.on('watch_mentor_availability', (mentorId: string) => {
      socket.join(`mentor:${mentorId}:availability`);
    });

    socket.on('unwatch_mentor_availability', (mentorId: string) => {
      socket.leave(`mentor:${mentorId}:availability`);
    });

    socket.on('disconnect', () => {
      console.log(`[socket] User disconnected: ${socket.user?.id ?? 'unknown'}`);
    });

    socket.on('error', (error) => {
      console.error(`[socket] Error for user ${socket.user?.id ?? 'unknown'}:`, error);
    });
  });

  return io;
};

export const emitUpdate = <T extends object>(room: string, event: string, data: T) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

export const notifyUser = (userId: string, notification: unknown) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

export const broadcastToConversation = (conversationId: string, event: string, data: unknown) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
};

export const broadcastToSession = (sessionId: string, event: string, data: unknown) => {
  if (io) {
    io.to(`session:${sessionId}`).emit(event, data);
  }
};

export const getOnlineUsers = (room: string): string[] => {
  if (!io) return [];
  const ids = io.sockets.adapter.rooms.get(room);
  return ids ? Array.from(ids) : [];
};

export const getIoInstance = () => io;
