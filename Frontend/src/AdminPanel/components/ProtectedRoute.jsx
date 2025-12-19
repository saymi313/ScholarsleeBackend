import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminAuthAPI } from "../../utils/api"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          navigate('/xyz/admin/authenticate')
          return
        }

        // Verify token by calling getMe endpoint
        const response = await adminAuthAPI.getMe()
        
        if (response.data?.success) {
          const user = response.data.data?.user
          
          // Check if user is admin
          if (user?.role === 'admin') {
            setIsAuthenticated(true)
          } else {
            // Not an admin, redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/xyz/admin/authenticate')
          }
        } else {
          // Invalid token, redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/xyz/admin/authenticate')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Token invalid or expired, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/xyz/admin/authenticate')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE] mx-auto mb-4" />
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}

