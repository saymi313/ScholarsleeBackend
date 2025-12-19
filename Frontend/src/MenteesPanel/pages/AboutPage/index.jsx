import HeroSection from "../../components/AboutComponents/HeroSection"
import MissionSection from "../../components/AboutComponents/MissionSection"
import VisionSection from "../../components/AboutComponents/VisionSection"
import HowItWorksSection from "../../components/AboutComponents/HowItsWorksSection"
import Header from "../../components/Shared/Header"
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
        <Header />
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <HowItWorksSection />
    </div>
  )
}

export default AboutPage
