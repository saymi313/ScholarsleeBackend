"use client"

import React, { useState } from "react"

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Computer Science, University of Toronto",
      image: "/testimonial-priya.png",
      text: "Scholarslee completely transformed my study abroad journey. My mentor helped me navigate the complex application process, refine my statement of purpose, and prepare for interviews. Thanks to their guidance, I received admission to my dream university with a scholarship. The personalized attention and expert advice made all the difference!",
    },
    {
      id: 2,
      name: "James Wilson",
      title: "Business Analytics, London School of Economics",
      image: "/testimonial-james.png",
      text: "I was overwhelmed with the visa process and university applications until I connected with my mentor on Scholarslee. They provided step-by-step guidance, helped me understand financial requirements, and even connected me with alumni from my target universities. I'm now studying at LSE, and I couldn't have done it without their support!",
    },
    {
      id: 3,
      name: "Aisha Rahman",
      title: "International Relations, Sciences Po Paris",
      image: "/testimonial-aisha.png",
      text: "Finding the right mentor through Scholarslee was a game-changer for me. My mentor had studied at Sciences Po and understood exactly what the admissions committee was looking for. They helped me craft a compelling application that highlighted my unique perspective. I'm forever grateful for their mentorship and guidance throughout this journey.",
    },
    {
      id: 4,
      name: "Carlos Mendez",
      title: "Mechanical Engineering, TU Munich",
      image: "/testimonial-carlos.png",
      text: "The mentorship I received was invaluable. From choosing the right universities to preparing for language proficiency tests, my mentor guided me through every step. They also helped me secure funding through scholarships and taught me how to manage finances while studying abroad. Scholarslee truly delivers on its promise!",
    },
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
    <section className="py-12 lg:py-20 px-4 bg-white relative overflow-hidden">
      {/* Irregular purple background shape */}
      <div className="absolute right-0 top-[60%] transform -translate-y-1/2 translate-x-32 z-0">
        <svg width="600" height="500" viewBox="0 0 600 500" className="text-[#5D38DE]">
          <path
            d="M150 50C250 20 350 80 450 120C520 150 580 200 580 280C580 360 520 420 450 450C350 490 250 480 150 450C80 420 20 360 20 280C20 200 80 80 150 50Z"
            fill="currentColor"
            opacity="1"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#5D38DE]/10 text-[#5D38DE] px-6 py-2 rounded-full text-sm font-medium mb-6">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Proof that guidance changes everything
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Read how students just like you turned uncertainty into confidence, and applications into acceptance letters
            with Scholarslee.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:left-10 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition-transform duration-200"
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
            <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col items-center text-center">
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
            className="absolute right-0 md:right-10 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition-transform duration-200"
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
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-[#5D38DE]" : "w-2 bg-gray-300"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
