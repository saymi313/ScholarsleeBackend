import React from "react"

const InfoRow = ({ icon, children }) => (
  <div className="flex items-center gap-4 text-white/90 leading-6">
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
      {icon}
    </span>
    <span className="text-sm md:text-base">{children}</span>
  </div>
)

const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://www.instagram.com/scholarslee/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="h-9 w-9 grid place-items-center rounded-full bg-white/20 hover:bg-white/30 transition"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </a>
    <a
      href="https://www.linkedin.com/company/scholarslee/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="h-9 w-9 grid place-items-center rounded-full bg-white/20 hover:bg-white/30 transition"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  </div>
)

export default function ContactInfo() {
  return (
    <aside className="relative overflow-hidden rounded-xl md:rounded-l-xl md:rounded-r-none primary-bg text-white p-6 md:p-8 flex flex-col min-h-full">
      {/* Decorative circles (bottom-right) - adjusted positioning to prevent content overlap */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[#003672] opacity-40"></div>
      <div className="pointer-events-none absolute right-10 bottom-10 h-32 w-32 rounded-full bg-[#4a92f0] opacity-30"></div>

      <div className="relative">
        <h2 className="text-white text-2xl md:text-3xl font-semibold">Contact Information</h2>
        <p className="mt-2 text-white/80 text-sm">Drop your queries about Scholarslee</p>

        <div className="mt-8 space-y-7">
          <InfoRow
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.81 19.79 19.79 0 0 1 .08 1.18 2 2 0 0 1 2.06 0h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L6 7a16 16 0 0 0 7 7l.55-.27a2 2 0 0 1 2.11.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            +1012 3456 789
          </InfoRow>

          <InfoRow
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 4h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6a2 2 0 0 1 2-2Zm18 5.2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.2l9.4 5.87a2 2 0 0 0 2.2 0L22 9.2Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            admin@scholarslee.com
          </InfoRow>

          <InfoRow
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Islamabad Capital Territory, Pakistan
          </InfoRow>
        </div>

        {/* Social icons: inline on mobile, pinned bottom-left on md+ */}
        <div className="md:hidden mt-10">
          <SocialIcons />
        </div>
      </div>

      <div className="hidden md:block absolute left-8 bottom-6">
        <SocialIcons />
      </div>
    </aside>
  )
}
