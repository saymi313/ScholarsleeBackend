import { Helmet } from 'react-helmet-async'
import { useCallback, useMemo, useState } from "react"
import ServicesHeader from "../../components/ServicesComponents/ServicesHeader"
import ServicesSearchBar from "../../components/ServicesComponents/ServicesSearchBar"
import FiltersSidebar from "../../components/ServicesComponents/FiltersSidebar"
import ServicesGrid from "../../components/ServicesComponents/ServicesGrid"
import Header from "../../components/Shared/Header"

const DEFAULT_FILTERS = Object.freeze({
  category: "",
  minPrice: null,
  maxPrice: null,
  rating: "",
  location: "",
  educationLevel: "",
  sortBy: "createdAt",
  sortOrder: "desc"
})

export default function ServicesPage() {
  const [searchState, setSearchState] = useState({ query: "", location: "", educationLevel: "" })
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS }))
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleSearch = useCallback(({ query, location, educationLevel }) => {
    const trimmedQuery = query?.trim() || ""
    const trimmedLocation = location?.trim() || ""
    const normalizedLevel = educationLevel?.trim() || ""

    setSearchState({ query: trimmedQuery, location: trimmedLocation, educationLevel: normalizedLevel })
    setFilters((prev) => ({
      ...prev,
      location: trimmedLocation,
      educationLevel: normalizedLevel
    }))
  }, [])

  const handleFilterChange = useCallback((changes) => {
    setFilters((prev) => ({
      ...prev,
      ...changes
    }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      location: prev.location,
      educationLevel: prev.educationLevel
    }))
  }, [])

  const activeFilters = useMemo(() => filters, [filters])

  return (
    <>
      <Helmet>
        <title>Mentorship Services | Scholarslee</title>
        <meta name="description" content="Explore personalized mentorship services: application reviews, visa guidance, interview prep, career counseling, and scholarship assistance from verified experts." />
        <link rel="canonical" href="https://scholarslee.com/mentees/services" />
        <meta property="og:title" content="Mentorship Services | Scholarslee" />
        <meta property="og:description" content="Explore personalized mentorship services for study abroad success." />
        <meta property="og:url" content="https://scholarslee.com/mentees/services" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-zinc-50 pb-16">
        <ServicesHeader />
        <ServicesSearchBar
          searchQuery={searchState.query}
          location={searchState.location}
          educationLevel={searchState.educationLevel}
          onSearch={handleSearch}
        />

        {/* Mobile Filter Toggle */}
        <div className="px-4 md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 md:gap-8">
          {/* Left filters */}
          <div className={`lg:sticky lg:top-4 self-start ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <FiltersSidebar
              filters={activeFilters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right content */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-4 md:p-6 shadow-sm">
            <ServicesGrid
              searchQuery={searchState.query}
              filters={activeFilters}
            />
          </div>
        </div>
      </main>
    </>
  )
}
