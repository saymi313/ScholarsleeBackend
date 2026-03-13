import React, { useState, useEffect, useRef } from "react"
import ServiceCard from "./ServiceCard"
import { menteeServicesAPI } from "../../../utils/api"

export default function ServicesGrid({ searchQuery = "", filters = {} }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const previousFiltersKeyRef = useRef(JSON.stringify(filters))
  const previousSearchRef = useRef(searchQuery)

  useEffect(() => {
    const filtersKey = JSON.stringify(filters)
    const filtersChanged = filtersKey !== previousFiltersKeyRef.current
    const searchChanged = searchQuery !== previousSearchRef.current

    if (filtersChanged) {
      previousFiltersKeyRef.current = filtersKey
    }

    if (searchChanged) {
      previousSearchRef.current = searchQuery
    }

    if ((filtersChanged || searchChanged) && currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    loadServices(filtersChanged || searchChanged ? 1 : currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filters])

  const buildParams = (page) => {
    const params = {
      page,
      limit: 12
    }

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return
      }

      if (key === "minPrice" || key === "maxPrice") {
        const numericValue = typeof value === "number" ? value : parseFloat(value)
        if (!Number.isNaN(numericValue)) {
          params[key] = numericValue
        }
        return
      }

      params[key] = value
    })

    return params
  }

  const loadServices = async (page = 1) => {
    try {
      setLoading(true)
      setError("")

      const params = buildParams(page)

      let response
      const trimmedQuery = searchQuery.trim()
      if (trimmedQuery) {
        response = await menteeServicesAPI.search({ ...params, q: trimmedQuery })
      } else {
        response = await menteeServicesAPI.getAll(params)
      }

      if (response.data && response.data.success) {
        const servicesList = response.data.data?.services || response.data.data || []
        const paginationInfo =
          response.data.data?.pagination || response.data.pagination || { current: page, pages: 1, total: 0 }

        setServices(servicesList)
        setPagination({
          current: page,
          pages: paginationInfo.pages || 1,
          total: paginationInfo.total || servicesList.length
        })
      } else {
        setError(response.data?.message || "We couldn't load services right now. Please try again.")
      }
    } catch (error) {
      console.error("Error loading services:", error)

      // Provide specific error messages based on error type
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        setError("This is taking too long. Please check your internet and try again.")
      } else if (error.message?.includes('Network')) {
        setError("We couldn't reach the server. Please check your internet connection and try again.")
      } else {
        setError("We couldn't load services right now. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages) {
      return
    }
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <section className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D38DE]"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadServices}
            className="px-4 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4]"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full">
      {/* Heading row */}
      <div className="flex items-center justify-between py-5">
        <h2 className="text-xl md:text-2xl font-semibold">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Available Services'}
          {pagination.total > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.total} services found)
            </span>
          )}
        </h2>

        {pagination.pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="h-9 w-9 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span aria-hidden>‹</span>
            </button>
            <span className="text-sm text-gray-600">
              {pagination.current} of {pagination.pages}
            </span>
            <button
              type="button"
              aria-label="Next"
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="h-9 w-9 rounded-md bg-[#5D38DE] text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span aria-hidden>›</span>
            </button>
          </div>
        )}
      </div>

      {/* Services grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'No services are available at the moment'}
          </p>
          <button
            onClick={loadServices}
            className="px-4 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4] transition-colors"
          >
            Refresh Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
