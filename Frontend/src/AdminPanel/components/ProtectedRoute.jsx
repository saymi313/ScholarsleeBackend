import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated, loading, isAdmin, user } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // If AuthContext is done loading
    if (!loading) {
      if (isAuthenticated && isAdmin()) {
        setIsVerifying(false)
      } else {
        // Not authenticated or not admin, redirect
        navigate('/xyz/admin/authenticate')
      }
    }
  }, [isAuthenticated, loading, isAdmin, navigate])

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE] mx-auto mb-4" />
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

