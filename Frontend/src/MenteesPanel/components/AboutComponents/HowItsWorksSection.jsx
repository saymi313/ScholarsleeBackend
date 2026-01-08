const HowItWorksSection = () => {
  const steps = [
    {
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
      title: "Find the right mentor",
      description: "Browse filters by specialization, university, and country, read reviews and rating",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Book a session",
      description: "Choose single consultations or a mentorship program, and easily schedule at your convenience",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Get results",
      description: "Receive actionable feedback, and a personalized roadmap to your study abroad destination",
    },
  ]

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-16 font-sans">
          How Scholarslee works, in three steps
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 hover:shadow-xl cursor-pointer"
            >
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-sans">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
