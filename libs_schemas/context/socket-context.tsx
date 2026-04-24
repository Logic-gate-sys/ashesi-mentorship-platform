'use client'
import { createContext, useContext, ReactNode, useMemo } from 'react';
import {io, Socket} from 'socket.io-client';
import { useEffect, useState} from 'react';
import { useAuth } from './auth-context';


const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000;

  


interface SocketContextType {
  socket: Socket | null;
  isOn: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children, namespace }: { 
  children: ReactNode; 
  namespace: string; 
}) => {
    const [socketInstance, setSocketInstance ] = useState<Socket | null>(null); 
    const [isOn, setIsOn] =useState<boolean>(false); 
    const {getAccessToken} =useAuth(); 

    //useEffect
    useEffect(()=>{
        const init =  async()=>{
            const token = getAccessToken();
            const socket = io(`http://localhost:${port}${namespace}`, { auth: {token},transports: ["websocket",]});
        // when connected
        socket.on("connect", ()=>{
            console.log(`Socket connect to namespace: ${namespace}`)
            setIsOn(true); 
        })
        //when error occurs
       socket.on("connection_error", (err)=>{
            console.log(`Connection to namespace ${namespace} failed, try again`);
            setIsOn(false); 
        });
       
       //set state 
        setSocketInstance(socket);
     } 
       // initialise 
       init();
      //cleanup function 
       return ()=> {
            if(socketInstance){
                socketInstance.disconnect();
                setSocketInstance(null);
            }
        } 

    },[socketInstance, namespace]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isOn }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocketContext must be used within SocketProvider");
  return context;
};