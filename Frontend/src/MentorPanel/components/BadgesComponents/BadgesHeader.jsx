"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const BadgesHeader = () => {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-white text-3xl lg:text-4xl font-bold">Badges</h1>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Badges"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-[#242424] text-white px-4 py-2.5 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:border-[#5D38DE] placeholder-gray-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default BadgesHeader
