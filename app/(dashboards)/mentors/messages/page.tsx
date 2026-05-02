"use client";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Send, RefreshCw, Wifi, WifiOff, MessageCircle, AlertCircle, MessagesSquare, Users } from "lucide-react";
import {
  useMentorMessages,
  useMentorConnectedMentees,
} from "#comp-hooks/hooks/mentor";
import { useSocketContext } from "#libs-schemas/context/socket-context";

function formatChatTime(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const AVATAR_FALLBACK = "https://i.pravatar.cc/150?u=mentor-message";

// ── Skeleton primitives ────────────────────────────────────────────────────

function Pulse({ w = "100%", h = "11px", rounded = "rounded-md", className = "" }: {
  w?: string; h?: string; rounded?: string; className?: string;
}) {
  return (
    <div className={`animate-pulse bg-gray-100 ${rounded} ${className}`} style={{ width: w, height: h }} />
  );
}

function SkeletonMentee() {
  return (
    <div className="flex items-center gap-2 rounded-xl p-2">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Pulse w="60%" h="10px" />
        <Pulse w="40%" h="9px" />
      </div>
    </div>
  );
}

function SkeletonConversation() {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-3">
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Pulse w="50%" h="11px" />
          <Pulse w="20%" h="9px" />
        </div>
        <Pulse w="75%" h="9px" />
      </div>
    </div>
  );
}

