"use client"

import React, { useState, useEffect } from "react"
import { Users, UserPlus, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react"
import { mentorsAPI, profileAPI } from "../../../utils/api"
import MenteeProfileModal from "../../components/ChatsComponents/MenteeProfileModal"

const ConnectionsTab = () => {
  const [activeTab, setActiveTab] = useState('followers')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mentorId, setMentorId] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  // Stats for the cards
  const [stats, setStats] = useState({
    followers: 0,
    students: 0
  })

  const [selectedMenteeId, setSelectedMenteeId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch Mentor ID first
  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await profileAPI.mentor.get()
        if (response.data?.success) {
          const profile = response.data.data.profile || response.data.data
          setMentorId(profile._id)
          // Also optimize by setting initial stats if available, or fetch counts separately
        }
      } catch (err) {
        console.error("Failed to fetch mentor profile:", err)
        setError("We couldn't load your profile. Please refresh the page.")
      }
    }
    fetchMentorProfile()
  }, [])

  // Fetch list data once we have mentor ID
  useEffect(() => {
    if (mentorId) {
      loadData(1)
      loadingStats()
    }
  }, [mentorId, activeTab])

  const loadingStats = async () => {
    try {
      // Parallel requests for counts
      const [followersRes, studentsRes] = await Promise.all([
        mentorsAPI.getFollowers(mentorId, { limit: 1 }),
        mentorsAPI.getStudents(mentorId, { limit: 1 })
      ])

      setStats({
        followers: followersRes.data?.data?.pagination?.total || 0,
        students: studentsRes.data?.data?.pagination?.total || 0
      })
    } catch (e) {
      console.error("Failed to load stats", e)
    }
  }

  const loadData = async (page) => {
    try {
      setLoading(true)
      let response;

      const params = { page, limit: 12 }
      if (searchQuery) {
        // If searching, we might need a search endpoint or client-side filter
        // For now, let's assume client-side filtering on current page or ignore search on server
        // Ideally backend supports search query
      }

      if (activeTab === 'students') {
        response = await mentorsAPI.getStudents(mentorId, params)
      } else {
        response = await mentorsAPI.getFollowers(mentorId, params)
      }

      console.log('ConnectionsTab response:', response.data);

      if (response.data.success) {
        const list = (activeTab === 'students'
          ? response.data.data.students
          : response.data.data.followers) || [];

        console.log('Parsed list:', list);

        setData(list)
        setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0 })
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}:`, err)
      setError(`Failed to load ${activeTab}. Please try again.`)
      setData([]) // reset data on error so length check doesn't fail if it was undefined
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadData(newPage)
    }
  }

  // Filter local data if search query exists (until backend search support)
  const filteredData = searchQuery
    ? data.filter(u =>
      (u.profile?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.profile?.lastName || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    : data

  const renderContent = () => {
    if (loading && pagination.current === 1) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#5D38DE] animate-spin" />
        </div>
      )
    }

    if (error && (!data || !data.length)) {
      return <div className="text-red-500 py-12 text-center">{error}</div>
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-sm">
          <div className="w-16 h-16 bg-[#242424] rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'students' ? (
              <Users className="w-8 h-8 text-gray-400" />
            ) : (
              <UserPlus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-white font-medium mb-1">
            {activeTab === 'students' ? 'No students yet' : 'No followers yet'}
          </p>
          <p className="text-sm text-gray-400">
            {activeTab === 'students'
              ? 'Students who book your sessions will appear here'
              : 'Users who follow you will appear here'}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedMenteeId(user._id)}
            className="flex items-center p-4 bg-[#242424] border border-[#3a3a3a] rounded-xl hover:border-[#5D38DE] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#1a1a1a] overflow-hidden border-2 border-[#3a3a3a] shadow-sm flex-shrink-0">
              {user.profile?.avatar ? (
                <img
                  src={user.profile.avatar}
                  alt={`${user.profile.firstName} ${user.profile.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a] text-gray-400 font-bold text-xl">
                  {user.profile?.firstName?.[0] || 'U'}
                </div>
              )}
            </div>

            <div className="ml-4 min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate group-hover:text-[#5D38DE] transition-colors">
                {user.profile?.firstName} {user.profile?.lastName}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {user.profile?.country || 'Global'}
                {activeTab === 'students' ? ' • Student' : ' • Follower'}
              </p>
              <div className="text-xs text-gray-500 mt-1">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`bg-gradient-to-br from-[#5D38DE]/20 to-[#1a1a1a] rounded-xl p-6 border ${activeTab === 'followers' ? 'border-[#5D38DE]' : 'border-[#5D38DE]/30'} cursor-pointer transition-all hover:border-[#5D38DE]`}
          onClick={() => setActiveTab('followers')}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{stats.followers}</div>
              <div className="text-gray-400 font-medium">Followers</div>
            </div>
            <div className="p-3 bg-[#5D38DE]/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-[#5D38DE]" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br from-blue-500/20 to-[#1a1a1a] rounded-xl p-6 border ${activeTab === 'students' ? 'border-blue-500' : 'border-blue-500/30'} cursor-pointer transition-all hover:border-blue-500`}
          onClick={() => setActiveTab('students')}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{stats.students}</div>
              <div className="text-gray-400 font-medium">Students</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls & List */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white self-start md:self-center">
            {activeTab === 'students' ? 'Your Students' : 'Your Followers'}
          </h2>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-[#242424] text-white rounded-xl pl-10 pr-4 py-2 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm"
            />
          </div>
        </div>

        {renderContent()}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="p-2 rounded-full border border-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-400">
              Page {pagination.current} of {pagination.pages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="p-2 rounded-full border border-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

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

export default ConnectionsTab
