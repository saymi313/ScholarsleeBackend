import { useState, useEffect } from "react"
import { mentorDashboardAPI } from "../../../utils/api"

const StudentsChart = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await mentorDashboardAPI.getStats()
        const data = response.data

        // For now, we'll use the total students count from stats
        // In a real implementation, you'd fetch detailed student list
        if (data.success) {
          const count = data.data.totalStudents || 0
          setStudents(Array(Math.min(count, 5)).fill({})) // Show up to 5 placeholder students
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const totalStudents = students.length

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Students</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D38DE] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      ) : totalStudents === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-400">No student data yet</p>
          <p className="text-gray-500 text-sm mt-2">Once you have students, their statistics will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-white">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Active Learners</p>
            <p className="text-gray-300">
              You're currently mentoring <span className="text-[#5D38DE] font-semibold">{totalStudents} student{totalStudents !== 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentsChart