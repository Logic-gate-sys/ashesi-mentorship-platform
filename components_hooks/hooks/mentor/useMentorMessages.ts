'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';
import { useFetchApi } from '../shared/useMentorApi';

export interface MentorConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
}

export interface MentorMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isMe: boolean;
  isPending?: boolean;
}

export function useMentorMessages() {
  const { user } = useAuth();
  const { authorizedFetch } = useFetchApi();

  const [conversations, setConversations] = useState<MentorConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to prevent stale closures and unnecessary rerenders
  const pendingRefreshRef = useRef<boolean>(false);
  const messageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageIdsRef = useRef<Set<string>>(new Set());

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const mapConversations = useCallback(
    (items: any[]): MentorConversation[] => {
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
      const response = await authorizedFetch('/api/mentors/messages?limit=50');
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
      console.error('[useMentorMessages] refreshConversations error:', err);
      throw err;
    }
  }, [authorizedFetch, mapConversations, selectedConversationId]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const response = await authorizedFetch(`/api/mentors/messages/${conversationId}?limit=100`);
        if (!response.ok) {
          throw new Error(`Failed to load messages (${response.status})`);
        }

        const payload = await response.json();
        const conversation = payload?.data?.conversation;
        const rawMessages = Array.isArray(conversation?.messages) ? conversation.messages : [];

        const parsed: MentorMessage[] = rawMessages
          .map((message: any) => ({
            id: message.id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            text: message.body,
            createdAt: message.createdAt,
            isMe: message.senderId === user?.id,
            isPending: false,
          }))
          .reverse()
          .filter((msg: MentorMessage) => {
            // Deduplicate: only add if not already seen
            if (messageIdsRef.current.has(msg.id)) {
              return false;
            }
            messageIdsRef.current.add(msg.id);
            setLastMessageIdRef(msg.id);
            return true;
          });

        setMessages((prevMessages) => {
          // Merge optimistic messages with loaded messages
          const optimisticMessages = prevMessages.filter((m) => m.isPending);
          return [...parsed, ...optimisticMessages];
        });
      } catch (err) {
        console.error('[useMentorMessages] loadMessages error:', err);
        throw err;
      }
    },
    [authorizedFetch, user?.id]
  );

  const refresh = useCallback(async () => {
    if (pendingRefreshRef.current) {
      console.debug('[useMentorMessages] Refresh already pending, skipping');
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
      console.error('[useMentorMessages] refresh error:', errorMsg);
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
        
        // Generate optimistic message with temporary ID
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: MentorMessage = {
          id: tempId,
          senderId: user?.id || '',
          receiverId: selectedConversation.participantId,
          text: text.trim(),
          createdAt: new Date().toISOString(),
          isMe: true,
          isPending: true,
        };

        // Add optimistic message immediately
        setMessages((prev) => [...prev, optimisticMessage]);

        const response = await authorizedFetch(`/api/mentors/messages/${selectedConversation.id}`, {
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

        // Remove optimistic message and refresh
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        await loadMessages(selectedConversation.id);
        await refreshConversations();
        setError(null);
        return true;
      } catch (err) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== `temp-${Date.now()}`));
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        console.error('[useMentorMessages] sendMessage error:', errorMsg);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [authorizedFetch, selectedConversation, loadMessages, refreshConversations, user?.id]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (messageLoadTimeoutRef.current) {
        clearTimeout(messageLoadTimeoutRef.current);
        messageLoadTimeoutRef.current = null;
      }
      if (conversationLoadTimeoutRef.current) {
        clearTimeout(conversationLoadTimeoutRef.current);
        conversationLoadTimeoutRef.current = null;
      }
      messageIdsRef.current.clear();
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
  };
}
