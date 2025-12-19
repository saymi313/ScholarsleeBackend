export default function SignUpIllustration() {
  return (
    <div className="hidden lg:flex flex-col items-start justify-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl xl:text-5xl font-bold text-white font-['Poppins']">Join Scholarslee</h1>
        <p className="text-gray-400 text-lg font-['Poppins']">Create your account to get started.</p>
      </div>

      <div className="relative w-full max-w-md">
        <img
          src="/login.png"
          alt="Signup illustration"
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}


