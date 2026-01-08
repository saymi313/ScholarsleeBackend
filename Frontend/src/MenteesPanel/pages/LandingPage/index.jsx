import SEO from "../../../shared/components/SEO"
import { generateOrganizationSchema, generateWebSiteSchema, generateSiteNavigationSchema, generateBreadcrumbSchema } from "../../../shared/utils/schema"
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
      <SEO
        title="Scholarslee - Connect with Expert Mentors for Study Abroad Success"
        description="Find verified mentors to guide you through university applications, visa processes, and career planning. Join 1000+ students achieving their study abroad dreams."
        canonical="https://scholarslee.com/"
        schema={[
          generateOrganizationSchema(),
          generateWebSiteSchema(),
          generateSiteNavigationSchema(),
          generateBreadcrumbSchema([{ name: "Home", url: "/" }])
        ]}
      />

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
