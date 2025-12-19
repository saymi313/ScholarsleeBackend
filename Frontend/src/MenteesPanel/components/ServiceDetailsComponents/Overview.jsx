import React from "react"

export default function Overview({ service }) {
  if (!service) {
    return (
      <section aria-labelledby="overview-heading" className="space-y-3">
        <h2 id="overview-heading" className="text-lg md:text-xl font-semibold text-foreground">
          Overview
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          Loading...
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="overview-heading" className="space-y-3">
      <h2 id="overview-heading" className="text-lg md:text-xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
        {service.description}
      </p>
    </section>
  )
}
  