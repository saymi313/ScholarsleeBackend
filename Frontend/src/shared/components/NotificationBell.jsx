import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationAPI } from '../../utils/api';
import NotificationCenter from './NotificationCenter';
import socketService from '../services/socketService';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
    } else {
      setLoading(false);
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }
    
    let interval;
    let unsubscribe;

    if (isAuthenticated) {
      // Set up polling for unread count (fallback)
      interval = setInterval(loadUnreadCount, 60000); // Check every 60 seconds

      // Listen for new notifications via socket
      unsubscribe = socketService.on('notification:new', (data) => {
        console.log('🔔 New notification received:', data);
        // Increment unread count
        setUnreadCount(prev => prev + 1);

        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.notification.title, {
            body: data.notification.message,
            icon: '/logo.png',
            tag: 'chat-notification'
          });
        }
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      if (response.data && response.data.success) {
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Refresh unread count when closing (only if authenticated)
    if (isAuthenticated) {
      loadUnreadCount();
    }
  };

  return (
    <>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {!loading && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {loading && (
          <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
            ...
          </span>
        )}
      </button>

      <NotificationCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default NotificationBell;
