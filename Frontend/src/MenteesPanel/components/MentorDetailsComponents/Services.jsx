import { useNavigate } from "react-router-dom"

const Services = ({ mentorData }) => {
  const navigate = useNavigate()

  // Get services from mentor data
  const servicesData = mentorData?.services || []

  // Check if we have valid services
  const hasServices = Array.isArray(servicesData) && servicesData.length > 0

  const services = servicesData.map((service) => ({
    id: service._id,
    title: service.title || 'Untitled Service',
    description: service.description || '',
    rating: service.rating || 0,
    reviews: service.totalReviews || 0,
    price: service.packages && service.packages.length > 0 ? `Rs ${service.packages[0].price}` : 'N/A',
    hasVideo: false,
  }))



  return (
    <div className="w-full">
      {!hasServices ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] p-6 rounded-lg inline-block mb-4">
            <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Yet</h3>
          <p className="text-gray-500">This mentor hasn't added any services yet.</p>
        </div>
      ) : (
        <>
          {/* Mobile carousel, desktop grid */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate('/mentees/service-details')}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm w-[260px] sm:w-auto flex-shrink-0 snap-start text-left focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
              >
                {/* Service Image/Mockup */}
                <div className="bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] p-4 relative h-32 flex items-center justify-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-12 h-20 bg-gray-900 rounded-md flex flex-col">
                      <div className="w-full h-3 bg-gray-800 rounded-t-md"></div>
                      <div className="flex-1 bg-gray-700 p-1">
                        <div className="w-full h-full bg-gray-600 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="w-12 h-20 bg-gray-900 rounded-md flex flex-col">
                      <div className="w-full h-3 bg-gray-800 rounded-t-md"></div>
                      <div className="flex-1 bg-gray-700 p-1">
                        <div className="w-full h-full bg-gray-600 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Video icon for video services */}
                  {service.hasVideo && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-black bg-opacity-30 rounded-sm flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Service Details */}
                <div className="p-4">
                  <h3 className="font-medium text-[#5D38DE] mb-2 text-sm">{service.title}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{service.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                    <span className="text-gray-500 text-sm">({service.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="text-left">
                    <p className="text-xs text-[#5D38DE] uppercase tracking-wide font-medium">STARTING AT</p>
                    <p className="text-[#5D38DE] font-semibold text-sm">{service.price}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center">
            <button className="bg-[#5D38DE] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4C2DB8] transition-colors">
              See all
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Services
