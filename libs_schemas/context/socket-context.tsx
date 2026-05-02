'use client'
import { createContext, useContext, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || '/soc/socket.io';

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
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastErrorRef = useRef<string | null>(null);
  const accessToken = getAccessToken();

  const socketUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      return process.env.NEXT_PUBLIC_SOCKET_URL;
    }

    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (!accessToken) {
      console.warn('[Socket] No auth token available, skipping connection');
      return;
    }

    let socket: Socket;
    let cancelled = false;

    const createSocket = async () => {
      try {
        const { io } = await import('socket.io-client');

        if (cancelled) {
          return;
        }

        socket = io(socketUrl, {
          auth: { token: accessToken },
          path: SOCKET_PATH,
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: Math.min(750 * Math.max(1, reconnectAttemptsRef.current + 1), 8000),
          reconnectionDelayMax: 8000,
          reconnectionAttempts: maxReconnectAttemptsRef.current,
          timeout: 10000,
          autoConnect: true,
          withCredentials: true,
          forceNew: true,
        });

        socket.on('connect', () => {
          console.log(`[Socket] ✅ Connected to namespace: ${namespace}`);
          setIsOn(true);
          setIsConnecting(false);
          reconnectAttemptsRef.current = 0;
          lastErrorRef.current = null;
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          setupHeartbeat(socket);
        });

        socket.on('connect_error', (error: Error) => {
          const message = error?.message ?? 'Unknown error';
          lastErrorRef.current = message;
          console.warn(`[Socket] ⚠️ Connection error on ${namespace} (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttemptsRef.current}):`, message);
          setIsOn(false);
          setIsConnecting(true);
          reconnectAttemptsRef.current += 1;

          if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = setTimeout(() => {
            if (!socket.connected) {
              console.error(`[Socket] ❌ Failed after ${reconnectAttemptsRef.current} attempts. Last error: ${lastErrorRef.current}`);
            }
          }, 5000);
        });

        socket.on('disconnect', (reason: string) => {
          console.log(`[Socket] 🔌 Disconnected from ${namespace}. Reason: ${reason}`);
          setIsOn(false);
          setIsConnecting(false);
          if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
          }
        });

        socket.io.on('reconnect_attempt', () => {
          setIsConnecting(true);
          console.debug(`[Socket] 🔗 Reconnect attempt ${reconnectAttemptsRef.current + 1} for ${namespace}`);
        });

        socket.io.on('reconnect', () => {
          setIsConnecting(false);
          reconnectAttemptsRef.current = 0;
        });

        socket.io.on('reconnect_error', (error) => {
          const message = error instanceof Error ? error.message : 'Unknown reconnect error';
          lastErrorRef.current = message;
          console.warn(`[Socket] ⚠️ Reconnect error on ${namespace}:`, message);
        });

        socket.on('error', (error: Error) => {
          lastErrorRef.current = error?.message ?? 'Unknown error';
          console.error(`[Socket] ❌ Socket error on ${namespace}:`, lastErrorRef.current);
        });

        socketRef.current = socket;
        setSocketInstance(socket);
        setIsConnecting(true);
      } catch (error) {
        console.error(`[Socket] Failed to create socket:`, error);
      }
    };

    const setupHeartbeat = (s: Socket) => {
      if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = setTimeout(() => {
        if (s.connected) {
          s.emit('ping', () => {
            setupHeartbeat(s);
          });
        }
      }, 30000);
    };

    createSocket();

    return () => {
      cancelled = true;
      if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.io.removeAllListeners();
        socketRef.current.disconnect();
        setSocketInstance(null);
        socketRef.current = null;
      }
    };
  }, [accessToken, namespace, socketUrl, user?.id]);

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