"use client"
import { NavLink } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

const links = [
  { href: "/admin/admins", label: "Admins & Roles" },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/mentors", label: "Mentors" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/users", label: "Users" },
]

export default function AdminSidebar({ open, onClose }) {
  const { user } = useAuth()
  const [pendingPayouts, setPendingPayouts] = useState(0)

  const allowedLinks = useMemo(() => {
    if (!user) return []

    // Super Admin Bypass (Hardcoded for safety as requested)
    if (user.email === 'usmanawan@gmail.com') return links;

    // If no permissions array (legacy admin), allow all
    if (!user.permissions || user.permissions.length === 0) return links;

    // Filter based on permissions
    return links.filter(link => user.permissions.includes(link.label));
  }, [user])

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await adminDashboardAPI.getMetrics()
        if (response.data?.success) {
          setPendingPayouts(response.data.data.payoutsPending || 0)
        }
      } catch (err) {
        console.error("Failed to fetch pending payouts count", err)
      }
    }

    fetchPendingCount()
    const interval = setInterval(fetchPendingCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside
      className={`z-40 bg-[#121214] border-r border-white/10 w-72 shrink-0 h-screen fixed md:sticky md:top-0 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
    >
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="text-xl font-semibold">Admin Panel</span>
        <button onClick={onClose} className="ml-auto md:hidden rounded-md px-3 py-1.5 bg-white/5 hover:bg-white/10">
          Close
        </button>
      </div>
      <nav className="py-4 h-[calc(100vh-4rem)] overflow-y-auto">
        <ul className="space-y-2 px-3">
          {[...allowedLinks].sort((a, b) => a.label.localeCompare(b.label)).map((l) => (
            <li key={l.href}>
              <NavLink
                to={l.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm relative ${isActive ? "bg-[#5D38DE]/20 text-white" : "text-white/80 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <span className="shrink-0 text-white/80">{getIcon(l.label)}</span>
                <span className="truncate flex-1">{l.label}</span>
                {l.label === "Payouts" && pendingPayouts > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-rose-500/20">
                    {pendingPayouts}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function getIcon(label) {
  switch (label) {
    case "Dashboard":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h8V3H3v9zm0 9h8v-7H3v7zm10 0h8V12h-8v9zm0-18v7h8V3h-8z" fill="currentColor" />
        </svg>
      )
    case "Users":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM8 12C5.243 12 3 14.243 3 17v4h10v-4c0-2.757-2.243-5-5-5z" fill="currentColor" />
        </svg>
      )
    case "Mentors":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" fill="currentColor" />
        </svg>
      )
    case "Services":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v4h8V3h-8z" fill="currentColor" />
        </svg>
      )
    case "Sessions":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10h5V3H7v7zm0 11h5v-9H7v9zm7 0h5v-5h-5v5zm0-17v5h5V4h-5z" fill="currentColor" />
        </svg>
      )
    case "Reviews":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="currentColor" />
        </svg>
      )
    case "Payments":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 7h20v10H2V7zm2 4h6v2H4v-2zM2 5h20V3H2v2z" fill="currentColor" />
        </svg>
      )
    case "Payouts":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "Notifications":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v7L4 18v1h16v-1l-2-2z" fill="currentColor" />
        </svg>
      )
    case "Settings":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14 12.936a7.963 7.963 0 000-1.873l2.036-1.58-1.928-3.338-2.4.97a7.994 7.994 0 00-1.622-.94l-.366-2.54h-3.856l-.366 2.54a7.994 7.994 0 00-1.622.94l-2.4-.97L2.824 9.483l2.036 1.58a7.963 7.963 0 000 1.873l-2.036 1.58 1.928 3.338 2.4-.97c.5.39 1.045.71 1.622.94l.366 2.54h3.856l.366-2.54c.577-.23 1.122-.55 1.622-.94l2.4.97 1.928-3.338-2.036-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" fill="currentColor" />
        </svg>
      )
    case "Admins & Roles":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11a4 4 0 100-8 4 4 0 000 8zM8 12a4 4 0 100-8 4 4 0 000 8zm8 2c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4zM8 14c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" fill="currentColor" />
        </svg>
      )
    case "Logs":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" fill="currentColor" />
        </svg>
      )
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      )
  }
}
