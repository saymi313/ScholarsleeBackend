const TimeSpentChart = () => {
  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Time Spent</h2>
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400">No time tracking data yet</p>
        <p className="text-gray-500 text-sm mt-2">Your time management stats will appear here</p>
      </div>
    </div>
  )
}

export default TimeSpentChart
