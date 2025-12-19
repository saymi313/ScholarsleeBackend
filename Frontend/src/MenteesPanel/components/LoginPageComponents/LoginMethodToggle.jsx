"use client"

export default function LoginMethodToggle({ loginMethod, setLoginMethod }) {
  return (
    <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-gray-700">
      <button
        type="button"
        onClick={() => setLoginMethod("mobile")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium font-['Poppins'] transition-all duration-200 ${
          loginMethod === "mobile" ? "bg-[#5D38DE] text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        Mobile Number
      </button>
      <button
        type="button"
        onClick={() => setLoginMethod("email")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium font-['Poppins'] transition-all duration-200 ${
          loginMethod === "email" ? "bg-[#5D38DE] text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        Email
      </button>
    </div>
  )
}
