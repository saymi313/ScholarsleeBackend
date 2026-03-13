"use client"
import React, { useState, useRef, useEffect } from "react"
import { Info, Video, Phone, MoreVertical, Pin, VolumeX, Shield, PinOff, Volume2, Archive, Trash2, ArchiveRestore, ArrowLeft } from "lucide-react"
import MenteeProfileModal from "./MenteeProfileModal"
import NameAvatar from "./NameAvatar"

export default function ChatHeader({ chat, onBack, onVideoCall, onVoiceCall, onInfo, onPinToggle, onMuteToggle, onBlockToggle, onArchiveToggle, onClearChat }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isPinned, setIsPinned] = useState(chat.isPinned || false)
  const [isMuted, setIsMuted] = useState(chat.isMuted || false)
  const [isBlocked, setIsBlocked] = useState(chat.isBlocked || false)
  const [isArchived, setIsArchived] = useState(chat.isArchived || false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePinToggle = () => {
    const newPinnedState = !isPinned
    setIsPinned(newPinnedState)
    setShowDropdown(false)
    onPinToggle?.(chat.id, newPinnedState)
  }

  const handleMuteToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setShowDropdown(false)
    onMuteToggle?.(chat.id, newMutedState)
  }

  const handleBlockToggle = () => {
    const newBlockedState = !isBlocked
    setIsBlocked(newBlockedState)
    setShowDropdown(false)
    onBlockToggle?.(chat.id, newBlockedState)
  }

  const handleArchiveToggle = () => {
    const newArchivedState = !isArchived
    setIsArchived(newArchivedState)
    setShowDropdown(false)
    onArchiveToggle?.(chat.id, newArchivedState)
  }

  const handleClearChat = () => {
    setShowClearConfirm(true)
    setShowDropdown(false)
  }

  const confirmClearChat = () => {
    onClearChat?.(chat.id)
    setShowClearConfirm(false)
  }

  const cancelClearChat = () => {
    setShowClearConfirm(false)
  }
  return (
    <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Back button for mobile */}
          <button
            onClick={onBack}
            className="md:hidden w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div className="relative">
            <NameAvatar src={chat.avatar} name={chat.name} size="w-10 h-10 md:w-12 md:h-12" />
            {/* Status indicators */}
            {isPinned && (
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-orange-400 rounded-full flex items-center justify-center">
                <Pin className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" />
              </div>
            )}
            {isMuted && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-400 rounded-full flex items-center justify-center">
                <VolumeX className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-white font-semibold text-base md:text-lg truncate hover:text-[#5D38DE] transition-colors cursor-pointer text-left"
              >
                {chat.name}
              </button>
              {isBlocked && (
                <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
              )}
              {isArchived && (
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
              )}
            </div>
            <p className="text-gray-400 text-xs md:text-sm truncate">
              {isBlocked ? "Blocked" : isMuted ? "Muted" : "Last seen 1 hour ago"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {/* Hide some buttons on very small screens */}
          <button
            onClick={onVideoCall}
            className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          >
            <Video className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </button>
          <button
            onClick={onVoiceCall}
            className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </button>
          <button
            onClick={onInfo}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          >
            <Info className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </button>
          {/* More Options Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
            >
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-12 w-44 md:w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                {/* Pin Chat Option */}
                <button
                  onClick={handlePinToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#333333] transition-colors first:rounded-t-lg"
                >
                  {isPinned ? (
                    <PinOff className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Pin className="w-4 h-4 text-orange-400" />
                  )}
                  <span className="text-white text-sm">
                    {isPinned ? "Unpin Chat" : "Pin Chat"}
                  </span>
                </button>

                {/* Mute Chat Option */}
                <button
                  onClick={handleMuteToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#333333] transition-colors"
                >
                  {isMuted ? (
                    <Volume2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-white text-sm">
                    {isMuted ? "Unmute Chat" : "Mute Chat"}
                  </span>
                </button>

                {/* Archive Chat Option */}
                <button
                  onClick={handleArchiveToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#333333] transition-colors"
                >
                  {isArchived ? (
                    <ArchiveRestore className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Archive className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-white text-sm">
                    {isArchived ? "Unarchive Chat" : "Archive Chat"}
                  </span>
                </button>

                {/* Block Option */}
                <button
                  onClick={handleBlockToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#333333] transition-colors"
                >
                  <Shield className={`w-4 h-4 ${isBlocked ? "text-green-400" : "text-red-400"}`} />
                  <span className="text-white text-sm">
                    {isBlocked ? "Unblock" : "Block"}
                  </span>
                </button>

                {/* Clear Chat Option */}
                <button
                  onClick={handleClearChat}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#333333] transition-colors last:rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span className="text-white text-sm">Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] rounded-2xl p-4 md:p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base md:text-lg">Clear Chat</h3>
                <p className="text-gray-400 text-xs md:text-sm">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Are you sure you want to clear all messages in this chat? This action will permanently delete all messages and cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={cancelClearChat}
                className="flex-1 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentee Profile Modal */}
      {showProfileModal && (
        <MenteeProfileModal
          menteeId={chat.participantId}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  )
}
