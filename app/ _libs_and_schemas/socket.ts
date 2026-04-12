import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyJWT } from '@/app/_utils_and_types/jwt';
import { prisma } from '@/app/_utils_and_types/db';

let io: Server;

export interface SocketUser {
  id: string;
  email: string;
  role: string;
}

export interface SocketWithUser extends Socket {
  user?: SocketUser;
}

/**
 * Initialize Socket.IO with authentication and event handlers
 */
export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket: SocketWithUser, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication failed: No token provided'));
      }

      const payload = await verifyJWT(token);

      if (!payload) {
        return next(new Error('Authentication failed: Invalid token'));
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.isActive) {
        return next(new Error('Authentication failed: User not found or inactive'));
      }

      socket.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: SocketWithUser) => {
    console.log(`[Socket] User connected: ${socket.user?.id}`);

    // Join user's personal room for notifications
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    // ===== CONVERSATION EVENTS =====

    /**
     * Join conversation room
     * Allows user to receive real-time messages
     */
    socket.on('join_conversation', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.join(`conversation:${conversationId}`);
      socket.emit('joined_conversation', { conversationId });
      console.log(`[Socket] User ${socket.user.id} joined conversation ${conversationId}`);
    });

    /**
     * Leave conversation room
     */
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`[Socket] User left conversation ${conversationId}`);
    });

    /**
     * Typing indicator
     */
    socket.on('typing', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.user.id,
        conversationId,
      });
    });

    /**
     * Stop typing
     */
    socket.on('stop_typing', (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
        userId: socket.user.id,
        conversationId,
      });
    });

    // ===== SESSION EVENTS =====

    /**
     * Join session room
     */
    socket.on('join_session', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.join(`session:${sessionId}`);
      socket.emit('joined_session', { sessionId });
      
      // Notify others that user joined
      socket.to(`session:${sessionId}`).emit('session_user_joined', {
        userId: socket.user.id,
        sessionId,
      });

      console.log(`[Socket] User ${socket.user.id} joined session ${sessionId}`);
    });

    /**
     * Leave session room
     */
    socket.on('leave_session', (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit('session_user_left', {
        userId: socket.user.id,
        sessionId,
      });
    });

    /**
     * Session status update
     */
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

    // ===== NOTIFICATION EVENTS =====

    /**
     * Request received (for mentors)
     */
    socket.on('request_received', (data: any) => {
      if (!data.mentorId) return;

      io?.to(`user:${data.mentorId}`).emit('notification', {
        type: 'REQUEST_RECEIVED',
        title: 'New Mentorship Request',
        body: data.body,
        requestId: data.requestId,
      });
    });

    /**
     * Session reminder (for participants)
     */
    socket.on('session_reminder', (data: any) => {
      if (data.studentId) {
        io?.to(`user:${data.studentId}`).emit('notification', {
          type: 'SESSION_REMINDER',
          title: 'Upcoming Session',
          body: data.body,
          sessionId: data.sessionId,
        });
      }

      if (data.mentorId) {
        io?.to(`user:${data.mentorId}`).emit('notification', {
          type: 'SESSION_REMINDER',
          title: 'Upcoming Session',
          body: data.body,
          sessionId: data.sessionId,
        });
      }
    });

    // ===== AVAILABILITY EVENTS =====

    /**
     * Join mentor availability updates
     */
    socket.on('watch_mentor_availability', (mentorId: string) => {
      socket.join(`mentor:${mentorId}:availability`);
    });

    socket.on('unwatch_mentor_availability', (mentorId: string) => {
      socket.leave(`mentor:${mentorId}:availability`);
    });

    // ===== CONNECTION EVENTS =====

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user?.id}`);
    });

    socket.on('error', (error) => {
      console.error(`[Socket] Error for user ${socket.user?.id}:`, error);
    });
  });

  return io;
};

/**
 * Emit event to specific room
 */
export const emitUpdate = <T extends object>(room: string, event: string, data: T) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

/**
 * Emit to user's personal notification room
 */
export const notifyUser = (userId: string, notification: any) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

/**
 * Emit to conversation room
 */
export const broadcastToConversation = (conversationId: string, event: string, data: any) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
};

/**
 * Emit to session room
 */
export const broadcastToSession = (sessionId: string, event: string, data: any) => {
  if (io) {
    io.to(`session:${sessionId}`).emit(event, data);
  }
};

/**
 * Get online users
 */
export const getOnlineUsers = (room: string): string[] => {
  if (!io) return [];
  const socketIds = io.sockets.adapter.rooms.get(room);
  return socketIds ? Array.from(socketIds) : [];
};

export const getIoInstance = () => io;


