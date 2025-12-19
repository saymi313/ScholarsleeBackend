const MeetingsHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4">Meetings</h1>
      
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Meetings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-[#5D38DE] transition-colors text-sm"
        />
        <svg className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
}

export default MeetingsHeader
