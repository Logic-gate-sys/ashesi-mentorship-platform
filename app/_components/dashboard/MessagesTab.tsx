'use client';

import React, { useState } from 'react';
import { Phone, Video, Mic, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'other';
  content: string;
  timestamp: string;
  avatar?: string;
}

interface MessagesTabProps {
  userName?: string;
  userTitle?: string;
  userAvatar?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

export default function MessagesTab({
  userName = 'Alex O.',
  userTitle = 'Product Manager at Microsoft',
  userAvatar,
  messages = [],
  onSendMessage,
}: MessagesTabProps) {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    onSendMessage?.(messageInput);
    setMessageInput('');
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-chat-bg rounded-lg overflow-hidden shadow-primary">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm border-b border-border-light px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-text">{userName}</h3>
                <p className="text-sm text-text-secondary">{userTitle}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-text" />
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-text" />
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
                <Mic className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white bg-opacity-40 text-text rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-white text-opacity-70' : 'text-text-secondary'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-border-light bg-white bg-opacity-10 backdrop-blur-sm px-6 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              className="flex-1 bg-white bg-opacity-70 border border-border rounded-lg px-4 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="bg-primary hover:bg-primary-dark disabled:bg-text-muted text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Metrics */}
      <div className="w-80 bg-impact-bg border-l border-border px-6 py-4 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-text mb-4">Your Impact</h4>
            <div className="space-y-3">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <p className="text-sm text-text-secondary">Sessions Completed</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <p className="text-sm text-text-secondary">Average Rating</p>
                <p className="text-2xl font-bold text-primary">4.8/5</p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <p className="text-sm text-text-secondary">Mentees Helped</p>
                <p className="text-2xl font-bold text-primary">8</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-3">Top Mentoring Areas</h4>
            <div className="flex flex-wrap gap-2">
              {['Career Growth', 'Technical Skills', 'Leadership', 'Communication'].map((area) => (
                <span
                  key={area}
                  className="bg-accent text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
            <p className="text-sm text-text italic">
              "The best way to predict the future is to invent it." - Alan Kay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
