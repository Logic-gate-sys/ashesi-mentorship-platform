'use client'
import {io, Socket} from 'socket.io-client';
import { useEffect, useRef } from 'react';

const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000
export function useSocket(namespace: string, token: string){
    const socketRef = useRef<Socket |null>(null); 

    //useEffect
    useEffect(()=>{
        if(!socketRef.current){
            socketRef.current = io(`http://localhost:${port}${namespace}`, {
                auth: {token},
                transports: ["websocket",]
            })

        // when connected
        socketRef.current.on("connect", ()=>{
            console.log(`Socket connect to namespace: ${namespace}`)
        })
        //when error occurs
        socketRef.current.on("connection_error", (err)=>{
            console.log(`Connection to namespace ${namespace} failed, try again`)
        });
    }
       
      //cleanup function 
       return ()=> {
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current = null; 
            }
        }

    },[namespace, token])


    return socketRef; 
}