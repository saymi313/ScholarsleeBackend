"use client"

import React, { useState } from "react"
import { contactAPI } from "../../../utils/api"

const Radio = ({ label, name, value, checked, onChange }) => (
  <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
    <span
      className={`h-3.5 w-3.5 rounded-full border ${checked ? "border-[#5D38DE]" : "border-gray-300"
        } grid place-items-center`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-[#5D38DE]" : "bg-transparent"}`} />
    </span>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    {label}
  </label>
)

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "Mentorship Inquiry",
    message: "",
  })

  const handle = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      const response = await contactAPI.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message
      })

      if (response.data?.success) {
        setSuccess(true)
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "Mentorship Inquiry",
          message: "",
        })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(response.data?.message || "We couldn't send your message. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting contact form:", err)
      setError(err.response?.data?.message || err.message || "We couldn't send your message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const field =
    "w-full border-0 border-b border-gray-300 focus:border-[#5D38DE] focus:ring-0 placeholder:text-gray-400 text-sm py-2 bg-transparent"

  return (
    <form onSubmit={submit} className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gray-500">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handle}
            placeholder=""
            className={field}
            aria-label="First Name"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handle}
            className={field}
            aria-label="Last Name"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            placeholder=""
            className={field}
            aria-label="Email"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="+1 012 3456 789"
            className={field}
            aria-label="Phone Number"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700">Select Subject?</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {["Mentorship Inquiry", "Application Assistance", "Visa & Financial Guidance", "Other"].map((s) => (
            <Radio key={s} label={s} name="subject" value={s} checked={form.subject === s} onChange={handle} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs text-gray-500">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handle}
          placeholder="Write your message.."
          rows={4}
          className={`${field} resize-y`}
          aria-label="Message"
        />
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          Message submitted successfully! We'll get back to you soon.
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg text-white shadow-sm primary-bg primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <span className="animate-spin">⏳</span>}
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  )
}
