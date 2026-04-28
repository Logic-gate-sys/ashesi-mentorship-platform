"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useSocketContextSafe } from '#/libs_schemas/context/socket-context';

type RealtimeEventPayload = Record<string, unknown>;
type RealtimeHandler = (payload: RealtimeEventPayload) => void;

export function useMentorRealtime() {
  const { user, getAccessToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  const enabled = Boolean(socketUrl);

  const provided = useSocketContextSafe();
  const providedSocket = provided?.socket ?? null;
  const providedOn = Boolean(providedSocket);

  useEffect(() => {
    // if socket is provided by context, use that status
    if (providedOn) {
      setIsConnected(Boolean(provided?.isOn));
      return;
    }

    if (!enabled || !user?.id) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      return;
    }

    const socket = io(socketUrl as string, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, socketUrl, user?.id, getAccessToken, providedOn, provided?.isOn]);

  const emit = useCallback((event: string, payload?: RealtimeEventPayload | string) => {
    if (providedSocket) {
      providedSocket.emit(event, payload);
      return;
    }
    socketRef.current?.emit(event, payload);
  }, [providedSocket]);

  const on = useCallback((event: string, handler: RealtimeHandler) => {
    const socket = providedSocket ?? socketRef.current;
    if (!socket) {
      return () => undefined;
    }

    socket.on(event, handler as any);
    return () => {
      socket.off(event, handler as any);
    };
  }, [providedSocket]);

  return {
    enabled,
    isConnected,
    emit,
    on,
  };
}
