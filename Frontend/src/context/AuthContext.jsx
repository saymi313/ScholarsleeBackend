
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import socketService from "../shared/services/socketService"

console.log("AuthContext.jsx loaded")

const PUBLIC_PATHS = [
  "/",
  "/home",
  "/about",
  "/login",
  "/signup",
  "/mentees/login",
  "/mentees/signup",
  "/mentees/mentors",
  "/mentees/mentor-details",
  "/mentees/services",
  "/forgot-password",
  "/reset-password",
  "/mentors/login",
  "/mentors/signup",
  "/select-role",
]

const isPublicPath = (pathname) => {
  // Handle null/undefined
  if (!pathname) {
    pathname = "/"
  }

  // Remove trailing slash for consistency (except for root)
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "")

  // Exact match for root
  if (normalizedPath === "/" || normalizedPath === "") {
    return true
  }

  // Check if path matches any public path
  return PUBLIC_PATHS.some((publicPath) => {
    // Exact match
    if (normalizedPath === publicPath) {
      return true
    }
    // Starts with public path followed by / (for nested routes)
    if (normalizedPath.startsWith(publicPath + "/")) {
      return true
    }
    // Handle query params
    if (normalizedPath.startsWith(publicPath + "?")) {
      return true
    }
    return false
  })
}

// Create axios instance with base configuration
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "https://api.scholarslee.com/api",
  // baseURL: "https://api.scholarslee.com/api", // Production
  baseURL: "http://localhost:5000/api", // Local development
  timeout: 60000, // Increased to 60s for production reliability (matches main api.js)
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        const requestUrl = error.config?.url || ""
        const isAuthCheckRequest = requestUrl.includes("/auth/me")
        const isRoleSelectionRequest = requestUrl.includes("/users/select-role")

        // Get current path safely
        let currentPath = "/"
        if (typeof window !== "undefined") {
          currentPath = window.location.pathname
        }

        const isOnPublicPage = isPublicPath(currentPath)

        // Define public API endpoints that should not trigger redirect
        const publicApiPaths = [
          "/mentees/mentors",
          "/mentees/services",
          "/mentees/mentor-details",
          "/about",
        ]
        const isPublicApi = publicApiPaths.some((p) => requestUrl.includes(p))

        /*
        console.log("[Auth Interceptor] 401 Error Details:", {
          requestUrl,
          isAuthCheckRequest,
          currentPath,
          isOnPublicPage,
          isPublicApi,
        })
        */

        // Always clear invalid tokens EXCEPT during auth verification on the select-role page
        // This allows the user to still attempt role selection even if the /me check fails
        if (!isAuthCheckRequest || !currentPath.includes("/select-role")) {
          console.log("[Auth Interceptor] Clearing auth state")
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }

        // Redirect only if not an auth check, not on a public page, not a public API, and not a role selection request
        if (!isAuthCheckRequest && !isOnPublicPage && !isPublicApi && !isRoleSelectionRequest) {
          console.log("[Auth Interceptor] Redirecting to login - protected route access denied")
          window.location.href = "/login"
          return Promise.reject(new Error("Session expired. Please login again."))
        }

        // For public pages, auth checks, or public API requests - just reject without redirect
        // console.log("[Auth Interceptor] 401 handled silently - public context")
        return Promise.reject(new Error("Authentication required"))
      }

      return Promise.reject(new Error(data.message || "An error occurred"))
    }

    if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."))
    }

    return Promise.reject(new Error("An unexpected error occurred"))
  },
)

// Auth helper functions
const authHelpers = {
  isLoggedIn: () => {
    if (typeof window === "undefined") return false
    const token = localStorage.getItem("token")
    return !!token
  },
  getCurrentUserData: () => {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },
  clearAuth: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
  },
}

