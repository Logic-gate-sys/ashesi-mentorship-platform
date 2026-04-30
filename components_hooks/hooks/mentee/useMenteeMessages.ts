'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface MenteeConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
}

export interface MenteeMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isMe: boolean;
}

export interface StartMenteeConversationInput {
  userId: string;
  name: string;
  avatarUrl: string;
}

export function useMenteeMessages() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [conversations, setConversations] = useState<MenteeConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MenteeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to prevent stale closures and unnecessary rerenders
  const pendingRefreshRef = useRef<boolean>(false);
  const messageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const mapConversations = useCallback(
    (items: any[]): MenteeConversation[] => {
      return items.map((conversation) => {
        const latest = conversation.messages?.[0];
        const isSenderMe = latest?.senderId === user?.id;
        const other = isSenderMe ? latest?.receiver : latest?.sender;

        return {
          id: conversation.id,
          participantId: other?.id || (isSenderMe ? latest?.receiverId : latest?.senderId) || '',
          participantName: other ? `${other.firstName} ${other.lastName}` : 'Unknown User',
          participantAvatar:
            other?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.id}`,
          lastMessage: latest?.body || 'No messages yet',
          lastMessageAt: latest?.createdAt || conversation.updatedAt,
        };
      });
    },
    [user?.id]
  );

  const refreshConversations = useCallback(async () => {
    try {
      const response = await authorizedFetch('/api/mentees/messages?limit=50');
      if (!response.ok) {
        throw new Error(`Failed to load conversations (${response.status})`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload?.data?.conversations) ? payload.data.conversations : [];
      const parsed = mapConversations(items);

      setConversations(parsed);
      if (!selectedConversationId && parsed.length > 0) {
        setSelectedConversationId(parsed[0].id);
      }
    } catch (err) {
      console.error('[useMenteeMessages] refreshConversations error:', err);
      throw err;
    }
  }, [authorizedFetch, mapConversations, selectedConversationId]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const response = await authorizedFetch(`/api/mentees/messages/${conversationId}?limit=100`);
        if (!response.ok) {
          throw new Error(`Failed to load messages (${response.status})`);
        }

        const payload = await response.json();
        const conversation = payload?.data?.conversation;
        const rawMessages = Array.isArray(conversation?.messages) ? conversation.messages : [];

        const parsed: MenteeMessage[] = rawMessages
          .map((message: any) => ({
            id: message.id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            text: message.body,
            createdAt: message.createdAt,
            isMe: message.senderId === user?.id,
          }))
          .reverse();

        setMessages(parsed);
      } catch (err) {
        console.error('[useMenteeMessages] loadMessages error:', err);
        throw err;
      }
    },
    [authorizedFetch, user?.id]
  );

  const refresh = useCallback(async () => {
    if (pendingRefreshRef.current) {
      console.debug('[useMenteeMessages] Refresh already pending, skipping');
      return;
    }

    pendingRefreshRef.current = true;
    try {
      setIsLoading(true);
      await refreshConversations();
      if (selectedConversationId) {
        await loadMessages(selectedConversationId);
      }
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMsg);
      console.error('[useMenteeMessages] refresh error:', errorMsg);
    } finally {
      setIsLoading(false);
      pendingRefreshRef.current = false;
    }
  }, [refreshConversations, selectedConversationId, loadMessages]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return;

    if (messageLoadTimeoutRef.current) {
      clearTimeout(messageLoadTimeoutRef.current);
    }

    loadMessages(selectedConversationId).catch((err) => {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMsg);
    });
  }, [selectedConversationId, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedConversation || !text.trim()) {
        return false;
      }

      try {
        setIsSending(true);
        const response = await authorizedFetch(`/api/mentees/messages/${selectedConversation.id}`, {
          method: 'POST',
          body: JSON.stringify({
            receiverId: selectedConversation.participantId,
            body: text.trim(),
            type: 'TEXT',
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message (${response.status})`);
        }

        // Refresh messages after send succeeds
        await loadMessages(selectedConversation.id);
        await refreshConversations();
        setError(null);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        console.error('[useMenteeMessages] sendMessage error:', errorMsg);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [authorizedFetch, selectedConversation, loadMessages, refreshConversations]
  );

  const startConversation = useCallback(
    async ({ userId, name, avatarUrl }: StartMenteeConversationInput) => {
      const existingConversation = conversations.find((conversation) => conversation.participantId === userId);
      if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        return existingConversation.id;
      }

      const response = await authorizedFetch('/api/mentees/messages', {
        method: 'POST',
        body: JSON.stringify({ participantId: userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start conversation (${response.status})`);
      }

      const payload = await response.json();
      const conversationId = payload?.data?.conversation?.id as string | undefined;

      if (!conversationId) {
        throw new Error('Conversation could not be created');
      }

      const syntheticConversation: MenteeConversation = {
        id: conversationId,
        participantId: userId,
        participantName: name,
        participantAvatar: avatarUrl,
        lastMessage: 'No messages yet',
        lastMessageAt: new Date().toISOString(),
      };

      setConversations((prev) => [
        syntheticConversation,
        ...prev.filter((conversation) => conversation.id !== conversationId),
      ]);
      setSelectedConversationId(conversationId);
      setMessages([]);

      return conversationId;
    },
    [authorizedFetch, conversations]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (messageLoadTimeoutRef.current) {
        clearTimeout(messageLoadTimeoutRef.current);
      }
      if (conversationLoadTimeoutRef.current) {
        clearTimeout(conversationLoadTimeoutRef.current);
      }
    };
  }, []);

  return {
    conversations,
    selectedConversation,
    selectedConversationId,
    setSelectedConversationId,
    messages,
    isLoading,
    isSending,
    error,
    refresh,
    loadMessages,
    sendMessage,
    startConversation,
  };
}
