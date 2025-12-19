import React from "react"

export default function Features({ service }) {
  if (!service) {
    return (
      <section aria-labelledby="features-heading" className="space-y-3">
        <h2 id="features-heading" className="text-lg md:text-xl font-semibold text-foreground">
          Features
        </h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </section>
    )
  }

  // Get all unique features from all packages
  const allFeatures = service.packages?.flatMap(pkg => pkg.features || []) || []
  const uniqueFeatures = [...new Set(allFeatures)]

  return (
    <section aria-labelledby="features-heading" className="space-y-3">
      <h2 id="features-heading" className="text-lg md:text-xl font-semibold text-foreground">
        Features
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-muted-foreground">
        {uniqueFeatures.length > 0 ? (
          uniqueFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))
        ) : (
          <li>No specific features listed</li>
        )}
      </ul>
    </section>
  )
}
  