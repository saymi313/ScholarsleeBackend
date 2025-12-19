import './badgeAnimations.css'

const BadgeItem = ({ badge }) => {
    const getBadgeColor = (color, unlocked) => {
      if (!unlocked) return "#2a2a2a"
  
      const colors = {
        pink: "linear-gradient(135deg, #ff6b9d 0%, #ffc3d8 100%)",
        silver: "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)",
        cyan: "linear-gradient(135deg, #00acc1 0%, #26c6da 100%)", // Bright vibrant cyan
        orange: "linear-gradient(135deg, #ff5722 0%, #ff7043 100%)", // Bright vibrant orange
        white: "linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)",
        gold: "linear-gradient(135deg, #ffb300 0%, #ffc400 100%)", // Bright vibrant gold
        gray: "linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%)", // Brighter gray for better visibility
        dark: "#2a2a2a",
      }
  
      return colors[color] || colors.gray
    }
  
    const getGlowColor = (badgeName) => {
      const glowMap = {
        'Beginner': 'rgba(189, 189, 189, 0.4)',
        'Level 1 Seller': 'rgba(0, 188, 212, 0.5)',
        'Level 2 Seller': 'rgba(255, 87, 34, 0.5)',
        'Best Seller': 'rgba(255, 179, 0, 0.6)'
      }
      return glowMap[badgeName] || 'rgba(189, 189, 189, 0.4)'
    }

    return (
      <div className={`flex flex-col items-center relative ${badge.isCurrent ? 'ring-2 ring-purple-500 rounded-lg p-2' : ''}`}>
        {/* Animated Glow Effect for unlocked badges */}
        {badge.unlocked && (
          <div 
            className="absolute inset-0 flex items-center justify-center animate-pulse"
            style={{
              filter: 'blur(12px)',
              opacity: badge.isCurrent ? 0.6 : 0.3,
            }}
          >
            <div
              className="w-20 h-20 sm:w-24 sm:h-24"
              style={{
                background: getBadgeColor(badge.color, true),
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          </div>
        )}

        {/* Badge Icon - Hexagon Shape */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2 transition-all duration-500 ${
            badge.unlocked ? "shadow-lg" : "opacity-50"
          } ${badge.isCurrent ? "ring-4 ring-purple-400 ring-offset-2 ring-offset-[#111111] shadow-2xl shadow-purple-500/50 scale-105 animate-pulse" : badge.unlocked ? "hover:scale-110 hover:shadow-2xl hover:brightness-110" : ""}`}
          style={{
            background: getBadgeColor(badge.color, badge.unlocked),
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            boxShadow: badge.unlocked 
              ? `0 0 20px ${getGlowColor(badge.name)}, 0 0 40px ${getGlowColor(badge.name)}` 
              : 'none',
            animation: badge.unlocked && !badge.isCurrent ? 'badgeFloat 3s ease-in-out infinite' : undefined,
          }}
        >
          {/* Shimmer effect overlay for unlocked badges */}
          {badge.unlocked && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                animation: 'badgeShimmer 3s infinite',
              }}
            />
          )}
          {/* Hexagon Shape with Icon */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50 5, 90 30, 90 70, 50 95, 10 70, 10 30"
                fill={badge.unlocked ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)"}
                stroke={badge.unlocked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}
                strokeWidth="2"
              />
              
              {/* Achievement Icon - Different design for each badge level */}
              <g transform="translate(50, 50)" className={badge.unlocked ? 'badge-rotate' : ''}>
                {badge.unlocked ? (
                  <>
                    {badge.name === 'Beginner' && (
                      <>
                        {/* Beginner: Sprout/Seed shape - starting point */}
                        {/* Stem */}
                        <rect x="-1" y="2" width="2" height="6" rx="1" fill="rgba(255,255,255,0.9)" />
                        {/* Leaf 1 */}
                        <ellipse cx="-4" cy="0" rx="3" ry="5" fill="rgba(255,255,255,0.95)" transform="rotate(-30 -4 0)" />
                        {/* Leaf 2 */}
                        <ellipse cx="4" cy="0" rx="3" ry="5" fill="rgba(255,255,255,0.95)" transform="rotate(30 4 0)" />
                        {/* Seed base */}
                        <ellipse cx="0" cy="6" rx="3" ry="2" fill="rgba(255,255,255,0.8)" />
                        {/* Sparkles */}
                        <circle cx="-10" cy="-10" r="1.5" fill="rgba(255,255,255,0.8)" className="badge-sparkle" />
                        <circle cx="10" cy="-10" r="1.5" fill="rgba(255,255,255,0.8)" style={{ animationDelay: '0.5s' }} className="badge-sparkle" />
                        <circle cx="0" cy="10" r="1.5" fill="rgba(255,255,255,0.8)" style={{ animationDelay: '1s' }} className="badge-sparkle" />
                      </>
                    )}
                    {badge.name === 'Level 1 Seller' && (
                      <>
                        {/* Level 1: Single Star - first achievement */}
                        <path
                          d="M0,-12 L3,-3 L9,-3 L4.5,1 L6,7 L0,4 L-6,7 L-4.5,1 L-9,-3 L-3,-3 Z"
                          fill="rgba(255,255,255,0.95)"
                          stroke="rgba(255,255,255,1)"
                          strokeWidth="1.2"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
                        />
                        <circle cx="0" cy="0" r="2" fill="rgba(255,255,255,1)" />
                        {/* Glow particles */}
                        <circle cx="-8" cy="-8" r="1" fill="rgba(255,255,255,0.6)" className="badge-pulse" />
                        <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.6)" style={{ animationDelay: '1s' }} className="badge-pulse" />
                      </>
                    )}
                    {badge.name === 'Level 2 Seller' && (
                      <>
                        {/* Level 2: Flag shape - milestone reached */}
                        {/* Flag pole */}
                        <rect x="-1" y="-10" width="2" height="18" rx="1" fill="rgba(255,255,255,0.95)" />
                        {/* Flag */}
                        <polygon
                          points="-1,-10 8,-10 8,-2 -1,-2"
                          fill="rgba(255,255,255,0.95)"
                          stroke="rgba(255,255,255,1)"
                          strokeWidth="1"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
                        />
                        {/* Flag tip */}
                        <polygon
                          points="8,-10 12,-6 8,-2"
                          fill="rgba(255,255,255,0.9)"
                        />
                        {/* Decorative stripe on flag */}
                        <line x1="-1" y1="-6" x2="8" y2="-6" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
                        {/* Orbiting particles */}
                        <circle cx="0" cy="-14" r="1.2" fill="rgba(255,255,255,0.7)" className="badge-orbit" />
                        <circle cx="0" cy="14" r="1.2" fill="rgba(255,255,255,0.7)" style={{ animationDelay: '1.5s' }} className="badge-orbit" />
                      </>
                    )}
                    {badge.name === 'Best Seller' && (
                      <>
                        {/* Best Seller: Crown shape - highest achievement */}
                        {/* Crown base */}
                        <path
                          d="M-8,4 L-4,-6 L0,-2 L4,-6 L8,4 L6,4 L6,8 L-6,8 L-6,4 Z"
                          fill="rgba(255,255,255,0.95)"
                          stroke="rgba(255,255,255,1)"
                          strokeWidth="1.2"
                          style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))' }}
                        />
                        {/* Crown jewels */}
                        <circle cx="-4" cy="-4" r="2" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,1))' }} className="badge-pulse" />
                        <circle cx="0" cy="-1" r="2.5" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,1))', animationDelay: '0.3s' }} className="badge-pulse" />
                        <circle cx="4" cy="-4" r="2" fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,1))', animationDelay: '0.6s' }} className="badge-pulse" />
                        {/* Sparkle effects around crown */}
                        <circle cx="-12" cy="-8" r="1.5" fill="rgba(255,255,255,0.8)" className="badge-sparkle" />
                        <circle cx="12" cy="-8" r="1.5" fill="rgba(255,255,255,0.8)" style={{ animationDelay: '0.5s' }} className="badge-sparkle" />
                        <circle cx="0" cy="12" r="1.5" fill="rgba(255,255,255,0.8)" style={{ animationDelay: '1s' }} className="badge-sparkle" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Lock Icon for locked badges */}
                    <rect x="-6" y="-8" width="12" height="8" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                    <rect x="-4" y="-2" width="8" height="6" rx="1" fill="rgba(255,255,255,0.2)" />
                    <circle cx="0" cy="-4" r="1.5" fill="rgba(255,255,255,0.4)" />
                  </>
                )}
              </g>
            </svg>
          </div>
        </div>
  
        {/* Badge Name */}
        <p className={`text-xs text-center transition-all duration-300 ${
          badge.isCurrent 
            ? 'text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' 
            : badge.unlocked 
              ? 'text-white font-medium' 
              : 'text-gray-500'
        }`}>
          {badge.name}
          {badge.isCurrent && (
            <span className="block text-[10px] text-purple-500 mt-0.5 animate-pulse">
              (Current)
            </span>
          )}
        </p>
      </div>
    )
  }
  
  export default BadgeItem
  