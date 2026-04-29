'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  }, [authorizedFetch, mapConversations, selectedConversationId]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
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
        }))
        .reverse();

      setMessages(parsed);
    },
    [authorizedFetch, user?.id]
  );

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      await refreshConversations();
      if (selectedConversationId) {
        await loadMessages(selectedConversationId);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [refreshConversations, selectedConversationId, loadMessages]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selectedConversationId) return;

    loadMessages(selectedConversationId).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    });
  }, [selectedConversationId, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedConversation || !text.trim()) {
        return false;
      }

      try {
        setIsSending(true);
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

        await loadMessages(selectedConversation.id);
        await refreshConversations();
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [authorizedFetch, selectedConversation, loadMessages, refreshConversations]
  );

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
