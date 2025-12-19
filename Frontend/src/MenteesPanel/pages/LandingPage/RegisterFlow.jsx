"use client"

export default function RegisterFlow() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Steps */}
        <div className="space-y-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">How Registration Works</h2>

          {/* Step 01 */}
          <div className="relative">
            <div className="absolute -left-4 -top-8 sm:-left-12 sm:-top-2 text-6xl sm:text-9xl font-bold text-gray-200 select-none z-0">01</div>
             <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 sm:mt-0 ml-8 sm:ml-28 w-auto relative z-10 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sign Up and create Account</h3>
              </div>
              <p className="text-gray-600 text-sm">Fill out your details and showcase your skills.</p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="relative">
            <div className="absolute -right-4 -top-8 sm:-right-32 sm:-top-2 text-6xl sm:text-9xl font-bold text-gray-200 select-none z-0">02</div>
             <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 sm:mt-0 mr-8 sm:mr-0 sm:-left-6 sm:right-40 w-auto relative z-10 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Upload Your Portfolio</h3>
              </div>
              <p className="text-gray-600 text-sm">Add your resume, certificates, and more.</p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="relative">
            <div className="absolute -left-4 -top-8 sm:-left-12 sm:-top-2 text-6xl sm:text-9xl font-bold text-gray-200 select-none z-0">03</div>
             <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 sm:mt-0 ml-8 sm:ml-28 w-auto relative z-10 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Get Discovered</h3>
              </div>
              <p className="text-gray-600 text-sm">Contact expert mentors</p>
            </div>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative mt-8 sm:mt-28 ml-0 sm:ml-16">
          <img
            src="/register.svg"
            alt="Professional mentoring environment"
            className="w-full h-auto rounded-2xl"
          />

          {/* <div className="absolute bottom-6 right-6 bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="/professional-mentor-headshot.jpg"
                  alt="Mentor 1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder-lentm.png"
                  alt="Mentor 2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder-zhpqw.png"
                  alt="Mentor 3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">10K+</div>
                <div className="text-xs text-gray-500">Students from all over the world</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
