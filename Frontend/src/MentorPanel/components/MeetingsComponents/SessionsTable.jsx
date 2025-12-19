const SessionsTable = ({ searchTerm, selectedDate }) => {
    const sessions = [
      {
        id: 1,
        serviceName: "SOP with Usman Awan",
        studentName: "Soban Ahsan",
        date: "20 May 2025",
        time: "18:30 PM",
        assignedTo: "Syed Ali",
        dateValue: 20,
      },
      {
        id: 2,
        serviceName: "Erasmus Mundus with Ali",
        studentName: "Soban Ahsan",
        date: "20 May 2025",
        time: "18:30 PM",
        assignedTo: "Syed Ali",
        dateValue: 20,
      },
      {
        id: 3,
        serviceName: "Appointment Interview",
        studentName: "Soban Ahsan",
        date: "21 May 2025",
        time: "18:30 PM",
        assignedTo: "Syed Ali",
        dateValue: 21,
      },
      {
        id: 4,
        serviceName: "Appointment Interview",
        studentName: "Soban Ahsan",
        date: "22 May 2025",
        time: "18:30 PM",
        assignedTo: "Syed Ali",
        dateValue: 22,
      },
    ]

    // Filter sessions based on search term and selected date
    const filteredSessions = sessions.filter(session => {
      const matchesSearch = !searchTerm || 
        session.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDate = !selectedDate || session.dateValue === selectedDate
      
      return matchesSearch && matchesDate
    })
  
    return (
      <div className="bg-[#242424] rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Scheduled sessions with Mentees</h3>
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
              {filteredSessions.length > 0 ? (
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
                    {searchTerm || selectedDate ? "No sessions found matching your criteria" : "No sessions scheduled"}
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
  