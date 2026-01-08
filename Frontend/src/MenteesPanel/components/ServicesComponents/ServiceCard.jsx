import React from "react"
import { useNavigate } from "react-router-dom"

function Star({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#f5a623" stroke="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.9L18.18 22 12 18.77 5.82 22 7 14.17l-5-4.9 6.91-1.01z" />
    </svg>
  )
}

export default function ServiceCard({ service }) {
  const navigate = useNavigate()

  // Handle undefined service
  if (!service) {
    return (
      <article className="group rounded-xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
        <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </article>
    )
  }

  const handleServiceClick = () => {
    // If we have both mentor slug and service slug, use pretty URL
    if (service.mentorProfile?.slug && service.slug) {
      navigate(`/service-details/${service.mentorProfile.slug}/${service.slug}`)
    } else {
      // Fallback to ID
      navigate(`/service-details/${service._id}`)
    }
  }

  const formatPrice = (packages) => {
    if (!packages || packages.length === 0) return 'N/A'
    const minPrice = Math.min(...packages.map(pkg => pkg.price))
    const maxPrice = Math.max(...packages.map(pkg => pkg.price))
    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
  }

  const getServiceImage = () => {
    if (service && service.images && service.images.length > 0) {
      return service.images[0]
    }
    return '/placeholder.svg'
  }

  const getMentorName = () => {
    if (service.mentorId && service.mentorId.profile) {
      return `${service.mentorId.profile.firstName} ${service.mentorId.profile.lastName}`
    }
    return 'Mentor'
  }

  return (
    <article
      className="group rounded-xl border border-zinc-100 bg-white overflow-hidden shadow-sm hover:shadow transition cursor-pointer"
      onClick={handleServiceClick}
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] bg-[#5D38DE]">
        <img
          src={getServiceImage()}
          alt={service.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {service.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#5D38DE] hover:underline line-clamp-2">
            {service.title}
          </h3>
        </div>

        <p className="text-sm text-zinc-600 line-clamp-2 mb-2">
          {service.description}
        </p>

        <div className="text-xs text-zinc-500 mb-3">
          by {getMentorName()}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star />
            <span className="text-xs text-zinc-600">
              {(service.rating || 0).toFixed(1)} ({service.totalReviews || 0})
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-zinc-400">Starting at</p>
            <p className="text-xs font-semibold text-[#5D38DE]">{formatPrice(service.packages)}</p>
          </div>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">
                +{service.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

