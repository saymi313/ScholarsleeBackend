"use client"

export default function InputField({ type, placeholder, value, onChange, icon, rightIcon }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D38DE] transition-colors font-['Poppins'] ${
          icon ? "pl-11" : "pl-4"
        } ${rightIcon ? "pr-11" : "pr-4"}`}
      />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  )
}
