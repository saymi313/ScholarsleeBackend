// Button component
const Button = ({ children, className = "", style = {}, ...props }) => (
  <button
    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 hover:opacity-90 ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

const HeroSection = () => {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block bg-purple-100 px-6 py-1 rounded-full">
                <p className="text-[#5D38DE] font-semibold text-lg">Expert Mentors</p>
              </div>
  
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Your journey abroad doesn't have to be{" "}
                <span className="relative">
                  overwhelming
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-300 rounded-full -z-10"></div>
                </span>
              </h1>
  
              <p className="text-gray-600 text-md lg:text-lg leading-relaxed max-w-lg">
                With Scholarslee mentors, you get step-by-step guidance, personalized advice, and proven strategies that
                transform your application into an acceptance letter.
              </p>
            </div>
  
            <Button
            className="w-full sm:w-auto text-white px-8 py-3 text-lg font-semibold primary-hover"
            style={{ backgroundColor: "#5D38DE" }}
          >     Scroll down
            </Button>
          </div>
  
          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <img
              src="/mentorPage.svg"
                alt="Student having video call with mentor"
                className="w-full h-auto "
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default HeroSection
  