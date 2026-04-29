import { Server as HttpServer } from "http";
import {Server} from 'socket.io';
import { initConversationSocket } from "./conversation";
import { initRequestNameSpace } from "./requests";
import { initSessionNameSpace } from "./session";

declare global{
var io: Server | undefined; 

}

export const initSocketNameSpaces = (server: HttpServer) => {
   //if io is not initialised 
   if(!global.io){
    // initialise singleton socket server
    global.io = new Server(server, {
        cors:{
            origin: "http://localhost:3000",
            methods: ["POST", "GET"]
        }, 
        path: '/soc/socket/io',
        addTrailingSlash: false,
        transports: [ 'polling','websocket']
    })
   }
   // initialise all namespace 
   initConversationSocket(global.io);
   initRequestNameSpace(global.io)
   initSessionNameSpace(global.io); 
   console.log('::::<<<ALL NAME SPACES INITIALISED>>>::::'); 
   
   return global.io ;
}



//export io instance 
export const getIOInstance = ()=>{
    if(!global.io) throw new Error('Socket not initialised');

    // return the already initialised io
    return global.io ;
}