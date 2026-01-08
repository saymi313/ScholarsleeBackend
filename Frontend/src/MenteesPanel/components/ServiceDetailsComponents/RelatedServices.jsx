import React, { useState, useEffect } from "react"
import ServiceCard from "../ServicesComponents/ServiceCard"
import api from "../../../utils/api"

export default function RelatedServices({ service }) {
  const [relatedServices, setRelatedServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRelatedServices = async () => {
      if (!service?.mentorId?._id) {
        console.log('No mentor ID found in service:', service)
        setLoading(false)
        return
      }

      try {
        const mentorId = service.mentorId._id
        console.log('Fetching services for mentor:', mentorId)

        // Fetch all services from the same mentor
        const response = await api.get(`/mentees/services/mentor/${mentorId}`)
        console.log('Related services response:', response.data)

        if (response.data.success) {
          // Handle different response structures
          let services = response.data.data

          // If data is an object with a services property, use that
          if (services && typeof services === 'object' && !Array.isArray(services)) {
            services = services.services || []
          }

          // Ensure services is an array
          if (!Array.isArray(services)) {
            console.error('Services data is not an array:', services)
            services = []
          }

          // Filter out the current service and limit to 4 services
          const otherServices = services
            .filter(s => s._id !== service._id)
            .slice(0, 4)

          console.log('Filtered services:', otherServices)
          setRelatedServices(otherServices)
        }
      } catch (error) {
        console.error('Error fetching related services:', error)
        console.error('Error response:', error.response?.data)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedServices()
  }, [service])

  // Don't show section if no related services and not loading
  if (!loading && relatedServices.length === 0 && !error) {
    console.log('No related services to show')
    return null
  }
  // This condition is now handled within the return statement for better error/empty state display
  // if (!loading && relatedServices.length === 0 && !error) {
  //   console.log('No related services to show')
  //   return null
  // }

  return (
    <section aria-labelledby="related-heading" className="space-y-6 mt-8">
      <h3 id="related-heading" className="text-2xl font-semibold text-foreground">
        You might be interested in
      </h3>

      {error && (
        <div className="text-red-600 p-4 border border-red-300 rounded">
          Error loading related services: {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-background p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : relatedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.map((item) => (
            <ServiceCard key={item._id} service={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No other services available from this mentor.</p>
      )}
    </section>
  )
}