function SkeletonMessages() {
  const bubbles = [
    { me: false, w: "55%" },
    { me: true,  w: "45%" },
    { me: false, w: "65%" },
    { me: true,  w: "35%" },
    { me: false, w: "50%" },
  ];
  return (
    <div className="flex flex-col gap-3 py-4">
      {bubbles.map((b, i) => (
        <div key={i} className={`flex ${b.me ? "justify-end" : "justify-start"}`}>
          <div
            className="animate-pulse rounded-2xl bg-gray-100 px-4 py-3"
            style={{ width: b.w, height: "38px" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Empty states ──────────────────────────────────────────────────────────

function EmptyMentees() {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
        <Users className="h-4 w-4 text-[#6C1221]" />
      </div>
      <p className="text-xs font-medium text-gray-500">No active mentees yet</p>
      <p className="text-[11px] leading-relaxed text-gray-400">Accept a request to start chatting.</p>
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
        <MessagesSquare className="h-4 w-4 text-[#6C1221]" />
      </div>
      <p className="text-xs font-medium text-gray-500">No conversations yet</p>
      <p className="text-[11px] leading-relaxed text-gray-400">Select a mentee on the left to start one.</p>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF1F2]">
        <MessageCircle className="h-5 w-5 text-[#6C1221]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#241919]">No conversation selected</p>
        <p className="mt-0.5 text-xs text-gray-400">Pick one from the list or start a new chat with a mentee.</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

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
    startConversation,
  } = useMentorMessages();

  const { socket, isOn } = useSocketContext();
  const isConnected = socket?.connected ?? false;

  const { mentees, isLoading: menteesLoading, error: menteesError } = useMentorConnectedMentees();

  const [draft, setDraft] = useState("");
  const [sendSucceeded, setSendSucceeded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = useCallback(
    async (mentee: { userId: string; firstName: string; lastName: string; avatarUrl: string }) => {
      if (!mentee.userId) return;
      await startConversation({
        userId: mentee.userId,
        name: `${mentee.firstName} ${mentee.lastName}`,
        avatarUrl: mentee.avatarUrl,
      });
    },
    [startConversation]
  );

  useEffect(() => {
    if (!socket || !isOn || !selectedConversationId) return;
    socket.emit("conversation:joined", selectedConversationId);

    const handleMessageReceived = (payload: { conversationId?: string } | unknown) => {
      const conversationId = typeof payload === "object" && payload !== null
        ? (payload as { conversationId?: string }).conversationId
        : undefined;
      if (conversationId && conversationId === selectedConversationId) void loadMessages(conversationId);
    };
    const handleNotification = () => void refresh();
    const handleMessageSent = (payload: { conversationId?: string } | unknown) => {
      const conversationId = typeof payload === "object" && payload !== null
        ? (payload as { conversationId?: string }).conversationId
        : undefined;
      if (conversationId && conversationId === selectedConversationId) void loadMessages(conversationId);
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("notification", handleNotification);
    socket.on("message_sent", handleMessageSent);
    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("notification", handleNotification);
      socket.off("message_sent", handleMessageSent);
      socket.emit("conversation:left", selectedConversationId);
    };
  }, [socket, isOn, selectedConversationId, loadMessages, refresh]);

  const messageCountLabel = useMemo(() => {
    if (!selectedConversation) return "No conversation selected";
    return `${messages.length} message${messages.length === 1 ? "" : "s"}`;
  }, [messages.length, selectedConversation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = await sendMessage(draft);
    if (!sent) return;
    setDraft("");
    setSendSucceeded(true);
    window.setTimeout(() => setSendSucceeded(false), 900);
  };

  // Connection badge
  const connectionBadge = (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
      isOn && isConnected
        ? "bg-emerald-50 text-emerald-700"
        : "bg-[#FDF1F2] text-[#6A0A1D]"
    }`}>
      {isOn && isConnected ? (
        <><Wifi className="h-3.5 w-3.5" /> Live</>
      ) : isOn ? (
        <><WifiOff className="h-3.5 w-3.5" /> Reconnecting</>
      ) : (
        <><WifiOff className="h-3.5 w-3.5" /> Offline</>
      )}
    </span>
  );

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col gap-4 pb-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#241919]">Messages</h1>
          <p className="text-sm text-gray-500">Continue mentorship conversations in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          {connectionBadge}
          <button
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-[#6A0A1D] hover:bg-[#FDF1F2] transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </section>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Three-column layout ───────────────────────────────────────── */}
      <section className="grid min-h-0 flex-1 gap-4 md:grid-cols-[240px_1fr_2fr]">

        {/* Col 1 — Active Mentees */}
        <aside className="hidden min-h-0 overflow-y-auto rounded-3xl border border-[#6A0A1D]/10 bg-white p-3 md:flex md:flex-col">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Active Mentees</h2>

          {menteesError && (
            <div className="mb-2 flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{menteesError}</span>
            </div>
          )}

          {menteesLoading ? (
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((i) => <SkeletonMentee key={i} />)}
            </div>
          ) : mentees.length === 0 ? (
            <EmptyMentees />
          ) : (
            <div className="flex flex-col gap-1">
              {mentees.map((mentee) => {
                const isSelected = selectedConversation?.participantId === mentee.userId;
                const displayName = `${mentee.firstName} ${mentee.lastName}`;
                const secondary = mentee.major || mentee.yearGroup || "Student";
                return (
                  <button
                    key={mentee.id}
                    onClick={() => void handleStartChat(mentee)}
                    className={`group flex w-full items-center gap-2 rounded-xl p-2 text-left transition ${
                      isSelected ? "bg-[#FDF1F2] ring-1 ring-[#6A0A1D]/15" : "hover:bg-gray-50"
                    }`}
                    title={displayName}
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100">
                      <Image src={mentee.avatarUrl || AVATAR_FALLBACK} alt={displayName} fill unoptimized className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#241919]">{displayName}</p>
                      <p className="truncate text-[11px] text-gray-400">{secondary}</p>
                    </div>
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#6A0A1D] opacity-0 transition group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Col 2 — Conversations */}
        <aside className="min-h-0 overflow-y-auto rounded-3xl border border-[#6A0A1D]/10 bg-white p-3">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Conversations</h2>

          {isLoading && !conversations.length ? (
            <div className="flex flex-col gap-1">
              {[0, 1, 2, 4].map((i) => <SkeletonConversation key={i} />)}
            </div>
          ) : !conversations.length ? (
            <EmptyConversations />
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conversation) => {
                const active = conversation.id === selectedConversationId;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                      active ? "bg-[#FDF1F2] ring-1 ring-[#6A0A1D]/15" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100">
                      <Image src={conversation.participantAvatar || AVATAR_FALLBACK} alt={conversation.participantName} fill unoptimized className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[#241919]">{conversation.participantName}</p>
                        <span className="shrink-0 text-[11px] text-gray-400">{formatChatTime(conversation.lastMessageAt)}</span>
                      </div>
                      <p className="truncate text-xs text-gray-500">{conversation.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Col 3 — Chat window */}
        <main className="min-h-0 overflow-hidden rounded-3xl border border-[#6A0A1D]/10 bg-white">
          {!selectedConversation ? (
            <EmptyChat />
          ) : (
            <div className="flex h-full flex-col">
              {/* Chat header */}
              <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-100">
                    <Image src={selectedConversation.participantAvatar || AVATAR_FALLBACK} alt={selectedConversation.participantName} fill unoptimized className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#241919]">{selectedConversation.participantName}</h3>
                    <p className="text-[11px] text-gray-400">{messageCountLabel}</p>
                  </div>
                </div>
              </header>

              {/* Messages */}
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
                {isLoading ? (
                  <SkeletonMessages />
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF1F2]">
                      <Send className="h-4 w-4 text-[#6C1221]" />
                    </div>
                    <p className="text-xs font-medium text-gray-500">No messages yet</p>
                    <p className="text-[11px] text-gray-400">Send the first message below.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                        message.isMe
                          ? "bg-[#6A0A1D] text-white rounded-tr-sm"
                          : "bg-gray-100 text-[#241919] rounded-tl-sm"
                      }`}>
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                        <p className={`mt-1 text-[11px] ${message.isMe ? "text-white/60" : "text-gray-400"}`}>
                          {formatChatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose */}
              <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-1.5">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Type a message… (Enter to send)"
                    className="h-9 flex-1 bg-transparent text-sm text-[#241919] placeholder:text-gray-400 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !draft.trim()}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition ${
                      sendSucceeded ? "bg-emerald-600" : "bg-[#6A0A1D] hover:brightness-110"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isSending ? "Sending…" : sendSucceeded ? "Sent ✓" : "Send"}
                    {!isSending && !sendSucceeded && <Send className="h-3.5 w-3.5" />}
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