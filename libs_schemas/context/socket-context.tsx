'use client'
import { createContext, useContext, ReactNode, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000;

interface SocketContextType {
  socket: Socket | null;
  isOn: boolean;
  isConnecting: boolean;
}

interface SocketProps {
  children: ReactNode;
  namespace: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children, namespace }: SocketProps) => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { getAccessToken, user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsRef = useRef<number>(10);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.warn('[Socket] No auth token available, skipping connection');
      return;
    }

    const createSocket = () => {
      try {
        const socket = io(`http://localhost:${port}${namespace}`, {
          auth: { token },
          transports: ['websocket', 'polling'],
          path: '/soc/socket/io',
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: maxReconnectAttemptsRef.current,
        });

        // Connection established
        socket.on('connect', () => {
          console.log(`[Socket] ✅ Connected to namespace: ${namespace}`);
          setIsOn(true);
          setIsConnecting(false);
          reconnectAttemptsRef.current = 0;
          setupHeartbeat(socket);
        });

        // Connection error
        socket.on('connect_error', (error: Error | { message: string }) => {
          const message = error instanceof Error ? error.message : (error?.message || 'Unknown error');
          console.warn(`[Socket] ⚠️ Connection error on ${namespace}:`, message);
          setIsOn(false);
          reconnectAttemptsRef.current += 1;
        });

        // Disconnected
        socket.on('disconnect', (reason: string) => {
          console.log(`[Socket] 🔌 Disconnected from ${namespace}. Reason: ${reason}`);
          setIsOn(false);
          if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
          }
          // Auto-reconnect on unexpected disconnects
          if (reason === 'io server disconnect') {
            socket.connect();
          }
        });

        // Connecting state
        socket.on('connect_attempt', () => {
          setIsConnecting(true);
        });

        // Error event
        socket.on('error', (error: Error | { message: string }) => {
          const message = error instanceof Error ? error.message : (error?.message || 'Unknown error');
          console.error(`[Socket] ❌ Socket error on ${namespace}:`, message);
        });

        socketRef.current = socket;
        setSocketInstance(socket);

        return socket;
      } catch (error) {
        console.error(`[Socket] Failed to create socket:`, error);
        return null;
      }
    };

    const setupHeartbeat = (socket: Socket) => {
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }

      heartbeatTimeoutRef.current = setTimeout(() => {
        if (socket.connected) {
          socket.emit('ping', () => {
            console.log('[Socket] 💓 Heartbeat acknowledged');
            setupHeartbeat(socket);
          });
        }
      }, 30000); // 30 second heartbeat interval
    };

    createSocket();

    // Cleanup
    return () => {
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocketInstance(null);
        socketRef.current = null;
        console.log(`[Socket] 🔌 Cleaned up namespace: ${namespace}`);
      }
    };
  }, [getAccessToken, namespace, user?.id]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance ?? null, isOn, isConnecting }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};