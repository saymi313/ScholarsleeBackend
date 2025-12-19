import { useState, useEffect } from "react"
import { badgesAPI } from "../../../utils/api"
import './badgeAnimations.css'

const CurrentBadge = () => {
  const [badgeData, setBadgeData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBadgeData()
  }, [])

  const loadBadgeData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [badgeResponse, progressResponse] = await Promise.all([
        badgesAPI.getMentorBadge(),
        badgesAPI.getBadgeProgress()
      ])
      
      if (badgeResponse.data?.success) {
        setBadgeData(badgeResponse.data.data)
      }
      
      if (progressResponse.data?.success) {
        setProgressData(progressResponse.data.data)
      }
    } catch (err) {
      console.error('Error loading badge data:', err)
      setError(err.message || 'Failed to load badge data')
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (badgeName) => {
    const colorMap = {
      'Beginner': 'linear-gradient(135deg, #757575 0%, #bdbdbd 100%)',
      'Level 1 Seller': 'linear-gradient(135deg, #4dd0e1 0%, #b2ebf2 100%)',
      'Level 2 Seller': 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
      'Best Seller': 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
    }
    return colorMap[badgeName] || 'linear-gradient(135deg, #757575 0%, #bdbdbd 100%)'
  }

  if (loading) {
    return (
      <div className="bg-[#242424] rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          <div className="h-48 bg-gray-700 rounded mb-6"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#242424] rounded-xl p-6">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadBadgeData}
          className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentBadge = badgeData?.badge || 'Beginner'
  const completedBookings = progressData?.completedBookings || 0
  const progress = progressData?.progress || 0
  const requiredBookings = progressData?.requiredBookings || 0
  const nextBadge = progressData?.nextBadge
  const nextThreshold = progressData?.nextThreshold || 0
  const description = badgeData?.description || progressData?.description || ''
  
    return (
      <div className="bg-[#242424] rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-6">Your Current Badge</h3>
  
        {/* Badge Display */}
        <div className="flex justify-center mb-6 relative">
          {/* Enhanced Glow Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-40 h-40 rounded-full blur-3xl animate-pulse"
              style={{
                background: currentBadge === 'Beginner' ? 'rgba(189, 189, 189, 0.3)' :
                           currentBadge === 'Level 1 Seller' ? 'rgba(0, 188, 212, 0.4)' :
                           currentBadge === 'Level 2 Seller' ? 'rgba(255, 87, 34, 0.4)' :
                           'rgba(255, 179, 0, 0.5)'
              }}
            ></div>
          </div>

          {/* Sparkle particles around badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 relative">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full badge-sparkle" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-8 right-12 w-2 h-2 bg-white rounded-full badge-sparkle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-12 left-12 w-2 h-2 bg-white rounded-full badge-sparkle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-8 right-8 w-2 h-2 bg-white rounded-full badge-sparkle" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>

          {/* Main Badge - Hexagon Shape */}
          <div
            className="relative w-48 h-48 flex items-center justify-center z-10 badge-float"
            style={{
              background: getBadgeColor(currentBadge),
              boxShadow: `0 0 40px ${currentBadge === 'Beginner' ? 'rgba(189, 189, 189, 0.5)' :
                                   currentBadge === 'Level 1 Seller' ? 'rgba(0, 188, 212, 0.6)' :
                                   currentBadge === 'Level 2 Seller' ? 'rgba(255, 87, 34, 0.6)' :
                                   'rgba(255, 179, 0, 0.7)'}, 0 0 80px ${currentBadge === 'Beginner' ? 'rgba(189, 189, 189, 0.3)' :
                                   currentBadge === 'Level 1 Seller' ? 'rgba(0, 188, 212, 0.4)' :
                                   currentBadge === 'Level 2 Seller' ? 'rgba(255, 87, 34, 0.4)' :
                                   'rgba(255, 179, 0, 0.5)'}`,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {/* Shimmer effect overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                animation: 'badgeShimmer 4s infinite',
              }}
            />
            {/* Hexagon Shape with Achievement Icon */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50 5, 90 30, 90 70, 50 95, 10 70, 10 30"
                  fill="rgba(255,255,255,0.4)"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="3"
                />
                
                {/* Achievement Icon - Different design based on badge level */}
                <g transform="translate(50, 50)" className="badge-rotate">
                  {currentBadge === 'Beginner' && (
                    <>
                      {/* Beginner: Sprout/Seed shape - starting point */}
                      {/* Stem */}
                      <rect x="-1.5" y="3" width="3" height="9" rx="1.5" fill="rgba(255,255,255,0.9)" />
                      {/* Leaf 1 */}
                      <ellipse cx="-6" cy="0" rx="4.5" ry="7.5" fill="rgba(255,255,255,0.95)" transform="rotate(-30 -6 0)" />
                      {/* Leaf 2 */}
                      <ellipse cx="6" cy="0" rx="4.5" ry="7.5" fill="rgba(255,255,255,0.95)" transform="rotate(30 6 0)" />
                      {/* Seed base */}
                      <ellipse cx="0" cy="9" rx="4.5" ry="3" fill="rgba(255,255,255,0.8)" />
                      {/* Sparkles */}
                      <circle cx="-15" cy="-15" r="2" fill="rgba(255,255,255,0.9)" className="badge-sparkle" />
                      <circle cx="15" cy="-15" r="2" fill="rgba(255,255,255,0.9)" style={{ animationDelay: '0.5s' }} className="badge-sparkle" />
                      <circle cx="0" cy="15" r="2" fill="rgba(255,255,255,0.9)" style={{ animationDelay: '1s' }} className="badge-sparkle" />
                    </>
                  )}
                  {currentBadge === 'Level 1 Seller' && (
                    <>
                      {/* Level 1: Single Star - first achievement */}
                      <path
                        d="M0,-18 L4.5,-4.5 L13.5,-4.5 L6.75,1.5 L9,11.5 L0,6 L-9,11.5 L-6.75,1.5 L-13.5,-4.5 L-4.5,-4.5 Z"
                        fill="rgba(255,255,255,0.95)"
                        stroke="rgba(255,255,255,1)"
                        strokeWidth="1.5"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))' }}
                      />
                      <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,1)" />
                      {/* Glow particles */}
                      <circle cx="-12" cy="-12" r="1.5" fill="rgba(255,255,255,0.7)" className="badge-pulse" />
                      <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.7)" style={{ animationDelay: '1s' }} className="badge-pulse" />
                    </>
                  )}
                  {currentBadge === 'Level 2 Seller' && (
                    <>
                      {/* Level 2: Flag shape - milestone reached */}
                      {/* Flag pole */}
                      <rect x="-1.5" y="-15" width="3" height="27" rx="1.5" fill="rgba(255,255,255,0.95)" />
                      {/* Flag */}
                      <polygon
                        points="-1.5,-15 12,-15 12,-3 -1.5,-3"
                        fill="rgba(255,255,255,0.95)"
                        stroke="rgba(255,255,255,1)"
                        strokeWidth="1.5"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }}
                      />
                      {/* Flag tip */}
                      <polygon
                        points="12,-15 18,-9 12,-3"
                        fill="rgba(255,255,255,0.9)"
                      />
                      {/* Decorative stripe on flag */}
                      <line x1="-1.5" y1="-9" x2="12" y2="-9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                      {/* Orbiting particles */}
                      <circle cx="0" cy="-20" r="2" fill="rgba(255,255,255,0.8)" className="badge-orbit" />
                      <circle cx="0" cy="20" r="2" fill="rgba(255,255,255,0.8)" style={{ animationDelay: '1.5s' }} className="badge-orbit" />
                    </>
                  )}
                  {currentBadge === 'Best Seller' && (
                    <>
                      {/* Best Seller: Crown shape - highest achievement */}
                      {/* Crown base */}
                      <path
                        d="M-12,6 L-6,-9 L0,-3 L6,-9 L12,6 L9,6 L9,12 L-9,12 L-9,6 Z"
                        fill="rgba(255,255,255,0.95)"
                        stroke="rgba(255,255,255,1)"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,1))' }}
                      />
                      {/* Crown jewels */}
                      <circle cx="-6" cy="-6" r="3" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,1))' }} className="badge-pulse" />
                      <circle cx="0" cy="-1.5" r="3.5" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,1))', animationDelay: '0.3s' }} className="badge-pulse" />
                      <circle cx="6" cy="-6" r="3" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,1))', animationDelay: '0.6s' }} className="badge-pulse" />
                      {/* Sparkle effects around crown */}
                      <circle cx="-18" cy="-12" r="2" fill="rgba(255,255,255,0.9)" className="badge-sparkle" />
                      <circle cx="18" cy="-12" r="2" fill="rgba(255,255,255,0.9)" style={{ animationDelay: '0.5s' }} className="badge-sparkle" />
                      <circle cx="0" cy="18" r="2" fill="rgba(255,255,255,0.9)" style={{ animationDelay: '1s' }} className="badge-sparkle" />
                    </>
                  )}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Badge Name */}
        <h2 className={`text-2xl font-bold text-center mb-2 transition-all duration-300 ${
          currentBadge === 'Beginner' ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(189,189,189,0.6)]' :
          currentBadge === 'Level 1 Seller' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,188,212,0.6)]' :
          currentBadge === 'Level 2 Seller' ? 'text-orange-300 drop-shadow-[0_0_10px_rgba(255,87,34,0.6)]' :
          'text-yellow-300 drop-shadow-[0_0_12px_rgba(255,179,0,0.7)]'
        }`}>
          {currentBadge}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">{description}</p>

        {/* Progress Bar */}
        {nextBadge ? (
          <div className="space-y-4">
            {/* Completed Bookings Info */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5D38DE] to-[#7c3aed] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{completedBookings}</span>
                </div>
                <div>
                  <span className="text-white text-sm font-semibold">Completed Bookings</span>
                  <p className="text-gray-400 text-xs">Next: {nextBadge}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#5D38DE] text-lg font-bold">{completedBookings}</span>
                <span className="text-gray-400 text-sm">/{nextThreshold}</span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
              {/* Background Track */}
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                {/* Progress Fill with Gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-[#5D38DE] via-[#7c3aed] to-[#a855f7] rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  
                  {/* Progress Indicator Dot */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-[#5D38DE] shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#5D38DE] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Progress Text */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-xs">0</span>
                <span className="text-gray-500 text-xs">{nextThreshold}</span>
              </div>

              {/* Remaining Bookings */}
              <div className="text-center mt-3">
                <span className="text-gray-400 text-sm">
                  <span className="text-[#5D38DE] font-semibold">{requiredBookings}</span> more bookings to unlock {nextBadge}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">🎉 You've reached the highest badge level!</p>
            <p className="text-gray-500 text-xs mt-2">Total completed bookings: {completedBookings}</p>
          </div>
        )}
      </div>
    )
  }
  
  export default CurrentBadge
  