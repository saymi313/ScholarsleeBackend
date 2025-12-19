import React from "react"

export default function ServiceHeader({ service }) {
  if (!service) {
    return (
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground text-pretty">
          Loading...
        </h1>
      </header>
    )
  }

  const getMentorName = () => {
    if (service.mentorId && service.mentorId.profile) {
      return `${service.mentorId.profile.firstName} ${service.mentorId.profile.lastName}`
    }
    return 'Mentor'
  }

  return (
    <header className="space-y-3">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground text-pretty">
        {service.title}
      </h1>
      <p className="text-sm md:text-base text-muted-foreground">
        by <span className="font-medium text-foreground">{getMentorName()}</span> in{" "}
        <span className="font-medium text-foreground">{service.category}</span>
      </p>
    </header>
  )
}
  