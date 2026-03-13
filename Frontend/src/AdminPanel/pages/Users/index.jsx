"use client"

import { useState, useEffect, useMemo } from "react"
import DataTable from "../../components/DataTable"
import { adminUsersAPI } from "../../../utils/api"
import { useToast } from "../../../context/ToastContext"
import { Loader2, X, User as UserIcon, Mail, Phone, MapPin, Clock, DollarSign, Calendar, CheckCircle, XCircle, Eye } from "lucide-react"

export default function UsersPage() {
  const { showError } = useToast()
  const [country, setCountry] = useState("all")
  const [status, setStatus] = useState("all")
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "country", header: "Country" },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-md text-xs ${v === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/80"}`}
        >
          {v}
        </span>
      ),
    },
    { key: "createdAt", header: "Created" },
    {
      key: "actions",
      header: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewUser(r.id)}
            className="px-2 py-1 rounded bg-[#5D38DE]/20 hover:bg-[#5D38DE]/30 text-[#5D38DE] text-xs flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={() => handleToggleStatus(r.id, r.status === "active" ? false : true)}
            disabled={actionLoading === r.id}
            className="px-2 py-1 rounded bg-rose-500/15 text-rose-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : (r.status === "active" ? "Deactivate" : "Activate")}
          </button>
        </div>
      ),
    },
  ]

  // Fetch users and countries
  useEffect(() => {
    fetchUsers()
    fetchCountries()
  }, [country, status])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await adminUsersAPI.getAllUsers({ country, status })

      if (response.data?.success) {
        setUsers(response.data.data.users || [])
      } else {
        setError(response.data?.message || "We couldn't load users. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err.response?.data?.message || err.message || "We couldn't load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await adminUsersAPI.getUsersByCountry()
      if (response.data?.success) {
        const countryList = response.data.data?.data || []
        setCountries(countryList.map(c => c.country).filter(Boolean))
      }
    } catch (err) {
      console.error("Error fetching countries:", err)
    }
  }

  const handleViewUser = async (userId) => {
    try {
      setDetailsLoading(true)
      const response = await adminUsersAPI.getUserById(userId)
      if (response.data?.success) {
        setUserDetails(response.data.data.user)
        setSelectedUser(userId)
      } else {
        showError(response.data?.message || "We couldn't load user details. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching user details:", err)
      showError(err.response?.data?.message || err.message || "We couldn't load user details. Please try again.")
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleToggleStatus = async (userId, isActive) => {
    try {
      setActionLoading(userId)
      const response = await adminUsersAPI.updateUserStatus(userId, isActive)
      if (response.data?.success) {
        // Refresh users list
        await fetchUsers()
      } else {
        showError(response.data?.message || "We couldn't update user status. Please try again.")
      }
    } catch (err) {
      console.error("Error updating user status:", err)
      showError(err.response?.data?.message || err.message || "We couldn't update user status. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const filters = [
    { key: "country", value: country },
    { key: "status", value: status },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <section className="px-4 md:px-8 pb-10 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="all">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>
      <DataTable title="Mentees" columns={columns} rows={users} filters={filters} />

      {/* User Details Popup */}
      {selectedUser && userDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setSelectedUser(null); setUserDetails(null) }} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/20 bg-[#161619] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#161619] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <button
                onClick={() => { setSelectedUser(null); setUserDetails(null) }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#5D38DE]" />
                  Profile Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Name</p>
                    <p className="text-sm font-medium text-white">{userDetails.name}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Email</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userDetails.email}
                    </p>
                  </div>
                  {userDetails.phone && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">Phone</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {userDetails.phone}
                      </p>
                    </div>
                  )}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Country</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userDetails.country}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Timezone</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {userDetails.timezone}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${userDetails.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/80'
                      }`}>
                      {userDetails.status}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Verification</p>
                    <div className="flex items-center gap-1">
                      {userDetails.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-400">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#5D38DE]" />
                  Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">{userDetails.bookingsCount || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Feedbacks Given</p>
                    <p className="text-2xl font-bold text-white">{userDetails.feedbacksCount || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      {userDetails.totalSpent?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#5D38DE]" />
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/50">Account Created</p>
                    <p className="text-sm text-white">{new Date(userDetails.createdAt).toLocaleString()}</p>
                  </div>
                  {userDetails.updatedAt && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/50">Last Updated</p>
                      <p className="text-sm text-white">{new Date(userDetails.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleToggleStatus(userDetails.id, userDetails.status === 'active' ? false : true)}
                  disabled={actionLoading === userDetails.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${userDetails.status === 'active'
                    ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300'
                    }`}
                >
                  {actionLoading === userDetails.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {userDetails.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {userDetails.status === 'active' ? 'Deactivate User' : 'Activate User'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE]" />
        </div>
      )}
    </section>
  )
}
