import React from 'react'
import { useNavigate } from 'react-router-dom'

// Star component
const Star = ({ filled = true, className = "" }) => (
  <svg
    className={`w-4 h-4 ${filled ? "star-filled" : "star-half"} ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

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

export default function HeroSection() {
  const navigate = useNavigate()
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-18">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-3 py-1 primary-bg rounded-full text-sm font-medium text-white">Expert Mentors</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Get accepted, get coached, <span className="hero-underline">go study abroad</span>
            </h1>
          </div>

          {/* Reviews Section */}
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              <img
                src="/a.jpg"
                alt="Mentor 1"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="/b.jpg"
                alt="Mentor 2"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="/c.jpg"
                alt="Mentor 3"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star filled={true} />
                <Star filled={true} />
                <Star filled={true} />
                <Star filled={true} />
                <Star filled={false} />
              </div>
              <span className="text-gray-600 font-medium">2.5K Reviews</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full sm:w-auto text-white px-8 py-3 text-lg font-semibold primary-hover"
            style={{ backgroundColor: "#5D38DE" }}
            onClick={() => navigate('/mentees/mentor')}
          >
            Explore Mentors
          </Button>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative">
          <div className="relative z-10">
            <img
              src="/header.webp"
              alt="Happy students giving thumbs up"
              className="w-full h-auto"
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          <div className="absolute top-16 right-12 w-8 h-8 primary-bg rounded transform rotate-12 animate-bounce"></div>

          <div className="absolute bottom-16 left-4 w-10 h-10 bg-blue-400 rounded-lg transform -rotate-12 animate-pulse"></div>

          <div className="absolute bottom-8 right-8 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </div>
    </main>
  )
}
