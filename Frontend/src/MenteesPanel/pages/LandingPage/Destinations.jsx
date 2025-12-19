export default function Destinations() {
    const destinations = [
      {
        country: "Canada",
        title: "Study in Canada",
        image: "/canada.jpg",
        bgColor: "from-amber-100 to-amber-200",
      },
      {
        country: "Australia",
        title: "Study in Australia",
        image: "/australia.jpg",
        bgColor: "from-blue-100 to-purple-200",
      },
      {
        country: "Germany",
        title: "Study in Germany",
        image: "/germany.jpg",
        bgColor: "from-orange-100 to-red-200",
      },
    ]
  
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 md:gap-0">
            <div>
              <span className="inline-block bg-purple-100 text-[#5D38DE] px-3 py-1 rounded-full text-sm font-medium mb-4">
                Countries
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Destinations To Study Abroad</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#5D38DE] flex items-center justify-center hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className={`relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${destination.bgColor} group cursor-pointer`}
              >
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <button className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Try It Now
                  </button>
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-bold">{destination.title}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  