import React from "react"
import { Link } from "react-router-dom"
export default function MentorProfile({ service }) {
  if (!service || !service.mentorId) {
    return (
      <section aria-labelledby="mentor-heading" className="space-y-3">
        <h3 id="mentor-heading" className="text-lg font-semibold text-foreground">
          Mentor
        </h3>
        <p className="text-muted-foreground">Mentor information not available.</p>
      </section>
    )
  }

  const getMentorName = () => {
    if (service.mentorId && service.mentorId.profile) {
      return `${service.mentorId.profile.firstName} ${service.mentorId.profile.lastName}`
    }
    return 'Mentor'
  }

  const getMentorAvatar = () => {
    if (service.mentorId && service.mentorId.profile && service.mentorId.profile.avatar) {
      return service.mentorId.profile.avatar
    }
    return '/mentor-avatar.svg'
  }

  const getMentorLocation = () => {
    if (service.mentorId && service.mentorId.profile && service.mentorId.profile.country) {
      return service.mentorId.profile.country
    }
    return 'Location not specified'
  }

  const mentorProfileLink = service.mentorProfileId
    ? `/mentees/mentor-details/${service.mentorProfileId}`
    : '#'

  return (
    <section aria-labelledby="mentor-heading" className="space-y-3">
      <h3 id="mentor-heading" className="text-lg font-semibold text-foreground">
        Mentor
      </h3>
      <div className="flex items-start gap-4">
        <img
          src={getMentorAvatar()}
          alt="Mentor avatar"
          className="h-20 w-20 rounded-full border object-cover flex-shrink-0"
        />
        <div className="space-y-1">
          <p className="font-medium text-foreground">{getMentorName()}</p>
          <p className="text-sm text-muted-foreground max-w-prose">
            Experienced mentor specializing in {service.category}. Ready to help you achieve your goals with personalized guidance and support.
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="sr-only">Social links</span>
            <span className="h-5 w-5 rounded-full bg-foreground/10 inline-block" aria-hidden="true"></span>
            <span className="h-5 w-5 rounded-full bg-foreground/10 inline-block" aria-hidden="true"></span>
            <span className="h-5 w-5 rounded-full bg-foreground/10 inline-block" aria-hidden="true"></span>
          </div>
        </div>
        <div className="ml-auto flex flex-col items-end gap-2">
          <Link
            to={mentorProfileLink}
            className="text-sm font-medium text-[#5D38DE] hover:text-[#4a2bb8] hover:underline transition-colors"
          >
            Visit Profile
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            📍 {getMentorLocation()}
          </span>
        </div>
      </div>
    </section>
  )
}
