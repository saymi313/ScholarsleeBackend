import ForgotPasswordForm from "../../components/ForgotPasswordComponents/ForgotPasswordForm"
import ForgotPasswordIllustration from "../../components/ForgotPasswordComponents/ForgotPasswordIllustration"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-['Poppins']">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <ForgotPasswordIllustration />
        <ForgotPasswordForm />
      </div>
    </div>
  )
}


