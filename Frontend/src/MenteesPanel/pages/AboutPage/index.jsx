import HeroSection from "../../components/AboutComponents/HeroSection"
import MissionSection from "../../components/AboutComponents/MissionSection"
import VisionSection from "../../components/AboutComponents/VisionSection"
import HowItWorksSection from "../../components/AboutComponents/HowItsWorksSection"
import Header from "../../components/Shared/Header"
import SEO from "../../../shared/components/SEO"
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SEO
        title="About Scholarslee - Our Mission and Vision"
        description="Learn more about Scholarslee, our mission to bridge the gap in international education, and our vision for global student mentorship."
        canonical="https://scholarslee.com/about"
      />
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <HowItWorksSection />
    </div>
  )
}

export default AboutPage
