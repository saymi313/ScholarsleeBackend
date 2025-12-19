import React from 'react'

const RecentlyJoinedStudents = ({ students = [], loading }) => {
  return (
    <div className="bg-[#242424] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recently Joined Students</h2>
        {!loading && <span className="text-gray-400 text-sm">({students.length})</span>}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="h-2 bg-gray-800 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))
          : students.length === 0
          ? <p className="text-sm text-gray-400">No students yet.</p>
          : students.map((student) => (
              <div key={student.menteeId} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                <img
                  src={student.avatar || "/placeholder.svg"}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-[#5D38DE]">{student.country || 'Unknown location'}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(student.lastPaymentAt).toLocaleDateString()}</span>
              </div>
            ))}
      </div>
    </div>
  )
}

export default RecentlyJoinedStudents