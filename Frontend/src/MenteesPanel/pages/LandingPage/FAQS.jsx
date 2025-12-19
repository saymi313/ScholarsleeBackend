"use client"

import { useState } from "react"

export default function FAQS() {
  const [openFAQ, setOpenFAQ] = useState(0) // First FAQ is open by default
  const [showTooltip, setShowTooltip] = useState(false)

  const faqs = [
    {
      question: "What is an ideal process of registration?",
      answer:
        "The registration process is simple and straightforward. First, create your account by signing up with your email or Google account. Complete your profile by adding your academic background, study goals, and preferences. Browse through our verified mentors, review their profiles, expertise, and availability. Once you find a suitable mentor, book a session at your preferred time slot. You'll receive confirmation via email and can start your mentorship journey right away.",
    },
    {
      question: "How do you ideally help a student to accomplish their goal?",
      answer:
        "We provide comprehensive support through personalized mentoring, strategic planning, and continuous guidance throughout your academic journey. Our experienced mentors work closely with you to identify your strengths and help you achieve your educational objectives. This includes assistance with university applications, statement of purpose writing, visa guidance, interview preparation, scholarship opportunities, and career planning to ensure your success in studying abroad.",
    },
    {
      question: "What are the ideal financial support needed?",
      answer:
        "Financial requirements vary based on your chosen destination and program. We help you understand tuition fees, living expenses, and available scholarship opportunities. Our financial advisors assist in creating a comprehensive budget plan for your studies abroad. We also guide you through scholarship applications, education loan options, and part-time work opportunities available in your destination country to help manage your finances effectively.",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="inline-block bg-purple-100 text-[#5D38DE] px-4 py-2 rounded-full text-sm font-medium mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Taking you to the destination you want to reach in ease
            </h2>
          </div>

          <div className="relative">
            <div
              className="w-14 h-14 bg-gradient-to-br from-[#5D38DE] to-[#4A2BB8] rounded-full flex items-center justify-center cursor-help transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#5D38DE]/30 border-2 border-white shadow-lg"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>

            {showTooltip && (
              <div className="absolute right-0 top-16 w-72 bg-gray-900 text-white text-sm rounded-xl p-4 shadow-2xl z-10 transform transition-all duration-300 animate-in slide-in-from-top-2">
                <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#5D38DE] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="leading-relaxed">
                    These frequently asked questions help you understand our services and processes better, making your
                    journey smoother and more informed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border-2 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] ${openFAQ === index
                  ? "border-[#5D38DE] bg-gradient-to-r from-purple-50 to-blue-50 shadow-2xl shadow-[#5D38DE]/20"
                  : "border-gray-200 bg-white hover:border-[#5D38DE] hover:shadow-xl hover:shadow-[#5D38DE]/10"
                }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-6 flex items-center justify-between">
                <h3
                  className={`text-lg font-semibold transition-all duration-500 ${openFAQ === index ? "text-[#5D38DE]" : "text-gray-900"
                    }`}
                >
                  {faq.question}
                </h3>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openFAQ === index
                      ? "bg-gradient-to-r from-[#5D38DE] to-[#4A2BB8] text-white rotate-180 shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-[#5D38DE] hover:to-[#4A2BB8] hover:text-white hover:shadow-md"
                    }`}
                >
                  <svg
                    className="w-5 h-5 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="border-t border-purple-200 pt-4">
                    <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
