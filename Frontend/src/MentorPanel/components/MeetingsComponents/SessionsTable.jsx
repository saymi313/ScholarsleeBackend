import React, { useState, useEffect } from 'react'
import meetingService from "../../pages/Meetings/meetingService"

const SessionsTable = ({ searchTerm, selectedDate, refreshTrigger }) => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        let result;

        if (selectedDate) {
          // Fetch for specific date
          result = await meetingService.getMeetingsByDate(selectedDate)
        } else {
          // Fetch for current month by default
          const today = new Date()
          const start = new Date(today.getFullYear(), today.getMonth(), 1)
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          result = await meetingService.getMeetingsByDateRange(start, end)
        }

        if (result.success) {
          // Normalize data structure whether it comes from range (meetingsByDate) or single date (meetings)
          let meetingsList = [];
          if (result.meetings) {
            meetingsList = result.meetings;
          } else if (result.meetingsByDate) {
            meetingsList = Object.values(result.meetingsByDate).flat();
          }

          const formattedSessions = meetingsList.map(m => ({
            id: m._id,
            serviceName: m.title || "Mentorship Session",
            studentName: m.menteeName || "Mentee",
            date: new Date(m.scheduledDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(m.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            assignedTo: "You", // Since this is mentor panel
            rawDate: m.scheduledDate // for sorting
          })).sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)) // Newest first

          setSessions(formattedSessions)
        }
      } catch (error) {
        console.error("Error fetching sessions:", error)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [selectedDate, refreshTrigger])

  // Client-side filtering for search term
  const filteredSessions = sessions.filter(session => {
    return !searchTerm ||
      session.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white">
          {selectedDate ? `Scheduled sessions for ${selectedDate}` : "Scheduled sessions (This Month)"}
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors text-sm self-start sm:self-auto">See all →</button>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
        <table className="w-full min-w-[560px] sm:min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 font-medium pb-3 pr-2 sm:pr-4 text-xs sm:text-sm">Service Name</th>
              <th className="text-left text-gray-400 font-medium pb-3 pr-2 sm:pr-4 text-xs sm:text-sm">Student Name</th>
              <th className="text-left text-gray-400 font-medium pb-3 pr-2 sm:pr-4 text-xs sm:text-sm">Date</th>
              <th className="text-left text-gray-400 font-medium pb-3 pr-2 sm:pr-4 text-xs sm:text-sm">Time</th>
              <th className="text-left text-gray-400 font-medium pb-3 text-xs sm:text-sm">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">Loading sessions...</td>
              </tr>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-800">
                  <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-white text-sm sm:text-base break-words">{session.serviceName}</td>
                  <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-gray-300 text-sm sm:text-base">{session.studentName}</td>
                  <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-gray-300 text-sm sm:text-base">{session.date}</td>
                  <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-gray-300 text-sm sm:text-base">{session.time}</td>
                  <td className="py-3 sm:py-4 text-gray-300 text-sm sm:text-base">{session.assignedTo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 sm:py-8 text-center text-gray-400 text-sm sm:text-base">
                  {searchTerm ? "No sessions found matching your search" : "No sessions scheduled"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SessionsTable
