export default function ForgotPasswordIllustration() {
  return (
    <div className="hidden lg:flex flex-col items-start justify-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl xl:text-5xl font-bold text-white font-['Poppins']">Reset your password</h1>
        <p className="text-gray-400 text-lg font-['Poppins']">We’ll help you get back into your account.</p>
      </div>
      <div className="relative w-full max-w-md">
        <img src="/login.png" alt="Reset password" className="w-full h-auto" />
      </div>
    </div>
  )
}


