import LoginForm from "../../components/LoginPageComponents/LoginForm"
import LoginIllustration from "../../components/LoginPageComponents/LoginIllustration"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-['Poppins']">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left side - Illustration and Welcome Text */}
        <LoginIllustration />

        {/* Right side - Sign In Form */}
        <LoginForm />
      </div>
    </div>
  )
}
