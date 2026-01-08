"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { mentorsAPI } from "../../../utils/api"
import Background from "../../components/MentorDetailsComponents/Background"
// import Recommendations from "../../components/MentorDetailsComponents/Recommendations"
import Connections from "../../components/MentorDetailsComponents/Connections"
import Services from "../../components/MentorDetailsComponents/Services"
import SuccessStory from "../../components/MentorDetailsComponents/SuccessStory"
import Feedbacks from "../../components/MentorDetailsComponents/Feedbacks"
import ChatPrivacyPopup from "../../components/ChatsComponents/ChatPrivacyPopup"
import SEO from "../../../shared/components/SEO"
import { generateMentorSchema, generateBreadcrumbSchema } from "../../../shared/utils/schema"


const MentorDetails = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("Background")
  const [isFollowing, setIsFollowing] = useState(false)
  const navigate = useNavigate()
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false)
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [mentorData, setMentorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch mentor data on mount
  useEffect(() => {
    if (id) {
      loadMentorData()
    }
  }, [id])

  const loadMentorData = async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading mentor details for ID:', id)
      const response = await mentorsAPI.getById(id)
      console.log('🔍 Mentor details response:', response.data)

      if (response.data && response.data.success) {
        const mentor = response.data.data?.mentor || response.data.data
        console.log('📋 Mentor object:', mentor)
        console.log('👤 User ID:', mentor.userId?._id)
        console.log('📚 Services count:', mentor.services?.length || 0)
        console.log('📚 Services data:', mentor.services)
        setMentorData(mentor)
        console.log('✅ Mentor data loaded:', mentor)
      } else {
        setError(response.data?.message || 'Failed to load mentor details')
      }
    } catch (error) {
      console.error('Error loading mentor details:', error)
      setError('Failed to load mentor details')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { name: "Background", component: Background },
    // { name: "Recommendations", component: Recommendations },
    { name: "Connections", component: Connections },
    { name: "Services", component: Services },
    { name: "Success Story", component: SuccessStory },
    { name: "Feedbacks", component: Feedbacks },
  ]

  const renderActiveComponent = () => {
    const activeTabData = tabs.find((tab) => tab.name === activeTab)
    const Component = activeTabData?.component
    return Component ? <Component mentorData={mentorData} /> : <Background mentorData={mentorData} />
  }

  const handleContactClick = () => {
    if (mentorData) {
      const firstName = mentorData.userId?.profile?.firstName || 'Unknown'
      const lastName = mentorData.userId?.profile?.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      const avatar = mentorData.userId?.profile?.avatar || '/a.jpg'
      const mentorUserId = mentorData.userId?._id || mentorData.userId

      navigate(`/mentees/chats?mentorId=${mentorUserId}&name=${encodeURIComponent(fullName)}&avatar=${encodeURIComponent(avatar)}`)
    }
  }

  const handleAcceptPrivacy = () => {
    if (mentorData) {
      const firstName = mentorData.userId?.profile?.firstName || 'Unknown'
      const lastName = mentorData.userId?.profile?.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      const avatar = mentorData.userId?.profile?.avatar || '/u.jpeg'
      navigate(`/mentees/chats?name=${encodeURIComponent(fullName)}&avatar=${encodeURIComponent(avatar)}`)
    } else {
      navigate("/mentees/chats")
    }
    setShowPrivacyPopup(false)
  }

  const handleClosePrivacy = () => {
    setShowPrivacyPopup(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor details...</p>
        </div>
      </div>
    )
  }

  if (error || !mentorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Mentor not found'}</p>
          <button
            onClick={() => navigate('/mentees/mentors')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Mentors
          </button>
        </div>
      </div>
    )
  }

  // Extract mentor data
  const firstName = mentorData.userId?.profile?.firstName || 'Unknown'
  const lastName = mentorData.userId?.profile?.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const avatar = mentorData.userId?.profile?.avatar || '/u.jpeg'
  const location = mentorData.userId?.profile?.country || mentorData.location || 'Location not specified'
  const title = mentorData.title || 'Mentor'
  const bio = mentorData.bio || ''
  const experience = mentorData.experience || []
  const education = mentorData.education || []
  const latestExperience = experience[0]
  const latestEducation = education[0]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <SEO
        title={`${mentorData?.fullName || 'Mentor'} - Scholarslee`}
        description={mentorData?.bio || 'Learn from expert mentors.'}
        image={mentorData?.avatar}
        schema={[
          generateMentorSchema(mentorData),
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Mentors", url: "/mentees/mentors" },
            { name: mentorData?.fullName || "Mentor", url: `/mentees/mentor-details/${id}` }
          ])
        ]}
      />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a] text-white relative overflow-hidden">
        {/* Back Button */}
        <div className="container mx-auto px-3 sm:px-6 pt-4">
          <button
            onClick={() => navigate('/mentees/mentors')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-wider">Back to Mentors</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            {/* Dashed circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-dashed border-white/30 rounded-full"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-dashed border-white/40 rounded-full"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-2 border-dashed border-white/50 rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 min-w-0">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center gap-4 sm:gap-6 min-w-0 w-full">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
                <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
              </div>
              <div className="w-full">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-1 sm:mb-2">{fullName}</h1>
                <p className="text-gray-300 mb-2 sm:mb-4 text-sm sm:text-base truncate">{title}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{location}</p>
                <div className="flex flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center lg:justify-start">
                  <button
                    onClick={handleContactClick}
                    className="bg-[#5D38DE] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-[#4A2BC7] transition-colors shadow-sm"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => setIsFollowing((prev) => !prev)}
                    className="border border-white/30 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    aria-pressed={isFollowing}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="lg:ml-auto w-full lg:w-auto">
              <div className="bg-white text-gray-900 rounded-lg p-4 sm:p-6 shadow-lg max-w-md w-full">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-1 sm:mb-2">Previous</h3>
                    {latestExperience ? (
                      <>
                        <p className="font-medium">{latestExperience.position}</p>
                        <p className="text-sm text-gray-500">{latestExperience.company}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No previous experience listed</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-1 sm:mb-2">Education</h3>
                    {latestEducation ? (
                      <>
                        <p className="font-medium">{latestEducation.degree} - {latestEducation.institution}</p>
                        <p className="text-sm text-gray-500">{latestEducation.field}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No education listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-8 max-w-6xl min-w-0">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Mobile Dropdown */}
          <div className="px-4 py-4 border-b border-gray-200 sm:hidden">
            <div className="max-w-xs w-full mx-auto">
              <p className="block text-xs font-medium text-gray-500 mb-2">Browse sections</p>
              <div className="relative">
                <button
                  onClick={() => setMobileTabsOpen((v) => !v)}
                  className="w-full bg-white/90 backdrop-blur border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
                >
                  <span>{activeTab}</span>
                  <svg className={`h-5 w-5 text-gray-500 transition-transform ${mobileTabsOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd" />
                  </svg>
                </button>
                {mobileTabsOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.name}
                        onClick={() => { setActiveTab(tab.name); setMobileTabsOpen(false) }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${activeTab === tab.name ? 'bg-[#eef2ff] text-[#5D38DE] font-semibold' : 'text-gray-700'}`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-2 text-[11px] text-gray-500 text-center">Quickly jump to sections</p>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto hidden sm:block">
            <div className="flex gap-4 sm:gap-8 px-4 sm:px-8 pt-4 sm:pt-6 whitespace-nowrap">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.name
                    ? "border-[#5D38DE] text-[#5D38DE]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 min-w-0">{renderActiveComponent()}</div>
        </div>
      </div>

      <ChatPrivacyPopup
        isOpen={showPrivacyPopup}
        onClose={handleClosePrivacy}
        onAccept={handleAcceptPrivacy}
      />
    </div>
  )
}

export default MentorDetails
