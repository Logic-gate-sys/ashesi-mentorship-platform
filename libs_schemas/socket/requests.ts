import { Server, type Socket } from "socket.io";
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

export const initRequestNameSpace = (io: Server)=>{
  const nsp = io.of('/requests');
   nsp.use( async(socket: AuthedSocket, next)=>{
    try {
      const authToken = socket.handshake.auth?.token; // if auth token is sent without bearer
      const headerToken = socket.handshake.headers.authorization?.replace("Bearer ", "");
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
        select: { 
          id: true, 
          email: true, 
          role: true, 
          isActive: true, 
          menteeProfile:true, 
          mentorProfile: true 
        },
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
    } catch {
      return next(new Error("Authentication failed"));
    }
  })
  
  //on connection
  nsp.on('connection', (socket: AuthedSocket)=>{
     console.log(`[Socket] connected, UserId: ${socket.user?.id}`);
     if(socket.user?.id){
      socket.join(`user:${socket.user?.id}`)
     }

    socket.on("requets:sent", (data: { mentorId?: string, goal: string, message?: string, requestId?: string }) => {
        if (!data.mentorId || !io) return;

        nsp.to(`user:${data.mentorId}`).emit("notification", {
          type: "REQUEST_RECEIVED",
          title: "New Mentorship Request",
          body: {goal: data.goal, message: data.message},
          requestId: data.requestId,
        });
      },
    );

     // when mentor update availability: mentee should know
    socket.on("availability:updated", (mentorId: string) => {
      socket.join(`mentor:${mentorId}:availability`);
    });

    socket.on("unwatch:mentor:availability", (mentorId: string) => {
      socket.leave(`mentor:${mentorId}:availability`);
    });
  });

  return nsp;
}

