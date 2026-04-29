"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Send, RefreshCw, Wifi, WifiOff } from "lucide-react";
import {
  useMentorMessages,
} from "#comp-hooks/hooks/mentor";
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

export default function MentorMessagesPage() {
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
  } = useMentorMessages();

  const { socket, isOn } = useSocketContext();

  const [draft, setDraft] = useState("");
  const [sendSucceeded, setSendSucceeded] = useState(false);

  useEffect(() => {
    if (!socket || !isOn || !selectedConversationId) {
      return;
    }

    socket.emit("join_conversation", selectedConversationId);

    return () => {
      socket.emit("leave_conversation", selectedConversationId);
    };
  }, [socket, isOn, selectedConversationId]);

  useEffect(() => {
    if (!socket || !isOn) {
      return;
    }

    socket.on("message_received", (payload) => {
      const conversationId = payload?.conversationId as string | undefined;

      if (conversationId && conversationId === selectedConversationId) {
        void loadMessages(conversationId);
      }

      void refresh();
    });

    socket.on("notification", () => {
      void refresh();
    });

    return () => {
      socket.off("message_received", () => void refresh());
      socket.off("notification", () => void refresh());
    };
  }, [socket, isOn, loadMessages, refresh, selectedConversationId]);

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
            {enabled ? (
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

      <section className="grid min-h-0 flex-1 gap-4 md:grid-cols-[1.2fr_2fr]">
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
