import { Server as HttpServer } from "http";
import {Server} from 'socket.io';
import { initConversationSocket } from "./conversation";
import { initRequestNameSpace } from "./requests";
import { initSessionNameSpace } from "./session";

let io: Server | null = null ; 
export const initSocketNameSpaces = (server: HttpServer) :Server =>{
   //if io is not initialised 
   if(!io){
    // initialise singleton socket server
    io = new Server(server, {
        path: 'api/socket/io',
        addTrailingSlash: false,
        transports: ['websocket', 'polling']
    })
   }
   // initialise all namespace 
   initConversationSocket(io);
   initRequestNameSpace(io)
   initSessionNameSpace(io); 
   console.log('All namesapce initialise'); 

   return io ; 
}



//export io instance 
export const getIOInstance = ()=>{
    if(!io) throw new Error('Socket not initialised');

    // return the already initialised io
    return io ;
}