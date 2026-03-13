"use client"

import { useState, useEffect, useMemo } from "react"
import DataTable from "../../components/DataTable"
import { adminMentorsAPI } from "../../../utils/api"
import { useToast } from "../../../context/ToastContext"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

export default function MentorsPage() {
  const { showError } = useToast()
  const [status, setStatus] = useState("all")
  const [pauseFilter, setPauseFilter] = useState("all")
  const [mentors, setMentors] = useState([])
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [requestFor, setRequestFor] = useState(null)
  const [signupQuery, setSignupQuery] = useState("")
  const [actionLoading, setActionLoading] = useState(null)

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "country", header: "Country" },
    { key: "verify", header: "Verification" },
    { key: "rating", header: "Rating" },
    { key: "status", header: "Status" },
    {
      key: "paused",
      header: "Login Status",
      render: (value, row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.paused ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'
          }`}>
          {row.paused ? 'Paused' : 'Active'}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleApprove(row.id)}
            disabled={row.status === 'approved' || actionLoading === row.id}
            className={`px-2 py-1 rounded text-xs ${row.status === 'approved' ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-emerald-500/15 text-emerald-300'}`}
          >
            {row.status === 'approved' ? 'Approved' : 'Approve'}
          </button>
          <button
            onClick={() => handlePauseLogin(row.id, !row.paused)}
            disabled={actionLoading === row.id}
            className={`px-2 py-1 rounded text-xs ${row.paused ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {actionLoading === row.id ? '...' : (row.paused ? 'Unpause' : 'Pause Login')}
          </button>
          <button
            onClick={() => setRequestFor(row)}
            className="px-2 py-1 rounded bg-white/5 text-xs"
          >
            Request Services
          </button>
        </div>
      ),
    },
  ]

  // Fetch mentors and status data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const [mentorsResponse, statusResponse] = await Promise.all([
          adminMentorsAPI.getAllMentors({ status }),
          adminMentorsAPI.getMentorsByStatus()
        ])

        if (mentorsResponse.data?.success) {
          setMentors(mentorsResponse.data.data.mentors || [])
        } else {
          setError(mentorsResponse.data?.message || "We couldn't load mentors. Please try again.")
        }

        if (statusResponse.data?.success) {
          setStatusData(statusResponse.data.data?.data || [])
        }
      } catch (err) {
        console.error("Error fetching mentors:", err)
        setError(err.response?.data?.message || err.message || "We couldn't load mentors. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status])

  const handleApprove = async (mentorId) => {
    try {
      setActionLoading(mentorId)
      const response = await adminMentorsAPI.updateApprovalStatus(mentorId, 'approved')
      if (response.data?.success) {
        // Refresh mentors list
        const mentorsResponse = await adminMentorsAPI.getAllMentors({ status })
        if (mentorsResponse.data?.success) {
          setMentors(mentorsResponse.data.data.mentors || [])
        }
        const statusResponse = await adminMentorsAPI.getMentorsByStatus()
        if (statusResponse.data?.success) {
          setStatusData(statusResponse.data.data?.data || [])
        }
      } else {
        showError(response.data?.message || "We couldn't approve this mentor. Please try again.")
      }
    } catch (err) {
      console.error("Error approving mentor:", err)
      showError(err.response?.data?.message || err.message || "We couldn't approve this mentor. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (mentorId) => {
    try {
      setActionLoading(mentorId)
      const response = await adminMentorsAPI.updateApprovalStatus(mentorId, 'rejected')
      if (response.data?.success) {
        // Refresh mentors list
        const mentorsResponse = await adminMentorsAPI.getAllMentors({ status })
        if (mentorsResponse.data?.success) {
          setMentors(mentorsResponse.data.data.mentors || [])
        }
        const statusResponse = await adminMentorsAPI.getMentorsByStatus()
        if (statusResponse.data?.success) {
          setStatusData(statusResponse.data.data?.data || [])
        }
      } else {
        showError(response.data?.message || "We couldn't reject this mentor. Please try again.")
      }
    } catch (err) {
      console.error("Error rejecting mentor:", err)
      showError(err.response?.data?.message || err.message || "We couldn't reject this mentor. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handlePauseLogin = async (mentorId, isPaused) => {
    try {
      setActionLoading(mentorId)
      const response = await adminMentorsAPI.togglePauseLogin(mentorId, isPaused)
      if (response.data?.success) {
        // Refresh mentors list
        const mentorsResponse = await adminMentorsAPI.getAllMentors({ status })
        if (mentorsResponse.data?.success) {
          setMentors(mentorsResponse.data.data.mentors || [])
        }
      } else {
        showError(response.data?.message || "We couldn't update mentor status. Please try again.")
      }
    } catch (err) {
      console.error("Error toggling pause login:", err)
      showError(err.response?.data?.message || err.message || "We couldn't update mentor status. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const signupRows = useMemo(() => mentors.filter((m) => m.status === 'pending'), [mentors])
  const filteredSignupRows = useMemo(() => {
    const q = signupQuery.toLowerCase()
    if (!q) return signupRows
    return signupRows.filter((m) =>
      [m.name, m.email, m.country, m.verify].some((v) => String(v).toLowerCase().includes(q))
    )
  }, [signupRows, signupQuery])

  // Filter mentors by pause status
  const filteredMentors = useMemo(() => {
    if (pauseFilter === 'all') return mentors
    if (pauseFilter === 'paused') return mentors.filter(m => m.paused === true)
    if (pauseFilter === 'active') return mentors.filter(m => m.paused === false)
    return mentors
  }, [mentors, pauseFilter])

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

  const filters = [{ key: "status", value: status }]

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
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm text-white/70">Mentor Sign-up Requests</h3>
          <input
            value={signupQuery}
            onChange={(e) => setSignupQuery(e.target.value)}
            placeholder="Search..."
            className="ml-auto bg-[#0f0f12] border border-white/10 rounded-md px-3 py-2 text-sm w-56 focus:outline-none"
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-white/80">Name</th>
                <th className="px-4 py-3 font-medium text-white/80">Email</th>
                <th className="px-4 py-3 font-medium text-white/80">Country</th>
                <th className="px-4 py-3 font-medium text-white/80">Verification</th>
                <th className="px-4 py-3 font-medium text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSignupRows.map((m) => (
                <tr key={m.id} className="border-t border-white/10">
                  <td className="px-4 py-3 whitespace-normal break-words">{m.name}</td>
                  <td className="px-4 py-3 whitespace-normal break-words">{m.email}</td>
                  <td className="px-4 py-3 whitespace-normal break-words">{m.country}</td>
                  <td className="px-4 py-3 whitespace-normal break-words">{m.verify}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(m.id)}
                        disabled={actionLoading === m.id}
                        className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === m.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(m.id)}
                        disabled={actionLoading === m.id}
                        className="px-2 py-1 rounded bg-rose-500/15 text-rose-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === m.id ? '...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handlePauseLogin(m.id, !m.paused)}
                        disabled={actionLoading === m.id}
                        className="px-2 py-1 rounded bg-white/5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === m.id ? '...' : (m.paused ? 'Unpause' : 'Pause Login')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSignupRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/50">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <h3 className="text-sm text-white/70 mb-2">Mentors by Status</h3>
        <div className="h-56">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", color: "#111" }} labelStyle={{ color: "#111" }} itemStyle={{ color: "#111" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No status data available</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={pauseFilter}
          onChange={(e) => setPauseFilter(e.target.value)}
        >
          <option value="all">All Login Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>
      <DataTable title="Mentors" columns={columns} rows={filteredMentors} filters={filters} />

      {requestFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setRequestFor(null)} />
          <div className="relative z-10 w-[90%] max-w-lg rounded-xl border border-white/10 bg-[#161619] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Request Services</h3>
              <button onClick={() => setRequestFor(null)} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-sm">Close</button>
            </div>
            <p className="text-sm text-white/70 mb-2">To: {requestFor.name} ({requestFor.email})</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const note = e.currentTarget.note.value.trim()
                // TODO: Implement request services functionality
                console.log('Request services for:', requestFor.id, note)
                setRequestFor(null)
              }}
              className="space-y-3"
            >
              <textarea name="note" rows={4} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" placeholder="Describe services to request (e.g., add Interview Prep, CV Revamp)" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setRequestFor(null)} className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm">Cancel</button>
                <button className="px-3 py-2 rounded bg-[#5D38DE] text-sm">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
