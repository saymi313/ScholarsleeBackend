import { Helmet } from 'react-helmet-async'
import HeroSection from "../../components/MentorComponents/HeroSection"
import Mentor from "../../components/MentorComponents/Mentor"
import Header from "../../components/Shared/Header"
import SuccessStory from "../../components/MentorComponents/SuccessStory"
import Testimonials from "../../components/Shared/Testimonials"

const MentorPage = () => {
  return (
    <>
      <Helmet>
        <title>Find Your Perfect Mentor | Scholarslee</title>
        <meta name="description" content="Browse verified mentors specializing in university applications, visa guidance, career planning, and scholarship assistance. Connect with experts who've been through your journey." />
        <link rel="canonical" href="https://scholarslee.com/mentees/mentors" />
        <meta property="og:title" content="Find Your Perfect Mentor | Scholarslee" />
        <meta property="og:description" content="Browse verified mentors specializing in university applications, visa guidance, and career planning." />
        <meta property="og:url" content="https://scholarslee.com/mentees/mentors" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        <Header />
        <HeroSection />
        <Mentor />
        <Testimonials />
        <SuccessStory />
      </div>
    </>
  )
}

export default MentorPage
