import {  Server, type Socket } from "socket.io";
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

export const initConversationSocket = (io: Server) => {
  const nps = io.of("/conversation");

  // authenticating user: middleware like - executes once on each connection
  nps.use(async (socket: AuthedSocket, next) => {
    try {
      const authToken = socket.handshake.auth?.token; // if auth token is sent without bearer
      const headerToken = socket.handshake.headers.authorization?.replace(
        "Bearer ",
        "",
      );
      const token = authToken || headerToken;

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

      //go to connection
      return next();
    } catch (error) {
      return next(new Error("Authentication failed"));
    }
  });
  // when connected
  nps.on("connection", (socket: AuthedSocket) => {
    console.log(`[[socket] User connected:] ${socket.user?.id ?? "unknown"}`);
    // user room
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    // when client sents to a conversation
    socket.on("conversation:joined", (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.join(`conversation:${conversationId}`);
      socket.emit("conversation:join", { conversationId });

      //just logging for debug
      console.log(
        `[socket] User ${socket.user.id} joined conversation ${conversationId}`,
      );
    });

    socket.on("conversation:left", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("typing", (conversationId: string) => {
      if (!socket.user?.id) return;

      // broadcast to the specific conversation room
      socket.to(`conversation:${conversationId}`).emit("user:typing", {
        userId: socket.user.id,
        conversationId,
      });
    });

    socket.on("typing:stopped", (conversationId: string) => {
      if (!socket.user?.id) return;

      socket.to(`conversation:${conversationId}`).emit("user:typing:stopped", {
        userId: socket.user.id,
        conversationId,
      });
    });

    // when user disconnects
    socket.on("disconnect", () => {
      console.log(
        `[socket] User disconnected: ${socket.user?.id ?? "unknown"}`,
      );
    });

    socket.on("error", (error) => {
      console.error(
        `[socket] Error for user ${socket.user?.id ?? "unknown"}:`,
        error,
      );
    });
  });

  return nps;
};

