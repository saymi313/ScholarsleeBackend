import { useState, useEffect } from "react"
import StatsCard from "./StatsCards"
import { Users, DollarSign, BookOpen, ShoppingCart, CheckCircle, Package } from "lucide-react"
import { mentorDashboardAPI } from "../../../utils/api"

const StatsGrid = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await mentorDashboardAPI.getStats()
        if (response.data?.success) {
          setStats(response.data.data)
        } else {
          setError(response.data?.message || "We couldn't load your stats. Please refresh the page.")
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        setError(err.message || "We couldn't load your stats. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const statsConfig = [
    {
      icon: Users,
      label: "Total students",
      value: loading ? "..." : (stats?.totalStudents || 0).toString(),
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: DollarSign,
      label: "Total sales",
      value: loading ? "..." : formatCurrency(stats?.totalSales || 0),
      bgColor: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: BookOpen,
      label: "Total Services",
      value: loading ? "..." : (stats?.totalServices || 0).toString(),
      bgColor: "bg-teal-500/20",
      iconColor: "text-teal-500",
    },
    {
      icon: ShoppingCart,
      label: "Processing Orders",
      value: loading ? "..." : (stats?.processingOrders || 0).toString(),
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: CheckCircle,
      label: "Completed Orders",
      value: loading ? "..." : (stats?.completedOrders || 0).toString(),
      bgColor: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      icon: Package,
      label: "Total orders",
      value: loading ? "..." : (stats?.totalOrders || 0).toString(),
      bgColor: "bg-orange-500/20",
      iconColor: "text-orange-500",
    },
  ]

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsConfig.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}

export default StatsGrid
