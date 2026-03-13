import { useEffect, useState } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { Loader2 } from "lucide-react"

export default function TopServicesChart() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getTopServices(5)
        if (response.data?.success) {
          setRows(response.data.data?.data || [])
        } else {
          setError(response.data?.message || "We couldn't load top services. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching top services:", err)
        setError(err.message || "We couldn't load top services. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Top Services</h3>
        <p className="text-xs text-white/60">By Services Sold</p>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 pb-2 lg:mx-0 lg:px-0 lg:pb-0">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Service</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Category</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Mentors Offering</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Sold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.title} className="border-t border-white/10">
                <td className="px-4 py-3 whitespace-nowrap">{r.title}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.category}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.mentors}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


