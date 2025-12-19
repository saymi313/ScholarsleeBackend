import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, Archive, Trash2, Clock, AlertCircle, CheckCircle, Info, Star, Video, ExternalLink } from 'lucide-react';
import { notificationAPI } from '../../utils/api';

const NotificationCenter = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isOpen, filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll({ 
        status: filter === 'all' ? 'all' : filter,
        limit: 50 
      });
      
      if (response.data && response.data.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      if (response.data && response.data.success) {
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await notificationAPI.markAsRead({ notificationIds });
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) 
            ? { ...notif, isRead: true, status: 'read' }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, status: 'read' }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const archiveNotifications = async (notificationIds) => {
    try {
      await notificationAPI.archive({ notificationIds });
      setNotifications(prev => 
        prev.filter(notif => !notificationIds.includes(notif._id))
      );
    } catch (error) {
      console.error('Error archiving notifications:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      'booking_created': <CheckCircle className="w-5 h-5 text-green-500" />,
      'booking_confirmed': <CheckCircle className="w-5 h-5 text-blue-500" />,
      'booking_cancelled': <X className="w-5 h-5 text-red-500" />,
      'meeting_scheduled': <Clock className="w-5 h-5 text-purple-500" />,
      'meeting_reminder': <Clock className="w-5 h-5 text-orange-500" />,
      'meeting_started': <AlertCircle className="w-5 h-5 text-green-500" />,
      'meeting_ended': <CheckCircle className="w-5 h-5 text-gray-500" />,
      'payment_successful': <CheckCircle className="w-5 h-5 text-green-500" />,
      'payment_failed': <X className="w-5 h-5 text-red-500" />,
      'review_received': <Star className="w-5 h-5 text-yellow-500" />,
      'message_received': <Info className="w-5 h-5 text-blue-500" />,
      'system_announcement': <Info className="w-5 h-5 text-blue-500" />,
      'mentor_verification': <CheckCircle className="w-5 h-5 text-green-500" />,
      'service_approved': <CheckCircle className="w-5 h-5 text-green-500" />,
      'service_rejected': <X className="w-5 h-5 text-red-500" />
    };
    return iconMap[type] || <Info className="w-5 h-5 text-gray-500" />;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      'low': 'border-l-gray-300',
      'medium': 'border-l-blue-500',
      'high': 'border-l-orange-500',
      'urgent': 'border-l-red-500'
    };
    return colorMap[priority] || 'border-l-gray-300';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex border-b border-gray-200 px-6 py-3">
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    filter === filterType
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {notification.timeAgo}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead([notification._id])}
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => archiveNotifications([notification._id])}
                              className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* View button for meeting notifications - redirects to meetings page */}
                        {notification.actionUrl && (
                          <div className="mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                // Mark as read
                                if (!notification.isRead) {
                                  markAsRead([notification._id]);
                                }
                                
                                // For meeting_scheduled notifications, always redirect to /mentees/bookings
                                // This handles both new and old notifications
                                let targetUrl = notification.actionUrl;
                                if (notification.type === 'meeting_scheduled') {
                                  // Force redirect to bookings page regardless of actionUrl (handles old notifications)
                                  targetUrl = '/mentees/bookings';
                                }
                                
                                // Handle external vs internal URLs
                                if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                                  // Open external link in a new tab
                                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                                  onClose?.(); // Close notification center if provided
                                } else {
                                  // Navigate to internal route
                                  navigate(targetUrl);
                                  onClose?.(); // Close notification center if provided
                                }
                              }}
                              className={`${
                                notification.type === 'meeting_scheduled' 
                                  ? 'w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors font-medium text-sm'
                                  : 'text-sm text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer'
                              }`}
                            >
                              {notification.type === 'meeting_scheduled' && (
                                <>
                                  <Video className="w-4 h-4" />
                                </>
                              )}
                              <span>{notification.type === 'meeting_scheduled' ? 'View Meeting' : (notification.actionText || 'View Details')}</span>
                              {notification.type === 'meeting_scheduled' && (
                                <ExternalLink className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
