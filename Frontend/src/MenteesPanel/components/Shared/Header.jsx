import React, { useState } from "react"
import Logo from "../HeaderComponents/Logo"
import Navigation from "./Navigation"
import CTAButton from "../HeaderComponents/CTAButton"
import MobileMenuButton from "../HeaderComponents/MobileMenuButton"
import MobileMenu from "../HeaderComponents/MobileMenu"
import NotificationBell from "../../../shared/components/NotificationBell"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="static top-0 z-50 py-4">
      <div className="mx-8">
        <div className="bg-white rounded-lg shadow-lg px-6 py-2">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <Navigation />
            <div className="flex items-center gap-4">
              <NotificationBell />
              <CTAButton className="hidden md:block" />
            </div>
            <MobileMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
          <MobileMenu isMenuOpen={isMenuOpen} />
        </div>
      </div>
    </header>
  )
}
