"use client"

import React, { useState, useEffect } from "react"
import DataTable from "../../components/DataTable"
import { adminNotificationsAPI } from "../../../utils/api"
import { Loader2 } from "lucide-react"

export default function NotificationsPage() {
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyRows, setHistoryRows] = useState([])
  const [successMessage, setSuccessMessage] = useState("")

  const historyColumns = [
    { key: "title", header: "Subject" },
    { key: "message", header: "Message" },
    { key: "channels", header: "Channel" },
    { key: "count", header: "Sent To" },
    { key: "sentAt", header: "Sent At" },
  ]

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const response = await adminNotificationsAPI.getHistory()
      if (response.data?.success) {
        const formattedHistory = response.data.data.history.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          channels: item.channels.join(", "),
          count: `${item.count} users`,
          sentAt: new Date(item.sentAt).toLocaleDateString()
        }))
        setHistoryRows(formattedHistory)
      }
    } catch (error) {
      console.error("Error fetching notification history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setSuccessMessage("")
    setLoading(true)

    const form = e.currentTarget
    const segment = form.segment.value
    const channel = form.channel.value
    const subject = String(form.subject.value || '').trim()
    const message = String(form.message.value || '').trim()

    if (!subject) {
      setFormError('Subject is required.')
      setLoading(false)
      return
    }
    if (subject.length > 120) {
      setFormError('Subject must be ≤ 120 characters.')
      setLoading(false)
      return
    }
    if (!message) {
      setFormError('Message is required.')
      setLoading(false)
      return
    }
    if (message.length > 1000) {
      setFormError('Message must be ≤ 1000 characters.')
      setLoading(false)
      return
    }

    try {
      const response = await adminNotificationsAPI.send({
        segment,
        channel,
        subject,
        message
      })

      if (response.data?.success) {
        setSuccessMessage(`Notification sent successfully to ${response.data.data.count} users`)
        form.reset()
        // Refresh history
        fetchHistory()
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        setFormError(response.data?.message || "Failed to send notification")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      setFormError(error.response?.data?.message || error.message || "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-4 md:px-8 pb-10 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-[#161619] p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select name="segment" className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm md:col-span-1" required>
          <option>All Mentors</option>
          <option>All Mentees</option>
          <option>All Users</option>
        </select>
        <select name="channel" className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm md:col-span-1" required>
          <option>In-App</option>
          <option>Email</option>
        </select>
        <input name="subject" maxLength={120} className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm md:col-span-2" placeholder="Subject" required />
        <textarea name="message" maxLength={1000} className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm md:col-span-4" rows={3} placeholder="Message..." required />
        <div className="md:col-span-4 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#5D38DE] px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Send
          </button>
        </div>
      </form>
      {formError && <p className="text-xs text-rose-300">{formError}</p>}
      {successMessage && <p className="text-xs text-emerald-300">{successMessage}</p>}

      {historyLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
        </div>
      ) : (
        <DataTable title="History" columns={historyColumns} rows={historyRows} />
      )}
    </section>
  )
}
