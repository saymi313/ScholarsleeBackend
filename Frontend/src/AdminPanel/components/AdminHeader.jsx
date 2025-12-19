"use client"

// Simple title bar with menu button (mobile)
import { useNavigate } from "react-router-dom"

export default function AdminHeader({ title, onMenu }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 bg-[#0e0e10]/80 backdrop-blur border-b border-white/10">
      <div className="h-16 flex items-center gap-3 px-4 md:px-8">
        <button
          onClick={onMenu}
          className="md:hidden rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white"
          aria-label="Open sidebar"
        >
          Menu
        </button>
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <p className="text-sm md:text-base text-white/80">Welcome, <span className="font-semibold text-white">Usman Awan</span></p>
          <button onClick={() => navigate('/admin/notifications')} className="rounded-md bg-[#5D38DE] px-3 py-2 text-sm font-medium hover:opacity-90">
            New Announcement
          </button>
        </div>
      </div>
    </header>
  )
}
