import React from "react"

const STORAGE_KEY = "scholarslee_admin_store_v1"

const defaultState = {
  users: [
    { id: "u1", name: "Akbar Husain", email: "akbar@example.com", country: "Pakistan", status: "active", createdAt: "2025-05-21" },
    { id: "u2", name: "Sara Khan", email: "sara@example.com", country: "Pakistan", status: "inactive", createdAt: "2025-05-18" },
    { id: "u3", name: "John Lee", email: "john@example.com", country: "USA", status: "active", createdAt: "2025-05-16" },
  ],
  mentors: [
    { id: "m1", name: "Maxwell", email: "maxwell@mentor.com", country: "Pakistan", verify: "KYC Pending", rating: "4.8", status: "pending", paused: false, badges: ["Rising Star"] },
    { id: "m2", name: "Soban Ahsan", email: "soban@mentor.com", country: "Pakistan", verify: "Verified", rating: "4.9", status: "approved", paused: false, badges: ["Top Seller", "Verified"] },
    { id: "m3", name: "Syed Ali", email: "syed@mentor.com", country: "Pakistan", verify: "Verified", rating: "4.6", status: "approved", paused: false, badges: ["Pro"] },
    { id: "m4", name: "Ayesha Noor", email: "ayesha@mentor.com", country: "USA", verify: "KYC Pending", rating: "4.5", status: "pending", paused: false, badges: [] },
    { id: "m5", name: "John Lee", email: "john@mentor.com", country: "Canada", verify: "KYC Pending", rating: "4.2", status: "pending", paused: false, badges: [] },
  ],
  services: [
    { id: "sv1", title: "SOP Review", mentor: "Soban Ahsan", category: "Documents", rating: "5.0", status: "pending", createdAt: "2025-05-19" },
    { id: "sv2", title: "Interview Prep", mentor: "Syed Ali", category: "Career", rating: "4.7", status: "approved", createdAt: "2025-05-12" },
  ],
  sessions: [
    { id: "S-10231", mentor: "Maxwell", mentee: "Huzaifa", topic: "SOP Review", datetime: "2025-05-25 18:30", status: "scheduled" },
    { id: "S-10210", mentor: "Syed Ali", mentee: "Saim", topic: "Interview Prep", datetime: "2025-05-21 20:00", status: "completed" },
  ],
  reviews: [
    { id: "r1", service: "SOP Review", mentor: "Soban", mentee: "Huzaifa", rating: 5, review: "Great help!", status: "visible", featured: false, flagged: false, response: "" },
    { id: "r2", service: "Interview Prep", mentor: "Syed", mentee: "Saim", rating: 3, review: "Average", status: "hidden", featured: false, flagged: false, response: "" },
  ],
  transactions: [
    { id: "T-9821", user: "Akbar", amount: "$120", method: "Card", status: "paid", createdAt: "2025-05-18" },
    { id: "T-9822", user: "Saim", amount: "$60", method: "Card", status: "refunded", createdAt: "2025-05-19" },
  ],
  payouts: [
    { id: "p1", mentor: "Soban", balance: "$1,230", status: "pending" },
    { id: "p2", mentor: "Syed", balance: "$830", status: "pending" },
  ],
  notifications: {
    history: [
      { id: "N-92", segment: "All Mentors", channel: "Email", subject: "New Feature: Badges", sentAt: "2025-05-19" },
      { id: "N-93", segment: "All Users", channel: "In-App", subject: "Maintenance Window", sentAt: "2025-05-18" },
    ],
  },
  settings: {
    categories: ["Documents", "Career"],
    flags: { enableMentorVerification: true, enablePayouts: true },
  },
  admins: [
    { id: "a1", name: "Super Admin", email: "root@scholarslee.app", role: "SuperAdmin", status: "active" },
    { id: "a2", name: "Finance Ops", email: "finance@scholarslee.app", role: "Finance", status: "active" },
  ],
  logs: [
    { id: "lg1", who: "root@scholarslee.app", what: "Approved mentor Maxwell", when: "2025-05-19 14:31", why: "Meets criteria" },
    { id: "lg2", who: "finance@scholarslee.app", what: "Approved payout to Soban", when: "2025-05-18 12:10", why: "Weekly batch" },
  ],
  contactMessages: [
    { id: 'c1', name: 'Ali Raza', email: 'ali@example.com', subject: 'General Inquiry', message: 'I want to know more about mentorship packages.', createdAt: '2025-05-20', status: 'new', response: '' },
    { id: 'c2', name: 'Zara Khan', email: 'zara@example.com', subject: 'Payment Issue', message: 'Card payment failed during checkout.', createdAt: '2025-05-21', status: 'new', response: '' },
  ],
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const AdminStoreContext = React.createContext(null)

export function AdminStoreProvider({ children }) {
  const [state, setState] = React.useState(() => {
    const loadedState = loadState()
    // Auto-cleanup old logs on initialization
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const filteredLogs = loadedState.logs.filter(log => {
      const logDate = new Date(log.when)
      return logDate > sevenDaysAgo
    })
    
    return { ...loadedState, logs: filteredLogs }
  })

  React.useEffect(() => {
    saveState(state)
  }, [state])

  // Ensure demo pending mentors exist for the Sign-up Requests table if localStorage state has none
  React.useEffect(() => {
    const hasPending = (state.mentors || []).some((m) => m.status === 'pending')
    if (!hasPending) {
      const demoPending = defaultState.mentors.filter((m) => m.status === 'pending')
      if (demoPending.length > 0) {
        setState((s) => ({ ...s, mentors: [...demoPending, ...s.mentors] }))
      }
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addLog = React.useCallback((what, why = "") => {
    const entry = {
      id: `lg_${Date.now()}`,
      who: "admin@local",
      what,
      why,
      when: new Date().toISOString().replace("T", " ").slice(0, 16),
    }
    setState((s) => ({ ...s, logs: [entry, ...s.logs] }))
  }, [])

  const actions = React.useMemo(() => ({
    // Users
    setUserStatus(userId, status) {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)),
      }))
      addLog(`Set user ${userId} status to ${status}`)
    },

    // Mentors
    setMentorStatus(mentorId, status) {
      setState((s) => ({
        ...s,
        mentors: s.mentors.map((m) => (m.id === mentorId ? { ...m, status } : m)),
      }))
      addLog(`Set mentor ${mentorId} status to ${status}`)
    },
    setMentorPaused(mentorId, paused) {
      setState((s) => ({
        ...s,
        mentors: s.mentors.map((m) => (m.id === mentorId ? { ...m, paused } : m)),
      }))
      addLog(`${paused ? 'Paused' : 'Unpaused'} mentor ${mentorId}`)
    },
    setMentorVerify(mentorId, verify) {
      setState((s) => ({
        ...s,
        mentors: s.mentors.map((m) => (m.id === mentorId ? { ...m, verify } : m)),
      }))
      addLog(`Updated mentor ${mentorId} verification to ${verify}`)
    },
    requestServices(mentorId, note) {
      // Frontend-only: log the request so it appears in Logs
      addLog(`Requested services from mentor ${mentorId}`, note || "")
    },

    // Services
    setServiceStatus(serviceId, status) {
      setState((s) => ({
        ...s,
        services: s.services.map((sv) => (sv.id === serviceId ? { ...sv, status } : sv)),
      }))
      addLog(`Set service ${serviceId} status to ${status}`)
    },

    // Reviews
    hideReview(reviewId) {
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, status: "hidden" } : r)),
      }))
      addLog(`Hid review ${reviewId}`)
    },
    unhideReview(reviewId) {
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, status: "visible" } : r)),
      }))
      addLog(`Unhid review ${reviewId}`)
    },
    removeReview(reviewId) {
      setState((s) => ({ ...s, reviews: s.reviews.filter((r) => r.id !== reviewId) }))
      addLog(`Removed review ${reviewId}`)
    },
    toggleReviewFeatured(reviewId) {
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, featured: !r.featured } : r)),
      }))
      addLog(`Toggled featured on review ${reviewId}`)
    },
    setReviewResponse(reviewId, response) {
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, response } : r)),
      }))
      addLog(`Responded to review ${reviewId}`)
    },
    setReviewFlagged(reviewId, flagged) {
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, flagged } : r)),
      }))
      addLog(`${flagged ? 'Flagged' : 'Unflagged'} review ${reviewId}`)
    },

    // Payments
    approvePayout(payoutId) {
      setState((s) => ({
        ...s,
        payouts: s.payouts.map((p) => (p.id === payoutId ? { ...p, status: "approved" } : p)),
      }))
      addLog(`Approved payout ${payoutId}`)
    },

    // Disputes
    assignDispute(disputeId, assignee) {
      setState((s) => ({
        ...s,
        disputes: s.disputes.map((d) => (d.id === disputeId ? { ...d, assignee } : d)),
      }))
      addLog(`Assigned dispute ${disputeId} to ${assignee}`)
    },
    closeDispute(disputeId) {
      setState((s) => ({
        ...s,
        disputes: s.disputes.map((d) => (d.id === disputeId ? { ...d, status: "closed" } : d)),
      }))
      addLog(`Closed dispute ${disputeId}`)
    },

    // Notifications
    sendNotification({ segment, channel, subject }) {
      const entry = {
        id: `N-${Math.floor(Math.random() * 10000)}`,
        segment,
        channel,
        subject,
        sentAt: new Date().toISOString().slice(0, 10),
      }
      setState((s) => ({
        ...s,
        notifications: { ...s.notifications, history: [entry, ...s.notifications.history] },
      }))
      addLog(`Sent ${channel} notification to ${segment}: ${subject}`)
    },

    // Settings
    addCategory(name) {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, categories: [...s.settings.categories, name] },
      }))
      addLog(`Added category ${name}`)
    },
    removeCategory(name) {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, categories: s.settings.categories.filter((c) => c !== name) },
      }))
      addLog(`Removed category ${name}`)
    },
    toggleFlag(flagKey, value) {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, flags: { ...s.settings.flags, [flagKey]: value } },
      }))
      addLog(`Set flag ${flagKey} to ${value}`)
    },

    // Admins
    setAdminStatus(adminId, status) {
      setState((s) => ({
        ...s,
        admins: s.admins.map((a) => (a.id === adminId ? { ...a, status } : a)),
      }))
      addLog(`Set admin ${adminId} status to ${status}`)
    },

    // Sessions
    setSessionStatus(sessionId, status) {
      setState((s) => ({
        ...s,
        sessions: s.sessions.map((ss) => (ss.id === sessionId ? { ...ss, status } : ss)),
      }))
      addLog(`Set session ${sessionId} status to ${status}`)
    },

    // Contact messages
    respondToContact(contactId, response) {
      setState((s) => ({
        ...s,
        contactMessages: s.contactMessages.map((m) => (m.id === contactId ? { ...m, status: 'responded', response } : m)),
      }))
      addLog(`Responded to contact ${contactId}`)
    },
    markContactStatus(contactId, status) {
      setState((s) => ({
        ...s,
        contactMessages: s.contactMessages.map((m) => (m.id === contactId ? { ...m, status } : m)),
      }))
      addLog(`Set contact ${contactId} to ${status}`)
    },

    // Logs management
    clearLogs() {
      setState((s) => ({ ...s, logs: [] }))
    },

    // Auto-cleanup old logs (7 days)
    cleanupOldLogs() {
      setState((s) => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const filteredLogs = s.logs.filter(log => {
          const logDate = new Date(log.when)
          return logDate > sevenDaysAgo
        })
        
        return { ...s, logs: filteredLogs }
      })
    },
  }), [addLog])

  const value = React.useMemo(() => ({ state, actions }), [state, actions])
  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>
}

export function useAdminStore() {
  const ctx = React.useContext(AdminStoreContext)
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider")
  return ctx
}


