import { useState, useEffect } from "react"
import { mentorDashboardAPI } from "../../../utils/api"

const TimeSpentChart = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await mentorDashboardAPI.getStats()
        if (response.data?.success) {
          setStats(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const completedSessions = stats?.completedOrders || 0
  const totalOrders = stats?.totalOrders || 0
  const processingOrders = stats?.processingOrders || 0

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Session Statistics</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D38DE] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      ) : totalOrders === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400">No session data yet</p>
          <p className="text-gray-500 text-sm mt-2">Session statistics will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Completed Sessions */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completed Sessions</p>
                  <p className="text-2xl font-bold text-white">{completedSessions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-white">{processingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Total Sessions</p>
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-300">
                <span className="text-[#5D38DE] font-bold text-2xl">{totalOrders}</span> total bookings
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeSpentChart
