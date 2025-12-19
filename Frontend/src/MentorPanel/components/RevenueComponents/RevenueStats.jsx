import React from 'react'
import { TrendingUp, TrendingDown } from "lucide-react"

const formatCurrency = (value = 0, currency = 'usd') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `$${Number(value || 0).toLocaleString()}`
  }
}

const RevenueStats = ({ data, loading }) => {
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.totalRevenue, data?.currency),
      change: `${(data?.revenueChange || 0).toFixed(2)}%`,
      isPositive: (data?.revenueChange || 0) >= 0,
      subtitle: "vs previous month",
      description: "All time",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
    },
    {
      title: "Active Students",
      value: loading ? '—' : (data?.activeStudents ?? 0).toLocaleString(),
      change: "",
      isPositive: true,
      subtitle: "unique mentees",
      description: "This year",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Completed Sessions",
      value: loading ? '—' : (data?.completedSessions ?? 0).toLocaleString(),
      change: "",
      isPositive: true,
      subtitle: "lifetime",
      description: "Mentor bookings",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-[#242424] rounded-xl p-6 relative border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}>
          <div className="flex items-start justify-between mb-6">
            <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-xl shadow-sm`}>
              {stat.icon}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-gray-300 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-gray-500 text-xs">{stat.description}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{loading ? '...' : stat.value}</h2>
            </div>

            {stat.change !== "" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.isPositive ? (
                    <span className="text-green-400 flex items-center gap-1 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1 text-sm font-medium">
                      <TrendingDown className="w-4 h-4" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">{stat.subtitle}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RevenueStats
