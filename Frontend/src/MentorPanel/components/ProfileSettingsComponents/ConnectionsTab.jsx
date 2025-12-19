"use client"

import { useState, useEffect } from "react"
import { UserPlus, UserMinus, Search } from "lucide-react"
import { profileAPI } from "../../../utils/api"

const ConnectionsTab = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: "",
    title: "",
    image: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70)
  })
  const [connections, setConnections] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileAPI.mentor.get()
        if (res.data?.success) {
          const conns = res.data.data.profile?.connections || []
          const mapped = conns.map((u) => ({
            id: u._id,
            name: `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || 'Connection',
            title: u.email || '',
            image: u.profile?.avatar || "",
            isFollowing: true,
            mutualConnections: 0
          }))
          setConnections(mapped)
        }
      } catch {}
    }
    load()
  }, [])

  const toggleFollow = (id) => {
    setConnections(connections.map((conn) => (conn.id === id ? { ...conn, isFollowing: !conn.isFollowing } : conn)))
  }

  const handleAddConnection = () => {
    if (newConnection.name && newConnection.title) {
      const connection = {
        id: Date.now(),
        name: newConnection.name,
        title: newConnection.title,
        image: newConnection.image,
        isFollowing: false,
        mutualConnections: Math.floor(Math.random() * 20) + 1
      }
      setConnections([...connections, connection])
      setNewConnection({
        name: "",
        title: "",
        image: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70)
      })
      setShowAddModal(false)
    } else {
      alert("Please fill in all required fields")
    }
  }

  const filteredConnections = connections.filter((conn) => conn.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#5D38DE]/20 to-[#1a1a1a] rounded-xl p-6 border border-[#5D38DE]/30">
          <div className="text-4xl font-bold text-white mb-2">{connections.filter((c) => c.isFollowing).length}</div>
          <div className="text-gray-400">Following</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-[#1a1a1a] rounded-xl p-6 border border-blue-500/30">
          <div className="text-4xl font-bold text-white mb-2">{connections.length}</div>
          <div className="text-gray-400">Total Connections</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-[#1a1a1a] rounded-xl p-6 border border-green-500/30">
          <div className="text-4xl font-bold text-white mb-2">
            {connections.reduce((sum, c) => sum + c.mutualConnections, 0)}
          </div>
          <div className="text-gray-400">Mutual Connections</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className="w-full bg-[#242424] text-white rounded-xl pl-12 pr-4 py-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#5D38DE] text-white rounded-xl hover:bg-[#4d2ec4] transition-colors flex items-center gap-2 justify-center"
          >
            <UserPlus className="w-5 h-5" />
            Add Connection
          </button>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className="bg-[#242424] rounded-xl p-5 border border-[#3a3a3a] hover:border-[#5D38DE]/50 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={connection.image || "/placeholder.svg"}
                  alt={connection.name}
                  className="w-20 h-20 rounded-full border-4 border-[#5D38DE] mb-3"
                />
                <h3 className="text-white font-semibold mb-1">{connection.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{connection.title}</p>
                <p className="text-xs text-gray-500 mb-4">{connection.mutualConnections} mutual connections</p>
                <button
                  onClick={() => toggleFollow(connection.id)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    connection.isFollowing
                      ? "bg-[#242424] text-white border border-[#3a3a3a] hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30"
                      : "bg-[#5D38DE] text-white hover:bg-[#4d2ec4]"
                  }`}
                >
                  {connection.isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Connection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                  className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={newConnection.title}
                  onChange={(e) => setNewConnection({...newConnection, title: e.target.value})}
                  className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
                  placeholder="e.g., Software Engineer at Google"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleAddConnection}
                className="flex-1 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
              >
                Add Connection
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionsTab
