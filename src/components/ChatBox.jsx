import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatBox = ({ messages, currentUserId, onSendMessage }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="glass-panel rounded-3xl h-[500px] flex flex-col justify-between overflow-hidden border border-dark-border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-card/30 flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-brand rounded-full animate-ping"></div>
        <h4 className="font-semibold text-sm text-white">Live Support / Customer Chat</h4>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-dark-muted font-mono text-xs">
            <span>No messages. Say hello to start the chat!</span>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={msg.sender?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-dark-border"
                  />
                  <div>
                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-brand text-black font-semibold rounded-tr-none'
                        : 'bg-dark-cardMuted border border-dark-border text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-dark-muted font-mono mt-1 block px-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-dark-border bg-dark-card/30 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl focus:border-brand/40 text-white text-xs outline-none transition-all placeholder:text-dark-muted"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-brand hover:bg-brand-dark text-black rounded-xl flex items-center justify-center transition-colors shadow-glow-green/10"
        >
          <FiSend className="text-sm" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