// Create AuthContext
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)

      // Safety check for SSR
      if (typeof window === "undefined") {
        setLoading(false)
        return
      }

      const currentPath = window.location.pathname
      const isOnPublicPage = isPublicPath(currentPath)
      const hasToken = authHelpers.isLoggedIn()

      if (process.env.NODE_ENV === 'development') {
        console.log("[Auth Init] Starting:", { currentPath, isOnPublicPage, hasToken })
      }

      // If no token exists, set clean state immediately - NO redirect needed
      if (!hasToken) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[Auth Init] No token found, user is guest")
        }
        socketService.disconnect()
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        // DO NOT redirect here - user might be on a public page intentionally
        return
      }

      // User has a token - try to verify it
      // First, restore from cache for immediate UI (optional)
      const cachedUser = authHelpers.getCurrentUserData()
      if (cachedUser) {
        console.log("[Auth Init] Restored cached user:", cachedUser.email)
        setUser(cachedUser)
        setIsAuthenticated(true)
      }

      // Now verify with server
      try {
        console.log("[Auth Init] Verifying token with server...")
        const result = await api.get("/mentees/auth/me")

        if (result.data.success) {
          const verifiedUser = result.data.data.user
          console.log("[Auth Init] Token verified successfully:", verifiedUser.email)

          setUser(verifiedUser)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(verifiedUser))

          // Initialize socket
          const token = localStorage.getItem("token")
          if (token) {
            try {
              socketService.connect(token)
              console.log("[Auth Init] Socket connected")
            } catch (socketError) {
              console.warn("[Auth Init] Socket connection failed:", socketError)
            }
          }
        } else {
          // Token invalid according to server
          console.log("[Auth Init] Server rejected token")
          authHelpers.clearAuth()
          socketService.disconnect()
          setUser(null)
          setIsAuthenticated(false)
          // NO redirect - interceptor handles that if needed
        }
      } catch (verifyError) {
        // Token verification failed (401 or network error)
        console.warn("[Auth Init] Token verification failed:", verifyError.message)

        // Clear auth state
        authHelpers.clearAuth()
        socketService.disconnect()
        setUser(null)
        setIsAuthenticated(false)

        // DO NOT redirect here - the interceptor already handles 401 redirects
        // And we should NEVER redirect if we're on a public page
        console.log("[Auth Init] Auth cleared, staying on current page:", currentPath)
      }
    } catch (error) {
      console.error("[Auth Init] Unexpected error:", error)
      setError("Failed to initialize authentication")
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
      if (process.env.NODE_ENV === 'development') {
        console.log("[Auth Init] Complete")
      }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentees/auth/register", userData)

      if (result.data.success) {
        if (result.data.data.token) {
          localStorage.setItem("token", result.data.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.data.user))
          setUser(result.data.data.user)
          setIsAuthenticated(true)
        }
        return { success: true, user: result.data.data.user, message: result.data.message }
      } else {
        setError(result.data.message)
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Smart login - automatically detects if user is mentee or mentor
  const smartLogin = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      console.log("[Auth] Smart login attempting for:", credentials.email)

      // Try mentor login first (since mentors have stricter requirements)
      try {
        console.log("[Auth] Trying mentor login endpoint...")
        const mentorResult = await api.post("/mentors/auth/login", credentials)

        if (mentorResult.data.success) {
          const userData = mentorResult.data.data?.user || mentorResult.data.user
          const authToken = mentorResult.data.data?.token || mentorResult.data.token

          if (!authToken) {
            console.error("[Auth] No token in mentor response:", mentorResult.data)
            throw new Error("Authentication token not found in response")
          }

          localStorage.setItem("token", authToken)
          localStorage.setItem("user", JSON.stringify(userData))

          console.log("[Auth] Mentor login successful:", userData.email)

          setUser(userData)
          setIsAuthenticated(true)

          try {
            socketService.connect(authToken)
            console.log("[Auth] Socket connecting with fresh token")
          } catch (socketError) {
            console.warn("[Auth] Socket connection failed:", socketError)
          }

          return { success: true, user: userData, message: mentorResult.data.message }
        }
      } catch (mentorError) {
        console.log("[Auth] Mentor login failed, trying mentee login...")

        // If mentor login fails, try mentee login
        try {
          const menteeResult = await api.post("/mentees/auth/login", credentials)

          if (menteeResult.data.success) {
            const userData = menteeResult.data.data?.user || menteeResult.data.user
            const authToken = menteeResult.data.data?.token || menteeResult.data.token

            if (!authToken) {
              console.error("[Auth] No token in mentee response:", menteeResult.data)
              throw new Error("Authentication token not found in response")
            }

            localStorage.setItem("token", authToken)
            localStorage.setItem("user", JSON.stringify(userData))

            console.log("[Auth] Mentee login successful:", userData.email)

            setUser(userData)
            setIsAuthenticated(true)

            try {
              socketService.connect(authToken)
              console.log("[Auth] Socket connecting with fresh token")
            } catch (socketError) {
              console.warn("[Auth] Socket connection failed:", socketError)
            }

            return { success: true, user: userData, message: menteeResult.data.message }
          } else {
            setError(menteeResult.data.message)
            return { success: false, error: menteeResult.data.message }
          }
        } catch (menteeError) {
          console.error("[Auth] Both login attempts failed")
          const errorMessage = menteeError.message || "Invalid credentials"
          setError(errorMessage)
          return { success: false, error: errorMessage }
        }
      }
    } catch (error) {
      console.error("[Auth] Smart login error:", error)
      const errorMessage = error.message || "Login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentees/auth/login", credentials)

      if (result.data.success) {
        const userData = result.data.data?.user || result.data.user
        const authToken = result.data.data?.token || result.data.token

        if (!authToken) {
          console.error("[Auth] No token in response:", result.data)
          throw new Error("Authentication token not found in response")
        }

        localStorage.setItem("token", authToken)
        localStorage.setItem("user", JSON.stringify(userData))

        console.log("[Auth] Login successful:", userData.email)

        setUser(userData)
        setIsAuthenticated(true)

        try {
          socketService.connect(authToken)
          console.log("[Auth] Socket connecting with fresh token")
        } catch (socketError) {
          console.warn("[Auth] Socket connection failed:", socketError)
        }

        return { success: true, user: userData, message: result.data.message }
      } else {
        setError(result.data.message)
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      console.error("[Auth] Login error:", error)
      const errorMessage = error.message || "Login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Mentor register function
  const mentorRegister = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentors/auth/register", userData)

      if (result.data.success) {
        if (result.data.data.token) {
          localStorage.setItem("token", result.data.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.data.user))
          setUser(result.data.data.user)
          setIsAuthenticated(true)
        }
        return { success: true, user: result.data.data.user, message: result.data.message }
      } else {
        setError(result.data.message)
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Mentor registration failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Mentor login function
  const mentorLogin = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentors/auth/login", credentials)

      if (result.data.success) {
        const userData = result.data.data?.user || result.data.user
        const authToken = result.data.data?.token || result.data.token

        if (!authToken) {
          console.error("[Auth] No token in response:", result.data)
          throw new Error("Authentication token not found in response")
        }

        localStorage.setItem("token", authToken)
        localStorage.setItem("user", JSON.stringify(userData))

        console.log("[Auth] Mentor login successful:", userData.email)

        setUser(userData)
        setIsAuthenticated(true)

        try {
          socketService.connect(authToken)
          console.log("[Auth] Socket connecting with fresh token")
        } catch (socketError) {
          console.warn("[Auth] Socket connection failed:", socketError)
        }

        return { success: true, user: userData, message: result.data.message }
      } else {
        setError(result.data.message)
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      console.error("[Auth] Mentor login error:", error)
      const errorMessage = error.message || "Mentor login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Admin login function
  const adminLogin = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/admin/auth/login", credentials)

      if (result.data.success) {
        localStorage.setItem("token", result.data.data.token)
        localStorage.setItem("user", JSON.stringify(result.data.data.user))
        setUser(result.data.data.user)
        setIsAuthenticated(true)
        return { success: true, user: result.data.data.user, message: result.data.message }
      } else {
        setError(result.data.message)
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Admin login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      console.log("[Auth] Logging out user")
      await api.post("/mentees/auth/logout")
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      try {
        socketService.disconnect()
        console.log("[Auth] Socket disconnected")
      } catch (socketError) {
        console.warn("[Auth] Socket disconnection error:", socketError)
      }

      authHelpers.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      setLoading(false)
      console.log("[Auth] Logout complete")
    }
  }

  // Mentor logout function
  const mentorLogout = async () => {
    try {
      setLoading(true)
      console.log("[Auth] Logging out mentor")

      try {
        await api.post("/mentors/auth/logout")
      } catch (error) {
        console.warn("[Auth] Logout API call failed, continuing with local logout:", error)
      }
    } finally {
      try {
        socketService.disconnect()
        console.log("[Auth] Socket disconnected")
      } catch (socketError) {
        console.warn("[Auth] Socket disconnection error:", socketError)
      }

      authHelpers.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      setLoading(false)
      console.log("[Auth] Mentor logout complete")
    }
  }

  // Clear error function
  const clearError = () => {
    setError(null)
  }

  // Role checking functions
  const hasRole = (role) => {
    return user && user.role === role
  }

  const isMentee = () => hasRole("mentee")
  const isMentor = () => hasRole("mentor")
  const isAdmin = () => hasRole("admin")

  // Get user's full name
  const getFullName = () => {
    if (!user || !user.profile) return ""
    const { firstName, lastName } = user.profile
    return `${firstName} ${lastName}`.trim()
  }

  // Get user's email
  const getEmail = () => {
    return user ? user.email : ""
  }

  // Get user's role
  const getRole = () => {
    return user ? user.role : null
  }

  // Verify email function
  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentees/auth/verify-email", { email, otp })

      if (result.data.success) {
        if (result.data.data.token) {
          localStorage.setItem("token", result.data.data.token)
          localStorage.setItem("user", JSON.stringify(result.data.data.user))
          setUser(result.data.data.user)
          setIsAuthenticated(true)

          try {
            socketService.connect(result.data.data.token)
          } catch (socketError) {
            console.warn("[Auth] Socket connection failed:", socketError)
          }
        }
        return { success: true, user: result.data.data.user, message: result.data.message }
      } else {
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Verification failed"
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    try {
      setLoading(true)
      setError(null)

      const result = await api.post("/mentees/auth/resend-verification", { email })

      if (result.data.success) {
        return { success: true, message: result.data.message }
      } else {
        return { success: false, error: result.data.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to resend verification"
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    // Actions
    register,
    login,
    smartLogin,
    mentorRegister,
    mentorLogin,
    adminLogin,
    logout,
    mentorLogout,
    clearError,
    // Role checking
    hasRole,
    isMentee,
    isMentor,
    isAdmin,
    // User info
    getFullName,
    getEmail,
    getRole,
    // Verification
    verifyEmail,
    resendVerificationEmail,
    // Utility
    isPublicPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { isPublicPath }
export default AuthContext
