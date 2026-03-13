"use client"

import { useState, useEffect } from "react"
import DataTable from "../../components/DataTable"
import { adminReviewsAPI } from "../../../utils/api"
import { useToast } from "../../../context/ToastContext"
import { Loader2, X, Star, Eye, EyeOff, Trash2, MessageSquare, Send } from "lucide-react"

export default function ReviewsPage() {
  const { showError, showWarning, showSuccess } = useToast()
  const [minRating, setMinRating] = useState("all")
  const [selected, setSelected] = useState(null)
  const [contactResponse, setContactResponse] = useState("")
  const [feedbacks, setFeedbacks] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactsLoading, setContactsLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminResponse, setAdminResponse] = useState("")

  useEffect(() => {
    fetchFeedbacks()
    fetchContactMessages()
  }, [minRating])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      setError("")
      const params = {}
      if (minRating !== "all") {
        params.minRating = minRating
      }
      const response = await adminReviewsAPI.getFeedbacks(params)
      if (response.data?.success) {
        setFeedbacks(response.data.data.feedbacks || [])
      } else {
        setError(response.data?.message || "We couldn't load feedback. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err)
      setError(err.message || "We couldn't load feedback. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchContactMessages = async () => {
    try {
      setContactsLoading(true)
      const response = await adminReviewsAPI.getContactMessages()
      if (response.data?.success) {
        setContacts(response.data.data.contactMessages || [])
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err)
    } finally {
      setContactsLoading(false)
    }
  }

  const handleToggleVisibility = async (feedback) => {
    try {
      const newVisibility = !feedback.isVisible
      await adminReviewsAPI.updateVisibility(feedback.id, newVisibility)
      // Update local state
      setFeedbacks(feedbacks.map(f =>
        f.id === feedback.id ? { ...f, isVisible: newVisibility, status: newVisibility ? 'visible' : 'hidden' } : f
      ))
      if (selected && selected.id === feedback.id) {
        setSelected({ ...selected, isVisible: newVisibility, status: newVisibility ? 'visible' : 'hidden' })
      }
    } catch (err) {
      console.error("Error updating visibility:", err)
      showError(err.response?.data?.message || "We couldn't update visibility. Please try again.")
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return

    try {
      await adminReviewsAPI.deleteFeedback(feedbackId)
      setFeedbacks(feedbacks.filter(f => f.id !== feedbackId))
      if (selected && selected.id === feedbackId) {
        setSelected(null)
      }
    } catch (err) {
      console.error("Error deleting feedback:", err)
      showError(err.response?.data?.message || "We couldn't delete this feedback. Please try again.")
    }
  }

  const handleUpdateResponse = async (feedbackId, response) => {
    try {
      await adminReviewsAPI.updateResponse(feedbackId, response)
      // Update local state
      setFeedbacks(feedbacks.map(f =>
        f.id === feedbackId ? { ...f, adminResponse: response } : f
      ))
      if (selected && selected.id === feedbackId) {
        setSelected({ ...selected, adminResponse: response })
      }
    } catch (err) {
      console.error("Error updating response:", err)
      showError(err.response?.data?.message || "We couldn't update the response. Please try again.")
    }
  }

  const handleRespondToContact = async (contactId, response) => {
    if (!response.trim()) {
      showWarning("Please enter a response")
      return
    }

    try {
      await adminReviewsAPI.respondToContact(contactId, response.trim())
      // Refresh contact messages
      fetchContactMessages()
      setSelected(null)
      setContactResponse("")
      showSuccess("Response sent successfully")
    } catch (err) {
      console.error("Error responding to contact:", err)
      showError(err.response?.data?.message || "We couldn't send the response. Please try again.")
    }
  }

  const columns = [
    { key: "service", header: "Service" },
    { key: "mentor", header: "Mentor" },
    { key: "mentee", header: "Mentee" },
    { key: "rating", header: "Rating" },
    { key: "review", header: "Review" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => { setSelected(r); setAdminResponse(r.adminResponse || '') }} className="px-2 py-1 rounded bg-white/5 text-xs">View</button>
          <button onClick={() => handleToggleVisibility(r)} className="px-2 py-1 rounded bg-white/5 text-xs">{r.status === "hidden" ? "Unhide" : "Hide"}</button>
          <button onClick={() => handleDeleteFeedback(r.id)} className="px-2 py-1 rounded bg-rose-500/15 text-rose-300 text-xs">Remove</button>
        </div>
      ),
    },
  ]

  const filters = [{ key: "rating", value: minRating === "all" ? undefined : Number(minRating) }]

  return (
    <section className="px-4 md:px-8 pb-10 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
        </div>
      ) : (
        <DataTable title="Reviews" columns={columns} rows={feedbacks} filters={filters} />
      )}

      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Contact Messages</h3>
        </div>
        {contactsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#5D38DE]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">From</th>
                  <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Subject</th>
                  <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Received</th>
                  <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-white/50">No contact messages</td>
                  </tr>
                ) : (
                  contacts.map((m) => (
                    <tr key={m.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">{m.name} <span className="text-white/50">({m.email})</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">{m.subject}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs ${m.status === 'responded' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/80'}`}>{m.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelected({ ...m, isContact: true, viewOnly: true }); setContactResponse(m.adminResponse || '') }}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={() => { setSelected({ ...m, isContact: true, viewOnly: false }); setContactResponse(m.adminResponse || '') }}
                            className="px-2 py-1 rounded bg-[#5D38DE]/20 hover:bg-[#5D38DE]/30 text-[#5D38DE] text-xs flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Respond
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && !selected.isContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/20 bg-[#161619] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#161619] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Feedback Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Service</p>
                  <p className="text-sm font-medium text-white">{selected.service}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{selected.rating}/5</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Mentor</p>
                  <p className="text-sm font-medium text-white">{selected.mentor}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Mentee</p>
                  <p className="text-sm font-medium text-white">{selected.mentee}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Review Comment</p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-white/90 leading-relaxed">{selected.review}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Admin Response (Optional)</p>
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#5D38DE] focus:border-transparent resize-none"
                  placeholder="Write a response to this feedback..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  onBlur={(e) => handleUpdateResponse(selected.id, e.target.value)}
                />
                <p className="text-xs text-white/50 mt-1">Response will be saved automatically when you click outside</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleToggleVisibility(selected)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  {selected.status === 'hidden' ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Unhide Feedback
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Feedback
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this feedback?")) {
                      handleDeleteFeedback(selected.id)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && selected.isContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/20 bg-[#161619] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#161619] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {selected.viewOnly ? 'Contact Message' : 'Respond to Contact'}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">From</p>
                  <p className="text-sm font-medium text-white">{selected.name}</p>
                  <p className="text-xs text-white/50 mt-1">{selected.email}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Subject</p>
                  <p className="text-sm font-medium text-white">{selected.subject}</p>
                </div>
                {selected.phone && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/50 mb-1">Phone</p>
                    <p className="text-sm font-medium text-white">{selected.phone}</p>
                  </div>
                )}
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/50 mb-1">Received</p>
                  <p className="text-sm font-medium text-white">{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/80 mb-2">Message</p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              {selected.adminResponse && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">Previous Response</p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <p className="text-sm text-emerald-300 leading-relaxed whitespace-pre-wrap">{selected.adminResponse}</p>
                    <p className="text-xs text-emerald-400/70 mt-2">
                      Responded on {selected.respondedAt ? new Date(selected.respondedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {!selected.viewOnly && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">Your Response</p>
                  <textarea
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#5D38DE] focus:border-transparent resize-none"
                    value={contactResponse}
                    onChange={(e) => setContactResponse(e.target.value)}
                    placeholder="Type your response to the user..."
                  />
                  <p className="text-xs text-white/50 mt-2">This response will be sent as a notification to the user</p>
                </div>
              )}

              {selected.viewOnly ? (
                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSelected({ ...selected, viewOnly: false })
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5D38DE] hover:bg-[#4d2ec4] text-white text-sm font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Respond to Message
                  </button>
                </div>
              ) : (
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespondToContact(selected.id, contactResponse)}
                    disabled={!contactResponse.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5D38DE] hover:bg-[#4d2ec4] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send Response
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
