'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ initialNotifications, initialUnreadCount }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error clearing notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'pairing_generated':
        return '🎯';
      case 'match_result':
        return '⚔️';
      case 'tournament_started':
        return '🏁';
      case 'tournament_updated':
        return '📝';
      case 'admin_comment':
        return '💬';
      case 'tournament_created':
        return '🏆';
      default:
        return '🔔';
    }
  };

  return (
    <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-whisky-600 text-lg">No notifications yet</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end gap-2 mb-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="px-4 py-2 text-sm bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="px-4 py-2 text-sm bg-whisky-200 text-whisky-800 rounded-md hover:bg-whisky-300 border-2 border-whisky-300 transition-colors font-medium disabled:opacity-50"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  !notification.read
                    ? 'bg-whisky-100 border-amber shadow-md'
                    : 'bg-white border-whisky-300 hover:border-whisky-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-semibold ${
                        !notification.read ? 'text-whisky-900' : 'text-whisky-700'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-amber rounded-full ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-whisky-700 mt-1">
                      {notification.message}
                    </p>
                    {notification.tournament && (
                      <p className="text-xs text-whisky-600 mt-1">
                        Tournament: {notification.tournament.name}
                      </p>
                    )}
                    <p className="text-xs text-whisky-500 mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

