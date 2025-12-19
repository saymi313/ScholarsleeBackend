import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from "../../components/Shared/Header"
import HeroSection from "./HeroSection"
import Partner from "./Partner"
import Mentor from "./Mentor"
import RegisterFlow from "./RegisterFlow"
import MentorJoin from "./MentorJoin"
import SuccessStory from "./SuccessStory"
import Counseling from "./Counseling"
import Destinations from "./Destinations"
import FAQS from "./FAQS"

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Scholarslee - Connect with Expert Mentors for Study Abroad Success</title>
        <meta name="description" content="Find verified mentors to guide you through university applications, visa processes, and career planning. Join 1000+ students achieving their study abroad dreams." />
        <link rel="canonical" href="https://scholarslee.com/" />
        <meta property="og:title" content="Scholarslee - Your Gateway to Study Abroad Success" />
        <meta property="og:description" content="Connect with verified mentors who have been through the journey. Get personalized guidance for university applications, visas, and career planning." />
        <meta property="og:url" content="https://scholarslee.com/" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans w-full no-zoom">
        <Header />
        <HeroSection />
        <Partner />
        <Mentor />
        <RegisterFlow />
        <MentorJoin />
        <SuccessStory />
        <Counseling />
        <Destinations />
        <FAQS />
      </div>
    </>
  )
}
