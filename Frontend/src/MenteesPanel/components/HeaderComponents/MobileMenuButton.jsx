import React from 'react'

export default function MobileMenuButton({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button
      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}
