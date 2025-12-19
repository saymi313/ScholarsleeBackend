// Reuse existing service card if available
import React from "react"
import ServiceCard from "../ServicesComponents/ServiceCard"

const mock = Array.from({ length: 4 }).map((_, i) => ({
  _id: `mock-${i + 1}`,
  title: "Subject of Purpose",
  description: "I will help you write effective SOPs",
  rating: 5.0,
  totalReviews: 570,
  packages: [
    { name: "Basic", price: 8674, duration: "1 week" }
  ],
  images: ["/placeholder.svg"],
  mentorId: {
    profile: {
      firstName: "John",
      lastName: "Doe"
    }
  },
  category: "Academic Writing"
}))

export default function RelatedServices({ service }) {
  return (
    <section aria-labelledby="related-heading" className="space-y-4">
      <h3 id="related-heading" className="text-xl font-semibold text-foreground">
        You might be interested in
      </h3>
      {/* If ServiceCard expects specific props, adjust mapping accordingly */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mock.map((item) => (
          <div key={item._id} className="rounded-lg border bg-background">
            {/* Fallback simple card if ServiceCard API differs */}
            {ServiceCard ? (
              <ServiceCard service={item} />
            ) : (
              <div>
                <img src={item.image || "/placeholder.svg"} alt="" className="w-full rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <a className="font-medium text-[color:var(--brand,#5D38DE)] hover:underline" href="#">
                    {item.title}
                  </a>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Starting at <span className="font-semibold">{item.price}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
