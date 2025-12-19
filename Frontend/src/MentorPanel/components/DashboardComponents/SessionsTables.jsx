const SessionsTable = () => {
  const sessions = [] // No dummy data - will show from real bookings

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Scheduled sessions with Mentees</h2>
        <button className="text-[#5D38DE] text-sm hover:underline">See all →</button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">No scheduled sessions yet</p>
          <p className="text-gray-500 text-sm mt-2">Your upcoming sessions will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium pb-3 pr-4 sm:pr-6">Service Name</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 pr-4 sm:pr-6">Student Name</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 pr-4 sm:pr-6">Date</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 pr-4 sm:pr-6">Time</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3">Country</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="border-b border-gray-800 last:border-0">
                  <td className="py-4 pr-4 sm:pr-6 text-white text-sm">{session.serviceName}</td>
                  <td className="py-4 pr-4 sm:pr-6 text-gray-300 text-sm">{session.studentName}</td>
                  <td className="py-4 pr-4 sm:pr-6 text-gray-300 text-sm">{session.date}</td>
                  <td className="py-4 pr-4 sm:pr-6 text-gray-300 text-sm">{session.time}</td>
                  <td className="py-4 text-gray-300 text-sm">{session.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SessionsTable
