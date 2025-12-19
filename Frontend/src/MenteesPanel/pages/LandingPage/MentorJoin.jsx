"use client"
import { useNavigate } from "react-router-dom"

// Button component
const Button = ({ children, className = "", style = {}, ...props }) => (
  <button
    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 hover:opacity-90 ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export default function MentorJoin() {
  const navigate = useNavigate()
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8 py-12">
          <div className="inline-block">
            <span
              className="px-3 py-1 text-sm font-medium text-white rounded-full"
              style={{ backgroundColor: "#5D38DE" }}
            >
              Become a Mentor
            </span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Join Our Team –<br />
            Inspire Learners
            <br />
            Today!
          </h2>

          <Button onClick={() => navigate('/signup')} className="text-white px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#5D38DE" }}>
            Join our team
          </Button>
        </div>

        {/* Right Content - Mentor Image */}
        <div className="relative flex justify-end py-12">
          <div className="rounded-3xl py-0 px-4 relative " style={{ backgroundColor: "#5D38DE" }}>
            {/* Background decorative icons */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="absolute top-16 right-12">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <div className="absolute bottom-16 left-12">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="absolute top-24 right-8">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            {/* Mentor Image */}
            <div className="relative z-100 flex justify-center -mt-12 sm:-mt-16">
              <img
                src="/mentor.svg"
                alt="Professional mentor with glasses and beard"
                className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <img
                    src="/a.jpg"
                    alt="Mentor 1"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <img
                    src="/b.jpg"
                    alt="Mentor 2"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <img
                    src="/c.jpg"
                    alt="Mentor 3"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">250+</div>
                  <div className="text-xs text-gray-500">Experienced Mentors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
