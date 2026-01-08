import React, { useState, useEffect } from 'react'
import { mentorsAPI } from '../../../utils/api'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const Connections = ({ mentorData }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    if (mentorData?._id) {
      loadStudents(1)
    }
  }, [mentorData?._id])

  const loadStudents = async (page) => {
    try {
      setLoading(true)
      const response = await mentorsAPI.getStudents(mentorData._id, { page, limit: 10 })
      if (response.data.success) {
        setStudents(response.data.data.students)
        setPagination(response.data.data.pagination)
      }
    } catch (err) {
      console.error('Failed to load students:', err)
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadStudents(newPage)
    }
  }

  if (loading && pagination.current === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 py-12 text-center">{error}</div>
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No students connected yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student._id}
            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={student.profile?.avatar || "/u.jpeg"}
                  alt={`${student.profile?.firstName} ${student.profile?.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {student.profile?.firstName} {student.profile?.lastName}
                </h3>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {pagination.current} of {pagination.pages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Connections
