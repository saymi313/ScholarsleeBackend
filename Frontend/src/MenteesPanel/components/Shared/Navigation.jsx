import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import ChatPrivacyPopup from "../ChatsComponents/ChatPrivacyPopup"

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)

  const getLinkClass = (paths) => {
    // Allow multiple paths to be checked for active state
    const pathsToCheck = Array.isArray(paths) ? paths : [paths]
    const isActive = pathsToCheck.some(path => location.pathname === path)
    
    return isActive
      ? "text-[#5D38DE] font-medium transition-colors border-b-2 border-[#5D38DE]"
      : "text-gray-600 hover:text-[#5D38DE] font-medium transition-colors"
  }

  const handleChatClick = (e) => {
    e.preventDefault()
    setShowPrivacyPopup(true)
  }

  const handleAcceptPrivacy = () => {
    navigate("/mentees/chats")
    setShowPrivacyPopup(false)
  }

  const handleClosePrivacy = () => {
    setShowPrivacyPopup(false)
  }

  return (
    <>
      <nav className="hidden md:flex items-center space-x-8 mx-8">
        <Link to="/" className={getLinkClass(["/", "/home", "/mentees", "/mentees/home"])}>
          Home
        </Link>
        <Link to="/about" className={getLinkClass("/about")}>
          About
        </Link>
        <Link to="/mentees/mentor" className={getLinkClass(["/mentees/mentor", "/mentees/mentor-details"])}>
          Mentors
        </Link>
        <Link to="/mentees/services" className={getLinkClass(["/mentees/services", "/mentees/service-details", "/pricings"])}>
          Services
        </Link>
        <Link to="/mentees/bookings" className={getLinkClass(["/mentees/bookings", "/mentees/meetings"])}>
          Meetings
        </Link>
        <Link to="/mentees/chats" className={getLinkClass("/mentees/chats")}>
          Chats
        </Link>
        {/* <button 
          onClick={handleChatClick} 
          className={`${getLinkClass("/mentees/chats")} cursor-pointer`}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Chats
        </button> */}
        <Link to="/contact" className={getLinkClass("/contact")}>
          Contact
        </Link>
       
      </nav>

      <ChatPrivacyPopup 
        isOpen={showPrivacyPopup}
        onClose={handleClosePrivacy}
        onAccept={handleAcceptPrivacy}
      />
    </>
  )
}
  