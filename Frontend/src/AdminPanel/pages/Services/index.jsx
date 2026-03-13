"use client"

import { useState, useEffect } from "react"
import DataTable from "../../components/DataTable"
import { adminServicesAPI } from "../../../utils/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2, Check, X } from "lucide-react"

export default function ServicesPage() {
  const [status, setStatus] = useState("all")
  const [services, setServices] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState(null)

  // Handle approve
  const handleApprove = async (serviceId) => {
    console.log('🟢 Approving service:', serviceId)
    try {
      setProcessingId(serviceId)
      const response = await adminServicesAPI.approveService(serviceId)

      if (response.data?.success) {
        await fetchData()
      } else {
        setError(response.data?.message || "We couldn't approve this service. Please try again.")
      }
    } catch (err) {
      console.error("Error approving service:", err)
      setError(err.response?.data?.message || err.message || "We couldn't approve this service. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  // Handle reject
  const handleReject = async (serviceId) => {
    console.log('🔴 Rejecting service:', serviceId)
    try {
      setProcessingId(serviceId)
      const response = await adminServicesAPI.rejectService(serviceId)

      if (response.data?.success) {
        await fetchData()
      } else {
        setError(response.data?.message || "We couldn't reject this service. Please try again.")
      }
    } catch (err) {
      console.error("Error rejecting service:", err)
      setError(err.response?.data?.message || err.message || "We couldn't reject this service. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  const columns = [
    { key: "title", header: "Title" },
    { key: "mentor", header: "Mentor" },
    { key: "category", header: "Category" },
    { key: "rating", header: "Rating" },
    {
      key: "status",
      header: "Status",
      render: (value) => {
        const statusColors = {
          approved: "bg-green-600/20 text-green-400 border-green-600/30",
          pending: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
          rejected: "bg-red-600/20 text-red-400 border-red-600/30",
          draft: "bg-gray-600/20 text-gray-400 border-gray-600/30"
        }
        return (
          <span className={`px-2 py-1 rounded text-xs border ${statusColors[value] || statusColors.draft}`}>
            {value}
          </span>
        )
      }
    },
    { key: "createdAt", header: "Created" },
    {
      key: "id",
      header: "Actions",
      render: (id, row) => {
        console.log('🔍 Rendering actions for service:', { id, status: row.status, row })
        // Show buttons for draft and pending services (not approved or rejected)
        if (row.status === 'draft' || row.status === 'pending') {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(id)}
                disabled={processingId === id}
                className="px-3 py-1 bg-green-600 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {processingId === id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleReject(id)}
                disabled={processingId === id}
                className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {processingId === id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
                Reject
              </button>
            </div>
          )
        }
        return <span className="text-xs text-gray-400">-</span>
      }
    },
  ]

  // Fetch services and category data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [servicesResponse, categoryResponse] = await Promise.all([
        adminServicesAPI.getAllServices({ status }),
        adminServicesAPI.getServicesByCategory()
      ])

      console.log('📦 Services response:', servicesResponse.data)

      if (servicesResponse.data?.success) {
        const servicesData = servicesResponse.data.data.services || []
        console.log('✅ Services loaded:', servicesData.length, servicesData)
        setServices(servicesData)
      } else {
        setError(servicesResponse.data?.message || "We couldn't load services. Please try again.")
      }

      if (categoryResponse.data?.success) {
        setCategoryData(categoryResponse.data.data?.data || [])
      }
    } catch (err) {
      console.error("Error fetching services:", err)
      setError(err.response?.data?.message || err.message || "We couldn't load services. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [status])

  const filters = [{ key: "status", value: status }]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  return (
    <section className="px-4 md:px-8 pb-10 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <h3 className="text-sm text-white/70 mb-2">Services by Category</h3>
        <div className="h-56">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
                <Bar dataKey="count" fill="#5D38DE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No category data available</p>
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
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <DataTable title="Services" columns={columns} rows={services} filters={filters} />
    </section>
  )
}
