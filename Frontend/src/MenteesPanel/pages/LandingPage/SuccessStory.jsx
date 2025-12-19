import React, { useState, useEffect } from 'react'
import ReactCountryFlag from 'react-country-flag'

export default function SuccessStory() {
  const [successStories, setSuccessStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const successStoriesData = [
      {
        name: "Sophie Anderson",
        country: "Australia",
        countryCode: "AU",
        university: "DEAKIN UNIVERSITY",
        universityLogo: "/uni1.png",
        image: "/success-australia.png",
      },
      {
        name: "Liam Thompson",
        country: "Canada",
        countryCode: "CA",
        university: "YORK UNIVERSITY",
        universityLogo: "/uni2.png",
        image: "/success-canada.png",
      },
      {
        name: "Oliver Bennett",
        country: "UK",
        countryCode: "GB",
        university: "UNIVERSITY OF WARWICK",
        universityLogo: "/uni3.png",
        image: "/success-uk.png",
      },
      {
        name: "Ahmed Al-Mansoori",
        country: "UAE",
        countryCode: "AE",
        university: "HERIOT WATT UNIVERSITY",
        universityLogo: "/uni4.png",
        image: "/success-uae.png",
      },
    ]

    setTimeout(() => {
      setSuccessStories(successStoriesData)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our success stories</h2>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </section>
    )
  }

  if (error) {
    console.error('Error fetching success stories:', error)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our success stories</h2>
      </div>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {successStories.map((story, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-500 hover:shadow-blue-200 cursor-pointer">
            {/* Country Flag */}
            <div className="absolute top-4 right-4">
              <ReactCountryFlag
                countryCode={story.countryCode}
                svg
                style={{
                  width: '2em',
                  height: '2em',
                }}
                title={story.country}
              />
            </div>

            {/* Student Image */}
            <div className="mb-6">
              <img
                src={story.image || "/placeholder.svg"}
                alt={story.name}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            {/* Student Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{story.name}</h3>
                <img
                  src={story.universityLogo || "/placeholder.svg"}
                  alt={story.university}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-gray-600">{story.country}</p>
              <div className="pt-4 border-t border-gray-100"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
