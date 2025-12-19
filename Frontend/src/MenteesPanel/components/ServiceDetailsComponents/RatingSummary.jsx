import React from "react"

export default function RatingSummary({ service }) {
  if (!service) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Loading...</span>
      </div>
    )
  }

  const rating = service.rating || 0
  const totalReviews = service.totalReviews || 0

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {/* star icon */}
      <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span>({totalReviews})</span>
      <span className="mx-2 text-foreground/20">|</span>
      <span>Verified reviews</span>
    </div>
  )
}
  