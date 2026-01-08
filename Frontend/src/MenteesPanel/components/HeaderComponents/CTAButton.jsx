import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"

export default function CTAButton({ className = "" }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
    navigate('/mentees/login')
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {isAuthenticated ? (
        // User is logged in - show Profile/Dashboard and Sign Out buttons
        <>
          <Link
            to={user?.role === 'mentor' ? '/mentor/dashboard' : '/mentees/profile'}
            className="bg-white border border-[#5D38DE] text-[#5D38DE] hover:bg-[#f4f0ff] px-5 py-2 rounded-full transition-colors inline-block text-center mr-2"
          >
            {user?.role === 'mentor' ? 'Dashboard' : 'Profile'}
          </Link>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-colors inline-block text-center"
          >
            Sign Out
          </button>
        </>
      ) : (
        // User is not logged in - show Register button
        <>
          <Link
            to="/signup"
            className="bg-[#5D38DE] hover:bg-[#4A2BB8] text-white px-5 py-2 rounded-full transition-colors inline-block text-center mr-2"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-white border border-[#5D38DE] text-[#5D38DE] hover:bg-[#f4f0ff] px-5 py-2 rounded-full transition-colors inline-block text-center"
          >
            Login
          </Link>
        </>
      )}
    </div>
  )
}
