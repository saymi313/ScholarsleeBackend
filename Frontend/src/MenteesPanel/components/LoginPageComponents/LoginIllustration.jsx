export default function LoginIllustration() {
    return (
      <div className="hidden lg:flex flex-col items-start justify-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl xl:text-5xl font-bold text-white font-['Poppins']">Welcome Back to Scholarslee</h1>
          <p className="text-gray-400 text-lg font-['Poppins']">Log in to connect, guide, and grow together.</p>
        </div>
  
        {/* Illustration */}
        <div className="relative w-full max-w-md">
          <img
            src="/login.png"
            alt="Student with cityscape illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    )
  }
  