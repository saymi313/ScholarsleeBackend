const MissionSection = () => {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-sans">Our mission</h1>
              <p className="text-lg text-gray-600 leading-relaxed font-sans">
                To democratize expert study abroad guidance, one personalized mentorship session at a time. We help
                students from everywhere, including Pakistan, access the knowledge, strategies, and support they need to
                get into top universities, and to thrive once they arrive.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/about.png"
                alt="Student with books pointing"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default MissionSection
  