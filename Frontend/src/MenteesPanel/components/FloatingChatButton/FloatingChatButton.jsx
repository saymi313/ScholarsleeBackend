import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useUnreadChats } from '../../../shared/hooks/useUnreadChats'
import NameAvatar from '../../../shared/components/NameAvatar'
import './FloatingChatButton.css'

export default function FloatingChatButton() {
    const { isAuthenticated, user } = useAuth()
    const { unreadChats, totalUnread } = useUnreadChats()
    const [isOpen, setIsOpen] = useState(false)
    const [justUpdated, setJustUpdated] = useState(false)
    const popupRef = useRef(null)
    const buttonRef = useRef(null)
    const prevTotalRef = useRef(totalUnread)
    const navigate = useNavigate()
    const location = useLocation()

    const isOnChatsPage = location.pathname.startsWith('/mentees/chats')

    // Trigger bounce when new messages arrive
    useEffect(() => {
        if (totalUnread > prevTotalRef.current) {
            setJustUpdated(true)
            const timer = setTimeout(() => setJustUpdated(false), 1000)
            return () => clearTimeout(timer)
        }
        prevTotalRef.current = totalUnread
    }, [totalUnread])

    // Close popup on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isOpen &&
                popupRef.current && !popupRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Close popup on route change
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    if (!isAuthenticated || isOnChatsPage || user?.role !== 'mentee') return null

    const handleChatClick = (chat) => {
        setIsOpen(false)
        navigate(`/mentees/chats?chat=${chat.participantSlug}`)
    }

    const handleFabClick = () => {
        if (totalUnread === 0) {
            navigate('/mentees/chats')
            return
        }
        setIsOpen(!isOpen)
    }

    // Inline styles as ultimate fallback to guarantee fixed positioning
    const containerStyle = {
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'auto',
    }

    return createPortal(
        <div className="fcb-root" style={containerStyle}>
            {/* Popup */}
            {isOpen && unreadChats.length > 0 && (
                <div className="fcb-popup" ref={popupRef}>
                    <div className="fcb-popup-header">
                        <span className="fcb-popup-title">💬 New Messages</span>
                        <button className="fcb-popup-close" onClick={() => setIsOpen(false)} aria-label="Close">
                            <X size={14} />
                        </button>
                    </div>
                    <div className="fcb-popup-list">
                        {unreadChats.map((chat) => (
                            <button
                                key={chat.conversationId}
                                className="fcb-popup-item"
                                onClick={() => handleChatClick(chat)}
                            >
                                <div className="fcb-popup-avatar">
                                    <NameAvatar
                                        src={chat.participantAvatar}
                                        name={chat.participantName}
                                        size="w-9 h-9"
                                    />
                                </div>
                                <div className="fcb-popup-info">
                                    <span className="fcb-popup-name">{chat.participantName}</span>
                                    <span className="fcb-popup-msg-count">
                                        {chat.unreadCount} new {chat.unreadCount === 1 ? 'message' : 'messages'}
                                    </span>
                                </div>
                                <span className="fcb-popup-badge">{chat.unreadCount}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                ref={buttonRef}
                className={`fcb-fab ${totalUnread > 0 ? 'fcb-has-unread' : ''} ${justUpdated ? 'fcb-bounce' : ''}`}
                onClick={handleFabClick}
                aria-label={totalUnread > 0 ? `${totalUnread} unread messages` : 'Open chats'}
            >
                <span className="fcb-icon-wrap">
                    <MessageCircle size={26} strokeWidth={2} />
                </span>
                {totalUnread > 0 && (
                    <span className="fcb-badge">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                )}
            </button>
        </div>,
        document.body
    )
}
