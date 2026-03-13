import { useState, useEffect } from "react"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import BadgesHeader from "../../components/BadgesComponents/BadgesHeader"
import BadgeGrid from "../../components/BadgesComponents/BadgeGrid"
import CurrentBadge from "../../components/BadgesComponents/CurrentBadge"
import { badgesAPI } from "../../../utils/api"

const Badges = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBadges()
  }, [])

  const loadBadges = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await badgesAPI.getAllBadges()

      if (response.data && response.data.success) {
        const badgesData = response.data.data?.badges || []

        // Map badges to the format expected by BadgeGrid
        const mappedBadges = badgesData.map((badge, index) => ({
          id: index + 1,
          name: badge.name,
          color: getBadgeColor(badge.name),
          unlocked: badge.unlocked,
          isCurrent: badge.isCurrent,
          description: badge.description,
          threshold: badge.threshold
        }))

        setBadges(mappedBadges)
      } else {
        setError(response.data?.message || "We couldn't load your badges. Please refresh the page.")
      }
    } catch (err) {
      console.error('Error loading badges:', err)
      setError(err.message || "We couldn't load your badges. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (badgeName) => {
    const colorMap = {
      'Beginner': 'gray',
      'Level 1 Seller': 'cyan',
      'Level 2 Seller': 'orange', // Changed from silver to orange for better visibility
      'Best Seller': 'gold'
    }
    return colorMap[badgeName] || 'gray'
  }

  return (
    <div className="flex h-screen bg-[#111111] text-white font-['Poppins'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col transition-all duration-300 h-screen overflow-hidden">
        <TopBar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-full pb-20">
          <BadgesHeader />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content - Scrollable */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="ml-4 text-gray-400">Loading badges...</p>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                  <p>{error}</p>
                  <button
                    onClick={loadBadges}
                    className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-white text-xl font-semibold mb-6">Your Badges</h2>
                  <BadgeGrid badges={badges} />
                </div>
              )}
            </div>

            {/* Right Sidebar - Sticky */}
            <div className="lg:w-80">
              <div className="lg:sticky lg:top-6">
                <CurrentBadge />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Badges
