"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Send, RefreshCw, Wifi, WifiOff, MessageCircle, AlertCircle } from "lucide-react";
import {
  useMenteeMessages,
} from "#comp-hooks/hooks/mentee/useMenteeMessages";
import { useMenteeConnectedMentors } from "#comp-hooks/hooks/mentee/useMenteeConnectedMentors";
import { useSocketContext } from "#/libs_schemas/context/socket-context";

function formatChatTime(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const AVATAR_FALLBACK = "https://i.pravatar.cc/150?u=mentor-message";

export default function MenteeMessagesPage() {
  const {
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
  } = useMenteeMessages();

  const { socket, isOn } = useSocketContext();
  const isConnected = socket?.connected ?? false;

  const {
    mentors,
    isLoading: mentorsLoading,
    error: mentorsError,
    refresh: refreshMentors,
  } = useMenteeConnectedMentors();

  const [draft, setDraft] = useState("");
  const [sendSucceeded, setSendSucceeded] = useState(false);

  // Handle starting a new conversation with a mentor
  const handleStartChat = useCallback(
    async (mentor: { userId: string; firstName: string; lastName: string; avatarUrl: string }) => {
      if (!mentor.userId) {
        return;
      }

      await startConversation({
        userId: mentor.userId,
        name: `${mentor.firstName} ${mentor.lastName}`,
        avatarUrl: mentor.avatarUrl,
      });
    },
    [startConversation]
  );

  useEffect(() => {
    if (!socket || !isOn || !selectedConversationId) {
      return;
    }

    // Join conversation room
    socket.emit('join_conversation', selectedConversationId, (ack: any) => {
      console.log('[Messages] Joined conversation:', selectedConversationId, ack);
    });

    // Listen for socket events specific to this conversation
    const handleMessageReceived = (payload: any) => {
      const conversationId = payload?.conversationId as string | undefined;
      console.debug('[Messages] message_received:', conversationId);
      if (conversationId && conversationId === selectedConversationId) {
        void loadMessages(conversationId);
      }
    };

    const handleNotification = (payload: any) => {
      console.debug('[Messages] notification received:', payload);
      void refresh();
    };

    const handleMessageSent = (payload: any) => {
      const conversationId = payload?.conversationId as string | undefined;
      console.debug('[Messages] message_sent:', conversationId);
      if (conversationId && conversationId === selectedConversationId) {
        void loadMessages(conversationId);
      }
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('notification', handleNotification);
    socket.on('message_sent', handleMessageSent);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('notification', handleNotification);
      socket.off('message_sent', handleMessageSent);
      
      // Leave conversation room on cleanup
      socket.emit('leave_conversation', selectedConversationId, (ack: any) => {
        console.log('[Messages] Left conversation:', selectedConversationId);
      });
    };
  }, [socket, isOn, selectedConversationId, loadMessages, refresh]);

  const messageCountLabel = useMemo(() => {
    if (!selectedConversation) {
      return "No conversation selected";
    }
    return `${messages.length} message${messages.length === 1 ? "" : "s"}`;
  }, [messages.length, selectedConversation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sent = await sendMessage(draft);
    if (!sent) {
      return;
    }

    setDraft("");
    setSendSucceeded(true);
    window.setTimeout(() => setSendSucceeded(false), 900);
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col gap-4 pb-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">Messages</h1>
          <p className="text-sm text-gray-500">Continue mentorship conversations in real time.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FDF1F2] px-3 py-1 text-xs font-semibold text-[#6A0A1D]">
            {isOn ? (
              isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  Realtime Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  Realtime Reconnecting
                </>
              )
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                Realtime Off
              </>
            )}
          </span>

          <button
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid min-h-0 flex-1 gap-4 md:grid-cols-[280px_1fr_2fr] lg:grid-cols-[280px_1fr_2fr]">

        {/* Connected Mentors Section */}
        <aside className="hidden min-h-0 overflow-y-auto rounded-3xl border border-[#6A0A1D]/10 bg-white p-3 md:flex md:flex-col">
          <h2 className="mb-3 px-2 text-sm font-semibold text-[#241919]">Connected Mentors</h2>

          {mentorsError && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{mentorsError}</span>
            </div>
          )}

          {mentorsLoading ? (
            <p className="px-2 py-3 text-xs text-gray-500">Loading mentors...</p>
          ) : mentors.length === 0 ? (
            <p className="px-2 py-3 text-xs text-gray-500">No connected mentors yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {mentors.map((mentor) => {
                const mentorDisplayName = `${mentor.firstName} ${mentor.lastName}`;
                const isSelected = selectedConversation?.participantId === mentor.userId;
                return (
                  <button
                    key={mentor.userId}
                    onClick={() => void handleStartChat(mentor)}
                    className={`group flex w-full items-center gap-2 rounded-xl p-2 text-left transition ${
                      isSelected
                        ? "bg-[#FDF1F2] ring-1 ring-[#6A0A1D]/15"
                        : "hover:bg-gray-50"
                    }`}
                    title={mentorDisplayName}
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100">
                      <Image
                        src={mentor.avatarUrl || AVATAR_FALLBACK}
                        alt={mentorDisplayName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#241919]">{mentorDisplayName}</p>
                      <p className="truncate text-xs text-gray-400 line-clamp-1">{mentor.company || mentor.industry || "Mentor"}</p>
                    </div>
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#6A0A1D] opacity-0 group-hover:opacity-100 transition" />
                  </button>
                );
              })}
            </div>
          )}
        </aside>
        <aside className="min-h-0 overflow-y-auto rounded-3xl border border-[#6A0A1D]/10 bg-white p-3">
          <h2 className="mb-2 px-2 text-sm font-semibold text-gray-500">Conversations</h2>

          {isLoading && !conversations.length ? (
            <p className="px-2 py-3 text-sm text-gray-500">Loading conversations...</p>
          ) : null}

          {!isLoading && !conversations.length ? (
            <p className="px-2 py-3 text-sm text-gray-500">No conversations yet.</p>
          ) : null}

          <div className="flex flex-col gap-2">
            {conversations.map((conversation) => {
              const active = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    active
                      ? "bg-[#FDF1F2] ring-1 ring-[#6A0A1D]/15"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-gray-100">
                    <Image
                      src={conversation.participantAvatar || AVATAR_FALLBACK}
                      alt={conversation.participantName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[#241919]">
                        {conversation.participantName}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatChatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-500">{conversation.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-h-0 rounded-3xl border border-[#6A0A1D]/10 bg-white p-4">
          {!selectedConversation ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Select a conversation to start messaging.
            </div>
          ) : (
            <div className="flex h-full min-h-0 flex-col">
              <header className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-100">
                    <Image
                      src={selectedConversation.participantAvatar || AVATAR_FALLBACK}
                      alt={selectedConversation.participantName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#241919]">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-xs text-gray-500">{messageCountLabel}</p>
                  </div>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-4 pr-1">
                {!messages.length ? (
                  <p className="my-auto text-center text-sm text-gray-500">No messages yet.</p>
                ) : null}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                        message.isMe
                          ? "bg-[#6A0A1D] text-white rounded-tr-md"
                          : "bg-[#F5F5F5] text-[#241919] rounded-tl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
                      <p
                        className={`mt-1 text-[11px] ${
                          message.isMe ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {formatChatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-2 border-t pt-3">
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] p-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type your message"
                    className="h-10 flex-1 bg-transparent px-2 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    disabled={isSending || !draft.trim()}
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition ${
                      sendSucceeded
                        ? "bg-[#1B5E20]"
                        : "bg-[#6A0A1D] hover:brightness-110"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isSending ? "Sending..." : sendSucceeded ? "Sent" : "Send"}
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
