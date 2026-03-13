import React from "react"
import {
  adminDashboardAPI,
  adminManagementAPI,
  adminLogsAPI
} from "../../utils/api"

const STORAGE_KEY = "scholarslee_admin_store_v1"

const defaultState = {
  // Keep other mock data for now as instructed, only clearing Admins and Logs
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
  // Real Data Containers
  admins: [],
  logs: [],
  contactMessages: [
    { id: 'c1', name: 'Ali Raza', email: 'ali@example.com', subject: 'General Inquiry', message: 'I want to know more about mentorship packages.', createdAt: '2025-05-20', status: 'new', response: '' },
    { id: 'c2', name: 'Zara Khan', email: 'zara@example.com', subject: 'Payment Issue', message: 'Card payment failed during checkout.', createdAt: '2025-05-21', status: 'new', response: '' },
  ],
  isLoading: false,
  error: null
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    // Ensure admins and logs are initialized as empty arrays if they were mock data before
    return { ...defaultState, ...parsed, admins: [], logs: [] }
  } catch {
    return defaultState
  }
}

function saveState(state) {
  try {
    // Don't save admins/logs to local storage as they should be fresh
    const { admins, logs, isLoading, error, ...persistedState } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState))
  } catch {
    // ignore
  }
}

const AdminStoreContext = React.createContext(null)

export function AdminStoreProvider({ children }) {
  const [state, setState] = React.useState(() => loadState())

  React.useEffect(() => {
    saveState(state)
  }, [state])

  // Fetch Admins and Logs on mount
  React.useEffect(() => {
    const fetchData = async () => {
      setState(s => ({ ...s, isLoading: true }))
      try {
        const [adminsRes, logsRes] = await Promise.all([
          adminManagementAPI.getAll().catch(e => ({ data: { data: { admins: [] } } })), // Fail gracefully
          adminLogsAPI.getAll({ limit: 50 }).catch(e => ({ data: { data: { logs: [] } } }))
        ])

        if (adminsRes.data?.success) {
          setState(s => ({ ...s, admins: adminsRes.data.data.admins }))
        }
        if (logsRes.data?.success) {
          setState(s => ({ ...s, logs: logsRes.data.data.logs }))
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err)
      } finally {
        setState(s => ({ ...s, isLoading: false }))
      }
    }
    fetchData()
  }, [])

  // Action to add log (for frontend-only actions or optimistic updates)
  // Real logging happens on backend for critical actions
  const addLog = React.useCallback((what, why = "") => {
    // Optionally call backend to log this? 
    // For now, we rely on backend controllers logging important things.
    // Frontend logs might be transient.
  }, [])

  const actions = React.useMemo(() => ({
    // ... Existing actions ...

    // Admins Management
    async createAdmin(data) {
      try {
        const res = await adminManagementAPI.create(data)
        if (res.data?.success) {
          const newAdmin = res.data.data.admin
          setState(s => ({ ...s, admins: [newAdmin, ...s.admins] }))
          // Refresh logs too
          const logsRes = await adminLogsAPI.getAll({ limit: 50 })
          if (logsRes.data?.success) {
            setState(s => ({ ...s, logs: logsRes.data.data.logs }))
          }
          return { success: true }
        }
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "We couldn't create this admin. Please try again." }
      }
    },

    async setAdminStatus(adminId, status) {
      try {
        const res = await adminManagementAPI.updateStatus(adminId, status)
        if (res.data?.success) {
          setState(s => ({
            ...s,
            admins: s.admins.map(a => a._id === adminId ? { ...a, isActive: status === 'active' } : a)
          }))
          // Refresh logs
          const logsRes = await adminLogsAPI.getAll({ limit: 50 })
          if (logsRes.data?.success) {
            setState(s => ({ ...s, logs: logsRes.data.data.logs }))
          }
        }
      } catch (error) {
        console.error("Failed to update admin status", error)
      }
    },

    async deleteAdmin(adminId) {
      try {
        const res = await adminManagementAPI.delete(adminId)
        if (res.data?.success) {
          setState(s => ({
            ...s,
            admins: s.admins.filter(a => a._id !== adminId)
          }))
          // Refresh logs
          const logsRes = await adminLogsAPI.getAll({ limit: 50 })
          if (logsRes.data?.success) {
            setState(s => ({ ...s, logs: logsRes.data.data.logs }))
          }
        }
      } catch (error) {
        console.error("Failed to delete admin", error)
      }
    },

    // Logs management
    clearLogs() {
      // Local clean only since we don't have delete all endpoint yet
      setState((s) => ({ ...s, logs: [] }))
    },

    // Re-implemented actions to map to old interface if needed, or keep them for other mock data
    // Users
    setUserStatus(userId, status) {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)),
      }))
    },
    // ... (Keep other actions primarily as they are for now, as they operate on mock data)
    // For production, these should also be converted to API calls

    // Helper to refresh logs
    async refreshLogs() {
      try {
        const res = await adminLogsAPI.getAll({ limit: 50 })
        if (res.data?.success) {
          setState(s => ({ ...s, logs: res.data.data.logs }))
        }
      } catch (e) { console.error(e) }
    }

  }), [])

  const value = React.useMemo(() => ({ state, actions }), [state, actions])
  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>
}

export function useAdminStore() {
  const ctx = React.useContext(AdminStoreContext)
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider")
  return ctx
}
