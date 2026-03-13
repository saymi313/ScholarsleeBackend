import { useNavigate } from "react-router-dom"
import { Lock, ArrowRight, Shield, User } from "lucide-react"

export default function LoginRequiredError() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Error Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80" />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-blue-400/20 animate-pulse" />
            <div className="absolute top-1/4 -left-2 h-4 w-4 rounded-full bg-indigo-400/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/4 -right-2 h-6 w-6 rounded-full bg-blue-300/25 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative p-8 md:p-12">
            {/* Icon with animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-bounce">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Please Log In First
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                You need to be logged in to view your bookings. Please log in or create an account to continue.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Secure Access</span>
                </div>
                <div className="flex items-center justify-center space-x-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700">Personal Profile</span>
                </div>
                <div className="flex items-center justify-center space-x-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                  <ArrowRight className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700">Quick Setup</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLogin}
                className="group relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Go to Login</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?
                <button
                  onClick={() => navigate('/signup')}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
