"use client"

// Simple title bar with menu button (mobile)
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"

export default function AdminHeader({ title, onMenu }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const displayName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : "Admin User"

  return (
    <header className="sticky top-0 z-30 bg-[#0e0e10]/80 backdrop-blur border-b border-white/10">
      <div className="h-16 flex items-center gap-3 px-4 md:px-8">
        <button
          onClick={onMenu}
          className="md:hidden rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <p className="hidden md:block text-sm md:text-base text-white/80">Welcome, <span className="font-semibold text-white">{displayName}</span></p>
          <button onClick={() => navigate('/admin/notifications')} className="rounded-md bg-[#5D38DE] px-4 py-2 text-sm font-medium hover:opacity-90">
            New Announcement
          </button>
          <button onClick={handleLogout} className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors" title="Sign Out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
