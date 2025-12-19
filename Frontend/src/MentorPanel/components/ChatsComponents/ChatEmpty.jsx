import { useAuth } from "../../../context/AuthContext"

export default function ChatEmpty() {
    const { user } = useAuth()
    const firstName = user?.profile?.firstName || user?.firstName || 'Mentor'
    
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-600 mb-4">
            Welcome Back
            <br />
            {firstName}!!!
          </h1>
          <p className="text-gray-500 text-lg">
            Navigate your chats, guide students through
            <br />
            your experience!
          </p>
        </div>
      </div>
    )
  }
  