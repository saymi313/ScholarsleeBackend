import { Bell, Search, CheckCircle2, MessageSquare, Star, LogOut, User, Calendar, Clock, Trash2, X, AlertTriangle, Video, ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { notificationAPI } from "../../../utils/api"
import socketService from "../../../shared/services/socketService"

const TopBar = () => {
  const navigate = useNavigate()
  const { mentorLogout, getFullName, getEmail } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showImageError, setShowImageError] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const dropdownRef = useRef(null)
  const profileMenuRef = useRef(null)
  
  const getInitials = () => {
    const name = getFullName()
    const email = getEmail()
    if (name) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.charAt(0).toUpperCase()
    }
    return email ? email.charAt(0).toUpperCase() : 'U'
  }

  // Get notification icon and styling based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message_received':
        return { icon: MessageSquare, accent: "bg-blue-500/20 text-blue-300" }
      case 'meeting_reminder':
        return { icon: Calendar, accent: "bg-purple-500/20 text-purple-300" }
      case 'meeting_scheduled':
        return { icon: CheckCircle2, accent: "bg-green-500/20 text-green-300" }
      case 'review_received':
        return { icon: Star, accent: "bg-yellow-500/20 text-yellow-300" }
      default:
        return { icon: Bell, accent: "bg-gray-500/20 text-gray-300" }
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  // Load notifications from API
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationAPI.getAll({ 
        status: 'all',
        limit: 20,
        page: 1
      })
      
      if (response.data && response.data.success) {
        setNotifications(response.data.data.notifications || [])
        setUnreadCount(response.data.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount()
      if (response.data && response.data.success) {
        setUnreadCount(response.data.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, status: 'read' })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Delete single notification
  const handleDeleteNotification = async (notificationId, e) => {
    if (e) {
      e.stopPropagation() // Prevent triggering notification click
      e.preventDefault()
    }
    
    // Find the notification to check if it was unread
    const deletedNotification = notifications.find(n => n._id === notificationId)
    const wasUnread = deletedNotification && !deletedNotification.isRead
    
    // Optimistic UI update - remove immediately for better UX
    setNotifications(prev => prev.filter(n => n._id !== notificationId))
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    
    try {
      const response = await notificationAPI.delete(notificationId)
      
      if (!response.data || !response.data.success) {
        console.error('Failed to delete notification:', response.data?.message)
        // Reload notifications if delete failed
        loadNotifications()
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      // Reload notifications if delete failed to restore state
      loadNotifications()
      loadUnreadCount()
    }
  }

  // Delete all notifications
  const handleDeleteAllNotifications = async () => {
    setDeletingAll(true)
    try {
      const response = await notificationAPI.deleteAll()
      
      if (response.data && response.data.success) {
        setNotifications([])
        setUnreadCount(0)
        setShowDeleteAllModal(false)
      } else {
        console.error('Failed to delete all notifications:', response.data?.message)
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error)
    } finally {
      setDeletingAll(false)
    }
  }

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.isRead) {
        await notificationAPI.markAsRead({ notificationIds: [notification._id] })
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true, status: 'read' } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }

      // Handle action URL - check if it's an external link (Google Meet) or internal route
      if (notification.actionUrl) {
        setShowNotifications(false)
        
        // Check if it's an external URL (starts with http:// or https://)
        if (notification.actionUrl.startsWith('http://') || notification.actionUrl.startsWith('https://')) {
          // Open external link (Google Meet) in a new tab
          window.open(notification.actionUrl, '_blank', 'noopener,noreferrer')
        } else {
          // Navigate to internal route
          navigate(notification.actionUrl)
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
    }
  }

  // Load notifications on mount and when dropdown opens
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()

    // Set up socket listener for new notifications
    const handleNewNotification = (data) => {
      if (data.notification) {
        setNotifications(prev => [data.notification, ...prev])
        setUnreadCount(prev => prev + 1)
      }
    }

    // Listen for notification events
    if (socketService.socket) {
      socketService.socket.on('notification:new', handleNewNotification)
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('notification:new', handleNewNotification)
      }
    }
  }, [])

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      loadNotifications()
      loadUnreadCount()
    }
  }, [showNotifications])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', onClickOutside)
    }
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showNotifications, showProfileMenu])

  const handleSignOut = async () => {
    try {
      // Call logout API to invalidate token on server
      await mentorLogout()
    } catch (error) {
      console.error('Error during logout:', error)
      // Continue with logout even if API call fails - clear local storage manually
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      // Always redirect to login page after logout attempt
      // Use window.location.href for full page reload to clear all state
      window.location.href = '/login'
    }
  }
  return (
    <header className="bg-[#111111] border-b border-[#242424] px-4 md:px-6 lg:px-8 py-4 pl-16 lg:pl-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 bg-[#242424] px-2 sm:px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-gray-300">
            <span className="sm:hidden">2 sessions today</span>
            <span className="hidden sm:inline">2 sessions scheduled today</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-1.5 sm:p-2 hover:bg-[#242424] rounded-lg transition-colors"
              aria-label="Notifications"
            >
            <Bell size={18} className="text-gray-300 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            </button>

            {showNotifications && (
              <>
                {/* Mobile backdrop */}
                <div className="fixed inset-0 bg-black/50 sm:hidden z-40" onClick={() => setShowNotifications(false)}></div>
                {/* Panel */}
                <div className="fixed inset-x-0 top-0 w-screen sm:absolute sm:right-0 sm:inset-auto sm:mt-2 sm:w-96 bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {/* Grab handle on mobile */}
                  <div className="sm:hidden flex items-center justify-center pt-2">
                    <div className="h-1.5 w-12 rounded-full bg-white/20" />
                  </div>
                  <div className="bg-gradient-to-r from-[#5D38DE]/20 to-transparent px-3 sm:px-4 py-2 sm:py-3 border-b border-[#2a2a2a]">
                    <div className="relative flex items-center justify-center sm:justify-between">
                      <span className="text-white font-semibold text-sm sm:text-base text-center sm:text-left w-full sm:w-auto">Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="absolute right-3 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 text-xs sm:text-sm text-gray-400 hover:text-white">Close</button>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-56px)] sm:max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">No notifications</div>
                  ) : (
                    notifications.map((notification) => {
                      const { icon: Icon, accent } = getNotificationIcon(notification.type)
                      return (
                        <div
                          key={notification._id}
                          className={`group flex items-start gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#242424] transition-colors ${
                            !notification.isRead ? 'bg-[#242424]/50' : ''
                          }`}
                        >
                          <div 
                            onClick={() => handleNotificationClick(notification)}
                            className="flex-1 flex items-start gap-3 cursor-pointer min-w-0"
                          >
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${accent} flex-shrink-0`}>
                              <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-sm text-white truncate">{notification.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.sentAt)}</p>
                              {/* View button for meeting notifications */}
                              {notification.type === 'meeting_scheduled' && notification.actionUrl && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    // Mark as read if not already read
                                    if (!notification.isRead) {
                                      try {
                                        await notificationAPI.markAsRead({ notificationIds: [notification._id] })
                                        setNotifications(prev => 
                                          prev.map(n => n._id === notification._id ? { ...n, isRead: true, status: 'read' } : n)
                                        )
                                        setUnreadCount(prev => Math.max(0, prev - 1))
                                      } catch (error) {
                                        console.error('Error marking notification as read:', error)
                                      }
                                    }
                                    
                                    // For meeting_scheduled notifications, always redirect to /mentees/bookings
                                    // This handles both new and old notifications in the mentor panel
                                    // (Mentors shouldn't see mentee notifications, but just in case)
                                    let targetUrl = notification.actionUrl
                                    if (notification.type === 'meeting_scheduled') {
                                      // Force redirect to bookings page regardless of actionUrl (handles old notifications)
                                      targetUrl = '/mentees/bookings'
                                    }
                                    
                                    // Handle navigation - external links open in new tab, internal routes navigate
                                    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                                      window.open(targetUrl, '_blank', 'noopener,noreferrer')
                                    } else {
                                      navigate(targetUrl)
                                      setShowNotifications(false)
                                    }
                                  }}
                                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors font-medium text-xs"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>View Meeting</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="mt-1 w-2 h-2 rounded-full bg-[#5D38DE]" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleDeleteNotification(notification._id, e)
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                              }}
                              className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-all text-gray-400 hover:text-red-400 active:text-red-300"
                              title="Delete notification"
                              type="button"
                              aria-label="Delete notification"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[#2a2a2a] bg-[#151515] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowDeleteAllModal(true)}
                        className="text-xs sm:text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
                        title="Delete all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete all</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="p-1.5 sm:p-2 hover:bg-[#242424] rounded-lg transition-colors">
            <Search size={18} className="text-gray-300 sm:w-5 sm:h-5" />
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Profile menu"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#5D38DE] bg-gray-600 flex items-center justify-center cursor-pointer hover:border-[#6d48ee] transition-colors"
            >
              {!showImageError ? (
                <img
                  src="/a.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setShowImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                  {getInitials()}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#2a2a2a]">
                  <p className="text-white text-sm font-medium truncate">{getFullName() || 'Mentor'}</p>
                  <p className="text-gray-400 text-xs truncate">{getEmail() || ''}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/mentor/settings')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-300 hover:bg-[#242424] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete All Notifications Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
              onClick={() => !deletingAll && setShowDeleteAllModal(false)}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] shadow-xl rounded-2xl border border-[#2a2a2a]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete All Notifications</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={() => !deletingAll && setShowDeleteAllModal(false)}
                  disabled={deletingAll}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete all notifications? This action cannot be undone and will permanently remove all {notifications.length} notification{notifications.length !== 1 ? 's' : ''} from your account.
                  </p>
                  
                  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Notification Summary:</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-gray-300">Total Notifications:</span> {notifications.length}</p>
                      <p><span className="text-gray-300">Unread:</span> {unreadCount}</p>
                      <p><span className="text-gray-300">Read:</span> {notifications.length - unreadCount}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteAllModal(false)}
                    disabled={deletingAll}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAllNotifications}
                    disabled={deletingAll}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {deletingAll ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete All
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default TopBar
