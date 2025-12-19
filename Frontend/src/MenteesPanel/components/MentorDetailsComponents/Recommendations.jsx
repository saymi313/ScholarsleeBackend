"use client"

import React, { useState } from "react"

const Recommendations = ({ mentorData }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const recommendations = mentorData?.recommendations || []
  
  const testimonials = recommendations.length > 0 ? recommendations.map((rec, index) => ({
    id: index + 1,
    name: rec.fromName || 'Anonymous',
    title: '', // Not in backend model
    image: '/u.jpeg', // Default avatar
    text: rec.text || '',
    rating: rec.rating || 5
  })) : [
    {
      id: 1,
      name: "No recommendations yet",
      title: "",
      image: "/u.jpeg",
      text: "This mentor hasn't received any recommendations yet.",
      rating: 0
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Irregular purple background shape */}
      <div className="absolute right-20 top-[60%] transform -translate-y-1/2 translate-x-28 z-0">
        <svg width="400" height="300" viewBox="0 0 600 500" className="text-[#5D38DE]">
          <path
            d="M150 50C250 20 350 80 450 120C520 150 580 200 580 280C580 360 520 420 450 450C350 490 250 480 150 450C80 420 20 360 20 280C20 200 80 80 150 50Z"
            fill="currentColor"
            opacity="1"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        

        {/* Testimonials Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:left-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition-transform duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Card with stacked effect */}
          <div className="relative w-full max-w-2xl mx-6 md:mx-20">
            {/* Background stacked cards */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-md transform translate-x-4 translate-y-4 opacity-50"></div>
            <div className="absolute inset-0 bg-white rounded-2xl shadow-md transform translate-x-2 translate-y-2 opacity-70"></div>

            {/* Active Card */}
            <div className="relative bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center text-center">
              {/* Profile image overlapping top */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white -mt-16 mb-4 shadow-md">
                <img
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{testimonials[currentIndex].name}</h3>
              <p className="text-gray-500 text-sm mb-4">{testimonials[currentIndex].title}</p>
              <p className="text-gray-700 leading-relaxed text-sm">{testimonials[currentIndex].text}</p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:right-10 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition-transform duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-6 bg-[#5D38DE]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Recommendations
