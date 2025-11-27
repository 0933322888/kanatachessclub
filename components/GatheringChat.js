'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function GatheringChat({ gatheringDate, currentUserId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?gatheringDate=${gatheringDate}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [gatheringDate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gatheringDate,
          content: newMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send message');
        return;
      }

      setNewMessage('');
      // Refresh messages immediately and scroll to bottom
      await fetchMessages();
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setError('An error occurred while sending message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
      <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
        Chat
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-burgundy-light text-white rounded-lg border-2 border-burgundy text-sm">
          {error}
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="bg-white rounded-lg border-2 border-whisky-300 h-64 overflow-y-auto mb-4 p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-center text-whisky-600 py-8">
            <p>No messages yet. Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.user._id.toString() === currentUserId;
            const avatar = message.user.chessComData?.avatar;

            return (
              <div
                key={message._id}
                className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={message.user.firstName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-amber flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-whisky-600 flex items-center justify-center border-2 border-amber flex-shrink-0">
                    <span className="text-xs font-semibold text-amber">
                      {message.user.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] ${isCurrentUser ? 'bg-amber text-white' : 'bg-whisky-100 text-whisky-900'} rounded-lg px-4 py-2`}>
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {message.user.firstName} {message.user.lastName}
                      </p>
                    )}
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-amber-100' : 'text-whisky-600'}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          className="flex-1 px-4 py-2 border-2 border-whisky-300 rounded-md bg-white text-whisky-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="px-6 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

