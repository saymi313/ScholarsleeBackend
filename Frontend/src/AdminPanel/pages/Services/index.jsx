"use client"

import { useState, useEffect } from "react"
import DataTable from "../../components/DataTable"
import { adminServicesAPI } from "../../../utils/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

export default function ServicesPage() {
  const [status, setStatus] = useState("all")
  const [services, setServices] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const columns = [
    { key: "title", header: "Title" },
    { key: "mentor", header: "Mentor" },
    { key: "category", header: "Category" },
    { key: "rating", header: "Rating" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "Created" },
  ]

  // Fetch services and category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        
        const [servicesResponse, categoryResponse] = await Promise.all([
          adminServicesAPI.getAllServices({ status }),
          adminServicesAPI.getServicesByCategory()
        ])

        if (servicesResponse.data?.success) {
          setServices(servicesResponse.data.data.services || [])
        } else {
          setError(servicesResponse.data?.message || "Failed to load services")
        }

        if (categoryResponse.data?.success) {
          setCategoryData(categoryResponse.data.data?.data || [])
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError(err.response?.data?.message || err.message || "Failed to load services")
      } finally {
        setLoading(false)
      }
    }

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
        <h3 className="text-sm text-white/70 mb-2">Services by Category</h3>
        <div className="h-56">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
                <Bar dataKey="count" fill="#5D38DE" radius={[4,4,0,0]} />
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
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="draft">draft</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <DataTable title="Services" columns={columns} rows={services} filters={filters} />
    </section>
  )
}
