import React, { useEffect, useState } from "react"

const EDUCATION_LEVEL_OPTIONS = [
  { value: "", label: "Any education level" },
  { value: "High School", label: "High School" },
  { value: "Associate Degree", label: "Associate Degree" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PhD", label: "PhD" },
  { value: "Professional Degree", label: "Professional Degree" },
  { value: "Other", label: "Other" }
]

export default function ServicesSearchBar({ searchQuery = "", location = "", educationLevel = "", onSearch }) {
  const [queryValue, setQueryValue] = useState(searchQuery)
  const [locationValue, setLocationValue] = useState(location)
  const [educationLevelValue, setEducationLevelValue] = useState(educationLevel)

  useEffect(() => {
    setQueryValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    setLocationValue(location)
  }, [location])

  useEffect(() => {
    setEducationLevelValue(educationLevel)
  }, [educationLevel])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch?.({ query: queryValue, location: locationValue, educationLevel: educationLevelValue })
  }

  const handleClear = () => {
    setQueryValue("")
    setLocationValue("")
    setEducationLevelValue("")
    onSearch?.({ query: "", location: "", educationLevel: "" })
  }

  const handleEducationLevelChange = (event) => {
    const value = event.target.value
    setEducationLevelValue(value)
    onSearch?.({ query: queryValue, location: locationValue, educationLevel: value })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 md:mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:gap-0 mb-12 max-w-7xl mx-auto">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={queryValue}
            onChange={(event) => setQueryValue(event.target.value)}
            placeholder="Search by service or mentor name"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg md:rounded-r-none md:border-r-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={locationValue}
            onChange={(event) => setLocationValue(event.target.value)}
            placeholder="Preferred mentor location or country"
            className="w-full md:w-56 pl-10 pr-4 py-3 border border-gray-300 rounded-lg md:rounded-none md:border-l md:border-r-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={educationLevelValue}
            onChange={handleEducationLevelChange}
            className="w-full md:w-60 pl-4 pr-10 py-3 border border-gray-300 rounded-lg md:rounded-none md:border-l md:border-r-0 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            {EDUCATION_LEVEL_OPTIONS.map((option) => (
              <option key={option.value || "any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto text-white px-8 py-3 font-semibold rounded-lg md:rounded-r-lg md:rounded-l-none bg-[#5D38DE] transition-all duration-300 hover:opacity-90"
        >
          Search Services
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="mt-3 md:mt-0 md:ml-3 px-6 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </form>
    </div>
  )
}
  