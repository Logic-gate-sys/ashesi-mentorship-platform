import { Server, type Socket } from "socket.io";
import { requirePermission } from "../abac";
import { verifyJWT } from "#utils-types/utils/jwt";
import { prisma } from "#utils-types/utils/db";

//Socket interfaces
export interface SocketUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthedSocket extends Socket {
  user?: SocketUser;
}

//Session namespace
export const initSessionNameSpace = (io: Server) => {
  const nsp = io.of("/sessions");

  //session middleware
  nsp.use(async (socket: AuthedSocket, next) => {
    try {
      const authToken = socket.handshake.auth?.token; // if auth token is sent without bearer
      const headerToken = socket.handshake.headers.authorization?.replace(
        "Bearer ",
        "",
      );
      const token = authToken || headerToken;
      // if no token
      if (!token) {
        return next(new Error("Authentication failed: No token provided"));
      }

      const payload = await verifyJWT(token);
      if (!payload || typeof payload.id !== "string") {
        return next(new Error("Authentication failed: Invalid token"));
      }
      // find user
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(
          new Error("Authentication failed: User not found or inactive"),
        );
      }

      // attach user to the socket object
      socket.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      // authorise user base on namespace before going on with connection

      //go to connection
      return next();
    } catch (error) {
      return next(new Error("Authentication failed"));
    }
  });

  nsp.on("connection", (socket: AuthedSocket) => {
    console.log(`[socket]: session connected ----> UserId: ${socket.user?.id}`);
    // when user connects to session ---> join the session room
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    socket.on("session:joined", (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.join(`session:${sessionId}`);
      socket.emit("session:joined", { sessionId });

      socket.to(`session:${sessionId}`).emit("session:user:joined", {
        userId: socket.user.id,
        sessionId,
      });
    });

    socket.on("session:left", (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit("session:user:left", {
        userId: socket.user.id,
        sessionId,
      });
    });

    socket.on("session:started", (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.to(`session:${sessionId}`).emit("session:started", {
        userId: socket.user.id,
        sessionId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("session:ended", (sessionId: string) => {
      if (!socket.user?.id) return;

      socket.to(`session:${sessionId}`).emit("session:ended", {
        userId: socket.user.id,
        sessionId,
        timestamp: new Date().toISOString(),
      });

      socket.leave(`session:${sessionId}`);
    });

    socket.on(
      "session:reminder",
      (data: {
        menteeId?: string;
        mentorId?: string;
        body?: string;
        sessionId?: string;
      }) => {
        if (!io) return;
        // if mentor id is present
        if (data.menteeId) {
          io.to(`user:${data.menteeId}`).emit("notification", {
            type: "SESSION_REMINDER",
            title: "Upcoming Session",
            body: data.body,
            sessionId: data.sessionId,
          });
        }
        // if mentee id is present
        if (data.mentorId) {
          io.to(`user:${data.mentorId}`).emit("notification", {
            type: "SESSION_REMINDER",
            title: "Upcoming Session",
            body: data.body,
            sessionId: data.sessionId,
          });
        }
      },
    );
  });

  return nsp;
};
