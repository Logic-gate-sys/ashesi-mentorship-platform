'use client'
import { createContext, useContext, ReactNode,useEffect, useRef,useState } from 'react';
import {io, Socket} from 'socket.io-client';
import { useAuth } from './auth-context';


const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000;
interface SocketContextType {
  socket: Socket | null ;
  isOn: boolean;
}
interface SocketProps{
  children: ReactNode; 
  namespace: string; 
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children, namespace }: SocketProps) => {
    const [isOn, setIsOn] = useState<boolean>(false); 
    const [socketInstance, setSocketInstance] = useState< Socket | null>(); 
    const {getAccessToken, user} = useAuth(); 
    const socketRef  = useRef<Socket |null>(null);
    //useEffect
    useEffect(() => {
        const token = getAccessToken();
        // socket 
        const socket = io(`http://localhost:${port}${namespace}`, {
           auth: {
            token,
          },
           transports: ["polling","websocket"],
           path: "/soc/socket/io"
          });

        // when connected
        socket.on("connect", ()=>{
            console.log(`Socket connected to namespace:${namespace}`)
            setIsOn(true); 
        });

        //when error occurs
       socket.on("connect_error", (err)=>{
            console.log(`Connection to namespace ${namespace} failed, try again`);
            setIsOn(false); 
        });
        
        socketRef.current = socket;
        if(socketRef.current){
          setSocketInstance( socketRef.current); 
        }
        // clean up 
        return ()=>{
         if (socket || socketRef.current) {
             socket.disconnect();
             setSocketInstance(null);
             socketRef.current = null; 
             console.log(`🔌 Disconnected from ${namespace}`);
           }
        }

    },[getAccessToken, namespace, user?.mentorProfile?.id]);

    
  return (
    <SocketContext.Provider value={{socket: socketInstance?? null, isOn }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocketContext must be used within SocketProvider");
  return context;
};