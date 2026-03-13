import React, { useState, useEffect } from 'react'
import { mentorsAPI } from '../../../utils/api'
import { ChevronLeft, ChevronRight, Loader2, Users, UserPlus } from 'lucide-react'
import MenteeProfileModal from '../../../MentorPanel/components/ChatsComponents/MenteeProfileModal'

const Connections = ({ mentorData }) => {
  const [activeTab, setActiveTab] = useState('followers')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  const [selectedMenteeId, setSelectedMenteeId] = useState(null)

  useEffect(() => {
    if (mentorData?._id) {
      loadData(1)
    }
  }, [mentorData?._id, activeTab])

  const loadData = async (page) => {
    try {
      setLoading(true)
      let response;

      if (activeTab === 'students') {
        response = await mentorsAPI.getStudents(mentorData._id, { page, limit: 12 })
      } else {
        response = await mentorsAPI.getFollowers(mentorData._id, { page, limit: 12 })
      }

      if (response.data.success) {
        // Handle different data structures if needed, but currently both return similar user objects
        const list = activeTab === 'students'
          ? response.data.data.students
          : response.data.data.followers;

        setData(list)
        setPagination(response.data.data.pagination)
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}:`, err)
      setError(`We couldn't load your ${activeTab}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadData(newPage)
    }
  }

  const renderContent = () => {
    if (loading && pagination.current === 1) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#5D38DE] animate-spin" />
        </div>
      )
    }

    if (error) {
      return <div className="text-red-500 py-12 text-center">{error}</div>
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'students' ? (
              <Users className="w-8 h-8 text-gray-400" />
            ) : (
              <UserPlus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-gray-900 font-medium mb-1">
            {activeTab === 'students' ? 'No students connected yet' : 'No followers yet'}
          </p>
          <p className="text-sm text-gray-500">
            {activeTab === 'students'
              ? 'Students who book sessions will appear here'
              : 'Users who follow this mentor will appear here'}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedMenteeId(user._id)}
            className="flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-[#5D38DE] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-50 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              {user.profile?.avatar ? (
                <img
                  src={user.profile.avatar}
                  alt={`${user.profile.firstName} ${user.profile.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl">
                  {user.profile?.firstName?.[0] || 'U'}
                </div>
              )}
            </div>

            <div className="ml-4 min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#5D38DE] transition-colors">
                {user.profile?.firstName} {user.profile?.lastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {user.profile?.country || 'Global'}
                {activeTab === 'students' ? ' • Student' : ' • Follower'}
              </p>
              <div className="text-xs text-gray-400 mt-1">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('followers')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'followers'
            ? 'bg-white text-[#5D38DE] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <UserPlus className="w-4 h-4" />
          Followers
          {(activeTab === 'followers' && pagination.total > 0) && (
            <span className="bg-[#5D38DE]/10 text-[#5D38DE] px-2 py-0.5 rounded-full text-xs ml-1">
              {pagination.total}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'students'
            ? 'bg-white text-[#5D38DE] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <Users className="w-4 h-4" />
          Students
          {(activeTab === 'students' && pagination.total > 0) && (
            <span className="bg-[#5D38DE]/10 text-[#5D38DE] px-2 py-0.5 rounded-full text-xs ml-1">
              {pagination.total}
            </span>
          )}
        </button>
      </div>

      {renderContent()}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {pagination.current} of {pagination.pages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mentee Profile Modal */}
      {selectedMenteeId && (
        <MenteeProfileModal
          menteeId={selectedMenteeId}
          onClose={() => setSelectedMenteeId(null)}
        />
      )}
    </div>
  )
}

export default Connections
