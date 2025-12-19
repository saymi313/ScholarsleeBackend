const FloatingIcons = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun Icon */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="w-12 h-12 text-yellow-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
        </div>
  
        {/* UK Flag */}
        <div className="absolute top-20 right-32 animate-bounce" style={{ animationDelay: "0.5s" }}>
          <div className="w-10 h-7 rounded-sm overflow-hidden shadow-lg">
            <div className="w-full h-full bg-blue-800 relative">
              <div className="absolute inset-0 bg-white transform rotate-12 origin-center w-1 left-1/2 -translate-x-0.5"></div>
              <div className="absolute inset-0 bg-white transform -rotate-12 origin-center w-1 left-1/2 -translate-x-0.5"></div>
              <div className="absolute inset-0 bg-red-600 transform rotate-12 origin-center w-0.5 left-1/2 -translate-x-0.25"></div>
              <div className="absolute inset-0 bg-red-600 transform -rotate-12 origin-center w-0.5 left-1/2 -translate-x-0.25"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
              <div className="absolute top-0 left-0 w-0.5 h-full bg-white"></div>
              <div className="absolute top-0 right-0 w-0.5 h-full bg-white"></div>
              <div className="absolute top-0 left-0 w-full h-0.25 bg-red-600"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.25 bg-red-600"></div>
              <div className="absolute top-0 left-0 w-0.25 h-full bg-red-600"></div>
              <div className="absolute top-0 right-0 w-0.25 h-full bg-red-600"></div>
            </div>
          </div>
        </div>
  
        {/* Canadian Flag */}
        <div className="absolute top-8 right-16 animate-pulse" style={{ animationDelay: "1s" }}>
          <div className="w-10 h-7 rounded-sm overflow-hidden shadow-lg bg-white flex">
            <div className="w-2 bg-red-600"></div>
            <div className="flex-1 bg-white flex items-center justify-center">
              <div className="w-4 h-4 text-red-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l1.5 4.5L18 6l-3 3 3 3-4.5-.5L12 16l-1.5-4.5L6 12l3-3-3-3 4.5.5L12 2z" />
                </svg>
              </div>
            </div>
            <div className="w-2 bg-red-600"></div>
          </div>
        </div>
  
        {/* Italian Flag */}
        <div className="absolute top-32 right-8 animate-bounce" style={{ animationDelay: "1.5s" }}>
          <div className="w-10 h-7 rounded-sm overflow-hidden shadow-lg flex">
            <div className="w-1/3 bg-green-600"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-red-600"></div>
          </div>
        </div>
  
        {/* EU Flag */}
        <div className="absolute top-16 right-4 animate-pulse" style={{ animationDelay: "2s" }}>
          <div className="w-10 h-7 rounded-sm overflow-hidden shadow-lg bg-blue-800 flex items-center justify-center">
            <div className="text-yellow-400 text-xs">★</div>
          </div>
        </div>
  
        {/* US Flag */}
        <div className="absolute top-40 left-16 animate-bounce" style={{ animationDelay: "0.8s" }}>
          <div className="w-10 h-7 rounded-sm overflow-hidden shadow-lg">
            <div className="w-full h-full bg-red-600 relative">
              <div className="absolute top-0 left-0 w-2/5 h-2/5 bg-blue-800"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white"></div>
              <div className="absolute top-1 left-0 w-full h-0.5 bg-white"></div>
              <div className="absolute top-2 left-0 w-full h-0.5 bg-white"></div>
            </div>
          </div>
        </div>
  
        {/* Book Icon */}
        <div className="absolute top-4 right-2 animate-pulse" style={{ animationDelay: "2.5s" }}>
          <div className="w-8 h-8 text-[#5D38DE]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
          </div>
        </div>
  
        {/* Globe Icon */}
        <div
          className="absolute top-24 right-20 animate-spin"
          style={{ animationDuration: "8s", animationDelay: "1.2s" }}
        >
          <div className="w-8 h-8 text-blue-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
  
  export default FloatingIcons
  