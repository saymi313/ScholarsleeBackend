"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { mentorsAPI } from "../../../utils/api"
import NameAvatar from "../../../shared/components/NameAvatar"

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

export default function Mentor() {
  const navigate = useNavigate()
  const goToMentorDetails = (mentorId) => navigate(`/mentees/mentor-details/${mentorId}`)

  const [inputName, setInputName] = useState("")
  const [inputLocation, setInputLocation] = useState("")
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMentors()
  }, [])

  const loadMentors = async (filters = {}) => {
    try {
      setLoading(true)
      setError('')

      const params = { limit: 4, ...filters }
      const response = await mentorsAPI.getAll(params)

      if (response.data && response.data.success) {
        const mentorData = response.data.data?.mentors || response.data.data || []
        setMentors(mentorData)
      } else {
        setError(response.data?.message || "We couldn't load mentors right now. Please try again.")
      }
    } catch (err) {
      console.error('Landing mentors load error:', err)

      // Provide specific error messages based on error type
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('This is taking too long. Please check your internet and try again.')
      } else if (err.message?.includes('Network')) {
        setError("We couldn't reach the server. Please check your internet connection and try again.")
      } else {
        setError("We couldn't load mentors right now. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const filters = {}
    if (inputName.trim()) {
      filters.search = inputName.trim()
    }
    if (inputLocation.trim()) {
      filters.country = inputLocation.trim()
    }
    loadMentors(filters)
  }
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span
            className="px-3 py-1 text-sm font-medium text-white rounded-full"
            style={{ backgroundColor: "#5D38DE" }}
          >
            Our Mentors
          </span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Seeks guidance from top experts</h2>
        <p className="text-gray-600 text-lg">From application to arrival, mentors who make it happen</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row mb-12 max-w-7xl mx-auto gap-4 md:gap-0">
        <div className="flex-1 relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by the name of the mentor"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg md:rounded-r-none md:border-r-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Location"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg md:rounded-none md:border-l border-t md:border-t border-b md:border-b focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Button onClick={handleSearch} className="w-full md:w-auto text-white px-8 py-3 font-semibold rounded-lg md:rounded-l-none" style={{ backgroundColor: "#5D38DE" }}>
          Search Mentor
        </Button>
      </div>

      {/* Mentor Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading mentors...</p>
          </div>
        ) : error ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadMentors()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : mentors.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-600">No mentors found</p>
          </div>
        ) : (
          mentors.map((mentor) => {
            const firstName = mentor.userId?.profile?.firstName || 'Unknown'
            const lastName = mentor.userId?.profile?.lastName || ''
            const fullName = `${firstName} ${lastName}`.trim()
            const avatar = mentor.userId?.profile?.avatar
            const location = mentor.userId?.profile?.country || 'Location not specified'
            const title = mentor.title || 'Mentor'
            const ratingValue = Number(mentor.rating ?? 0)
            const rating = Number.isFinite(ratingValue) ? ratingValue.toFixed(1) : '0.0'
            const totalReviews = mentor.totalReviews ?? 0

            return (
              <div key={mentor._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <NameAvatar
                      src={avatar}
                      name={fullName}
                      size="w-full h-full"
                      textSize="text-3xl"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h3>
                    <p className="text-gray-600 mb-3">{title}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">⭐ {rating}</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
                        <div className="text-sm text-gray-500">Reviews</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">📍 {location}</p>
                    <button onClick={() => goToMentorDetails(mentor.slug || mentor._id)} className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                      View profile →
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* See All Button */}
      <div className="text-center">
        <Button
          onClick={() => navigate('/mentees/mentors')}
          className="text-white px-8 py-3 font-semibold"
          style={{ backgroundColor: "#5D38DE" }}
        >
          See all
        </Button>
      </div>
    </section>
  )
}
