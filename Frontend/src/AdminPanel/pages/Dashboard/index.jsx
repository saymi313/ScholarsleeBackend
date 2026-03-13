import KpiCard from "../../components/KpiCard"
import RevenueChart from "../../components/RevenueChart"
import ActivityList from "../../components/ActivityList"
import QuickActions from "../../components/QuickActions"
import UsersByCountryChart from "../../components/UsersByCountryChart"
import TopServicesChart from "../../components/TopServicesChart"
import { useState, useEffect } from "react"
import { adminDashboardAPI } from "../../../utils/api"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    revenueMTD: 0,
    mentees: 0,
    activeMentors: 0,
    activeServices: 0,
    payoutsPending: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getMetrics()
        if (response.data?.success) {
          setMetrics(response.data.data)
        } else {
          setError(response.data?.message || "We couldn't load dashboard data. Please refresh the page.")
        }
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err)
        setError(err.message || "We couldn't load dashboard data. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

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
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard label="Revenue (MTD)" value={`$${metrics.revenueMTD.toFixed(0)}`} subtitle="All paid bookings this month" accent="#89f17f" />
        <KpiCard label="Mentees" value={String(metrics.mentees)} subtitle="Registered users" accent="#5D38DE" />
        <KpiCard label="Mentors" value={String(metrics.activeMentors)} subtitle="Active approved mentors" accent="#38bdf8" />
        <KpiCard label="Services" value={String(metrics.activeServices)} subtitle="Live service listings" accent="#f59e0b" />
        <KpiCard label="Pending Payouts" value={String(metrics.payoutsPending)} subtitle="Withdrawals to process" accent="#ef4444" />
      </div>

      {/* Charts + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersByCountryChart />
        <TopServicesChart />
      </div>

      {/* Recent Activity */}
      <div>
        <ActivityList />
      </div>
    </div>
  )
}


