'use client'
import {io, Socket} from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useSocketContextSafe } from '#/libs_schemas/context/socket-context';


const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000;

export function useSocket(namespace: string, token: string){
    const socketRef = useRef<Socket |null>(null); 
    const [isOn, setIsOn] =useState<boolean>(false); 
    const provided = useSocketContextSafe();
    const providedSocket = provided?.socket ?? null;

    // if provider is present, prefer it and ignore namespace/token
    useEffect(()=>{
      if (providedSocket) {
        setIsOn(Boolean(provided.isOn));
        return;
      }

      if (!socketUrl || !token) {
            setIsOn(false);
            return;
        }

        if(!socketRef.current){
            socketRef.current = io(`http://localhost:${port}${namespace}`, {
                auth: {token},
                transports: ["websocket",]
            })

        // when connected
        socketRef.current.on("connect", ()=>{
            console.log(`Socket connect to namespace: ${namespace}`)
            setIsOn(true); 
        })
        //when error occurs
        socketRef.current.on("connection_error", (err)=>{
            console.log(`Connection to namespace ${namespace} failed, try again`);
            setIsOn(false); 
        });
    }
       
      //cleanup function 
       return ()=> {
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current = null; 
            }
        }

    },[namespace, token, providedSocket])


    return {socket: providedSocket ?? socketRef.current, isOn}; 
}