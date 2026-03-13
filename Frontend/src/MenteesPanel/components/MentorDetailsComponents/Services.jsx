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
    price: service.packages && service.packages.length > 0 ? `$ ${service.packages[0].price}` : 'N/A',
    image: service.images && service.images.length > 0 ? service.images[0] : null,
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
                onClick={() => navigate(`/mentees/service-details/${service.id}`)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm w-[260px] sm:w-auto flex-shrink-0 snap-start text-left focus:outline-none focus:ring-2 focus:ring-[#5D38DE] hover:shadow-md transition-shadow group h-full flex flex-col"
              >
                {/* Service Image/Mockup */}
                <div className="bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] relative h-48 flex items-center justify-center overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 p-4">
                      <div className="w-12 h-20 bg-gray-900/20 rounded-md flex flex-col backdrop-blur-sm">
                        <div className="w-full h-3 bg-white/20 rounded-t-md"></div>
                        <div className="flex-1 p-1">
                          <div className="w-full h-full bg-white/10 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="w-12 h-20 bg-gray-900/20 rounded-md flex flex-col backdrop-blur-sm">
                        <div className="w-full h-3 bg-white/20 rounded-t-md"></div>
                        <div className="flex-1 p-1">
                          <div className="w-full h-full bg-white/10 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video icon for video services */}
                  {service.hasVideo && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}

                  {/* Category Badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium rounded-full border border-white/20">
                      SERVICE
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base line-clamp-2 group-hover:text-[#5D38DE] transition-colors">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{service.description}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-900">{service.rating}</span>
                      <span className="text-gray-400 text-sm">({service.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">STARTING AT</p>
                      <p className="text-[#5D38DE] font-bold text-base">{service.price}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center">
            <button className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 hover:text-[#5D38DE] hover:border-[#5D38DE] transition-all shadow-sm">
              View all services
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Services
