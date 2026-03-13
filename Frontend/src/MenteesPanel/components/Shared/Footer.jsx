export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#5D38DE] via-[#6B42E8] to-[#7C4DFF] text-white overflow-hidden">
      {/* Animated glowing circles - More prominent */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Scholarslee</h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                From one student to another </p>
            </div>

            {/* Social Links - Redesigned */}
            <div className="flex items-center space-x-3">
              <a href="https://www.linkedin.com/company/scholarslee/" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/scholarslee/" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              QUICK LINKS
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/about" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  About us
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/contact" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  Contact us
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/login" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  Login
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/signup" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              NAVIGATION
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/mentees/services" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  Services
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                <a href="/mentees/mentors" className="text-purple-100 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                  Mentors
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              CONTACT
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></span>
            </h3>
            <div className="space-y-3">

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+188812345678" className="text-purple-100 text-sm hover:text-white transition-colors duration-300">
                  (888) 1234-5678
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:info@scholarslee.com" className="text-purple-100 text-sm hover:text-white transition-colors duration-300">
                  info@scholarslee.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/20">
          <p className="text-purple-200 text-sm text-center">
            © 2026 Scholarslee. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-7 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-40 border border-white/30"
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}