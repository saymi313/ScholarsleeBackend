"use client"

import { useState, useEffect } from "react"
import DataTable from "../../components/DataTable"
import { adminSessionsAPI } from "../../../utils/api"
import { Loader2, X, Eye, Calendar, Clock, DollarSign, CreditCard, User, Mail, Link as LinkIcon, FileText } from "lucide-react"

export default function SessionsPage() {
  const [status, setStatus] = useState("all")
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const columns = [
    { key: "id", header: "SessionId" },
    { key: "mentor", header: "Mentor" },
    { key: "mentee", header: "Mentee" },
    { key: "topic", header: "Topic" },
    { key: "datetime", header: "DateTime" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewSession(row.id)}
            className="px-2 py-1 rounded bg-[#5D38DE]/20 hover:bg-[#5D38DE]/30 text-[#5D38DE] text-xs flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </div>
      ),
    },
  ]

  const handleViewSession = async (sessionId) => {
    try {
      setDetailsLoading(true)
      const response = await adminSessionsAPI.getSessionById(sessionId)
      if (response.data?.success) {
        setSessionDetails(response.data.data)
        setSelectedSession(sessionId)
      } else {
        alert(response.data?.message || "Failed to load session details")
      }
    } catch (err) {
      console.error("Error fetching session details:", err)
      alert(err.response?.data?.message || err.message || "Failed to load session details")
    } finally {
      setDetailsLoading(false)
    }
  }

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError("")
        
        const response = await adminSessionsAPI.getAllSessions({ status })
        
        if (response.data?.success) {
          setSessions(response.data.data.sessions || [])
        } else {
          setError(response.data?.message || "Failed to load sessions")
        }
      } catch (err) {
        console.error("Error fetching sessions:", err)
        setError(err.response?.data?.message || err.message || "Failed to load sessions")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [status])

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
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="scheduled">scheduled</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
      <DataTable title="Bookings" columns={columns} rows={sessions} filters={filters} />

      {/* Session Details Popup */}
      {selectedSession && sessionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setSelectedSession(null); setSessionDetails(null) }} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/20 bg-[#161619] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#161619] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Session Details</h3>
              <button 
                onClick={() => { setSelectedSession(null); setSessionDetails(null) }} 
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Meeting Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#5D38DE]" />
                  Meeting Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Title</p>
                    <p className="text-sm font-medium text-white">{sessionDetails.meeting.title}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      sessionDetails.meeting.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                      sessionDetails.meeting.status === 'cancelled' ? 'bg-rose-500/15 text-rose-400' :
                      sessionDetails.meeting.status === 'in-progress' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {sessionDetails.meeting.status}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Scheduled Date & Time</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(sessionDetails.meeting.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Duration</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {sessionDetails.meeting.duration} minutes
                    </p>
                  </div>
                  {sessionDetails.meeting.meetingLink && (
                    <div className="bg-white/5 rounded-lg p-4 col-span-2">
                      <p className="text-xs text-white/50 mb-1">Meeting Link</p>
                      <a 
                        href={sessionDetails.meeting.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#5D38DE] hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {sessionDetails.meeting.meetingLink}
                      </a>
                    </div>
                  )}
                  {sessionDetails.meeting.description && (
                    <div className="bg-white/5 rounded-lg p-4 col-span-2">
                      <p className="text-xs text-white/50 mb-1">Description</p>
                      <p className="text-sm text-white/90">{sessionDetails.meeting.description}</p>
                    </div>
                  )}
                  {sessionDetails.meeting.notes && (
                    <div className="bg-white/5 rounded-lg p-4 col-span-2">
                      <p className="text-xs text-white/50 mb-1">Notes</p>
                      <p className="text-sm text-white/90">{sessionDetails.meeting.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#5D38DE]" />
                  Participants
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Mentor</p>
                    <p className="text-sm font-medium text-white">{sessionDetails.meeting.mentor.name}</p>
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {sessionDetails.meeting.mentor.email}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Mentee</p>
                    <p className="text-sm font-medium text-white">{sessionDetails.meeting.mentee.name}</p>
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {sessionDetails.meeting.mentee.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Information (if available) */}
              {sessionDetails.booking && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#5D38DE]" />
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">Booking Status</p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sessionDetails.booking.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                        sessionDetails.booking.status === 'cancelled' ? 'bg-rose-500/15 text-rose-400' :
                        sessionDetails.booking.status === 'confirmed' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        {sessionDetails.booking.status}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">Payment Status</p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sessionDetails.booking.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                        sessionDetails.booking.paymentStatus === 'refunded' ? 'bg-blue-500/15 text-blue-400' :
                        sessionDetails.booking.paymentStatus === 'failed' ? 'bg-rose-500/15 text-rose-400' :
                        'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        {sessionDetails.booking.paymentStatus}
                      </span>
                    </div>
                    {sessionDetails.booking.service && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-white/50 mb-1">Service</p>
                        <p className="text-sm font-medium text-white">{sessionDetails.booking.service.title}</p>
                        <p className="text-xs text-white/50 mt-1">{sessionDetails.booking.service.category}</p>
                      </div>
                    )}
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">Total Amount</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${sessionDetails.booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    {sessionDetails.booking.paymentId && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-white/50 mb-1">Payment ID</p>
                        <p className="text-sm font-medium text-white flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {sessionDetails.booking.paymentId}
                        </p>
                      </div>
                    )}
                    {sessionDetails.booking.notes && (
                      <div className="bg-white/5 rounded-lg p-4 col-span-2">
                        <p className="text-xs text-white/50 mb-1">Booking Notes</p>
                        <p className="text-sm text-white/90">{sessionDetails.booking.notes}</p>
                      </div>
                    )}
                    {sessionDetails.booking.menteeNotes && (
                      <div className="bg-white/5 rounded-lg p-4 col-span-2">
                        <p className="text-xs text-white/50 mb-1">Mentee Notes</p>
                        <p className="text-sm text-white/90">{sessionDetails.booking.menteeNotes}</p>
                      </div>
                    )}
                    {sessionDetails.booking.mentorNotes && (
                      <div className="bg-white/5 rounded-lg p-4 col-span-2">
                        <p className="text-xs text-white/50 mb-1">Mentor Notes</p>
                        <p className="text-sm text-white/90">{sessionDetails.booking.mentorNotes}</p>
                      </div>
                    )}
                    {sessionDetails.booking.cancellationReason && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 col-span-2">
                        <p className="text-xs text-rose-400 mb-1">Cancellation Reason</p>
                        <p className="text-sm text-rose-300">{sessionDetails.booking.cancellationReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meeting Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Timeline</h4>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/50">Created</p>
                    <p className="text-sm text-white">{new Date(sessionDetails.meeting.createdAt).toLocaleString()}</p>
                  </div>
                  {sessionDetails.meeting.startedAt && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/50">Started</p>
                      <p className="text-sm text-white">{new Date(sessionDetails.meeting.startedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {sessionDetails.meeting.endedAt && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/50">Ended</p>
                      <p className="text-sm text-white">{new Date(sessionDetails.meeting.endedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {sessionDetails.booking?.completedAt && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/50">Booking Completed</p>
                      <p className="text-sm text-white">{new Date(sessionDetails.booking.completedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
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
