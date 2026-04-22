'use client';

import { useEffect, useState } from 'react';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (text: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mentors/messages?limit=50');
        if (!response.ok) throw new Error('Failed to fetch conversations');

        const { data } = await response.json();
        
        if (Array.isArray(data.conversations)) {
          const formatted = data.conversations.map((conv: any) => ({
            id: conv.id,
            name: conv.menteeName || 'Unknown',
            avatar: conv.menteeAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`,
            lastMsg: conv.lastMessage || 'No messages yet',
            time: 'Now',
            online: false,
          }));
          setConversations(formatted);
          if (formatted.length > 0) {
            setSelectedConversation(formatted[0]);
            loadMessages(formatted[0].id);
          }
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/mentors/messages/${conversationId}?limit=50`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const { data } = await response.json();
      
      if (Array.isArray(data.messages)) {
        const formatted = data.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          isUser: msg.senderId !== 'mentor_id', // or use another field to determine if it's the current user
          timestamp: formatTime(new Date(msg.createdAt)),
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const sendMessage = async (text: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch(`/api/mentors/messages/${selectedConversation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: text,
          type: 'TEXT',
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Add to local state
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: 'now',
      }]);

      // Refresh conversation list
      await loadMessages(selectedConversation.id);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return {
    conversations,
    selectedConversation,
    messages,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    loadMessages,
  };
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}
