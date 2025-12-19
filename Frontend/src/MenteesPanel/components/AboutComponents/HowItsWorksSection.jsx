const HowItWorksSection = () => {
    const steps = [
      {
        icon: (
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M8 7a4 4 0 118 0" />
          </svg>
        ),
        title: "Find the right mentor",
        description: "Browse filters by specialization, university, and country, read reviews and rating",
      },
      {
        icon: (
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3a4 4 0 118 0v4M8 7a4 4 0 118 0m0 8a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        ),
        title: "Book a session",
        description: "Choose single consultations or a mentorship program, and easily schedule at your convenience",
      },
      {
        icon: (
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
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
  