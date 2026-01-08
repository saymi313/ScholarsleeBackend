"use client"

import { useState, useEffect } from "react"
import ReactCountryFlag from "react-country-flag"
import { Quote, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react"
import SuccessStoryModal from "./SuccessStoryModal"

const AnimationStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInUp {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    .animate-slide-up {
      animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .perspective-1000 {
      perspective: 1000px;
    }
    /* Custom scrollbar hiding */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-scroll {
        animation: scroll 60s linear infinite; /* Slower, smoother scroll */
    }
    .animate-scroll:hover {
        animation-play-state: paused;
    }
  `,
    }}
  />
)

export default function SuccessStory() {
  const [successStories, setSuccessStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStory, setSelectedStory] = useState(null)

  useEffect(() => {
    const successStoriesData = [
      {
        name: "Sophie Anderson",
        country: "Australia",
        countryCode: "AU",
        university: "DEAKIN UNIVERSITY",
        universityLogo: "/uni1.png",
        image: "/success-australia.png",
        testimonial:
          "The journey from application to arrival felt overwhelming until I found Scholarslee. My mentor didn't just help with papers; they gave me the confidence to excel in a new continent.",
        detailedStory:
          "Sophie always dreamed of studying Marine Biology in Australia but was lost in the maze of visa requirements and university selection. Her Scholarslee mentor, a Deakin alum, provided a step-by-step roadmap, coached her through the interview process, and even helped her find local student housing. Today, Sophie is thriving in her second year, maintaining a 3.8 GPA and contributing to coral reef research.",
        achievement: "100% Visa Success & Partial Scholarship",
        year: "2023 Intake",
        color: "from-blue-600 to-cyan-400",
      },
      {
        name: "Liam Thompson",
        country: "Canada",
        countryCode: "CA",
        university: "YORK UNIVERSITY",
        universityLogo: "/uni2.png",
        image: "/success-canada.png",
        testimonial:
          "I wanted more than a degree; I wanted a career. Scholarslee connected me with an industry veteran who refined my goals and helped me secure my spot at York.",
        detailedStory:
          "Liam was determined to study Computer Science in Canada but faced repeated rejections due to a lack of clarity in his Statement of Purpose. Scholarslee matched him with a senior developer at a top Canadian firm who helped him highlight his true potential. Through intensive SOP workshops and career mapping, Liam didn't just get into York University; he secured an internship offer before his third semester began.",
        achievement: "CS Internship at Tech Giant",
        year: "2022 Intake",
        color: "from-red-600 to-orange-400",
      },
      {
        name: "Oliver Bennett",
        country: "UK",
        countryCode: "GB",
        university: "UNIVERSITY OF WARWICK",
        universityLogo: "/uni3.png",
        image: "/success-uk.png",
        testimonial:
          "Studying in the UK seemed like a distant dream. The scholarship guidance I received at Scholarslee turned that dream into a reality at one of the world's best institutions.",
        detailedStory:
          "Oliver was an exceptional student with limited financial means. He knew Warwick was his best fit but the fees were prohibitive. His Scholarslee mentor specialized in UK scholarships and spent months helping Oliver polish his essays and portfolio. The hard work paid off when Oliver was awarded a prestigious merit-based scholarship that covered 50% of his tuition. He is now a top-tier Economics student at Warwick.",
        achievement: "50% Merit Scholarship Awardee",
        year: "2023 Intake",
        color: "from-indigo-600 to-purple-400",
      },
      {
        name: "Ahmed Al-Mansoori",
        country: "UAE",
        countryCode: "AE",
        university: "UNIVERSITY OF LIVERPOOL",
        universityLogo: "/uni4.png",
        image: "/success-uae.png",
        testimonial:
          "Moving from the UAE to the UK was a big step. Scholarslee made the transition seamless, providing local insights that no brochure could ever offer.",
        detailedStory:
          "Ahmed wanted to pursue Engineering but was concerned about the cultural and academic transition from Dubai to Liverpool. Scholarslee paired him with a mentor who had made the exact same journey two years prior. Beyond academic help, Ahmed received invaluable advice on networking, local student life, and professional opportunities in the UK. He is now the President of the Engineering Society at UoL.",
        achievement: "Student Society President",
        year: "2025 Intake",
        color: "from-emerald-600 to-teal-400",
      },
      {
        name: "Bilal Ahmed",
        country: "Germany",
        countryCode: "DE",
        university: "TU MUNICH",
        universityLogo: "/tu-munich.png",
        image: "/success-germany.png",
        testimonial:
          "Getting into a German public university was my goal, but the APS and visa process was daunting. Scholarslee's localized guidance made my dream of tuition-free education a reality!",
        detailedStory:
          "Bilal, an aspiring engineer from Pakistan, aimed for Germany's renowned TU Munich but struggled with the complex application and visa procedures. His Scholarslee mentor, a current master's student in Germany, guided him through every step—from drafting a strong motivation letter to acing the visa interview. Bilal is now pursuing his MS in Informatics at TUM, enjoying world-class education with zero tuition fees.",
        achievement: "100% Tuition Waiver",
        year: "2024 Intake",
        color: "from-yellow-600 to-black",
      },
    ]

    setTimeout(() => {
      setSuccessStories(successStoriesData)
      setLoading(false)
    }, 500)
  }, [])

  const openModal = (story) => {
    setSelectedStory(story)
  }

  const closeModal = () => {
    setSelectedStory(null)
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </section>
    )
  }

  return (
    <section
      id="success-stories"
      className="h-screen w-full relative flex flex-col justify-center overflow-hidden bg-[#F8F9FC] isolate"
    >
      <AnimationStyles />

      {/* Modern Abstract Geometric Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-indigo-50/50 to-blue-50/50 blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-50/50 to-pink-50/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#F8F9FC] to-transparent z-10"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center max-h-[900px]">
        {/* Header Section */}
        <div className="text-center mb-10 flex-shrink-0 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-6 animate-fade-in hover:shadow-md transition-shadow cursor-default">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Stories</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight animate-slide-up">
            Global Success.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Personal Journeys.
            </span>
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto text-base md:text-md leading-relaxed animate-slide-up font-light"
            style={{ animationDelay: "0.1s" }}
          >
            From aspirations to acceptance letters. See how Scholarslee mentors guide students to top universities
            worldwide.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="w-full relative py-8 flex-shrink-0">
          <div className="flex animate-scroll hover:pause gap-6 w-max px-8 items-center">
            {/* Tripled list for seamless infinite loop */}
            {[...successStories, ...successStories, ...successStories].map((story, index) => (
              <div
                key={`${story.name}-${index}`}
                onClick={() => openModal(story)}
                className="group relative w-[260px] md:w-[280px] h-[360px] flex-shrink-0 cursor-pointer perspective-1000"
              >
                <div className="relative w-full h-full bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)] transition-all duration-500 border border-gray-100/80 group-hover:border-indigo-100/50 group-hover:-translate-y-2 flex flex-col">
                  {/* Card Image Header - 45% Height */}
                  <div className="relative h-[45%] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 transition-opacity"></div>
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                        <ReactCountryFlag
                          countryCode={story.countryCode}
                          svg
                          style={{ width: "1em", height: "1em", borderRadius: "50%" }}
                        />
                        <span className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">
                          {story.country}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-indigo-600/90 backdrop-blur-md text-white px-2 py-1 rounded-full shadow-lg text-[9px] font-bold uppercase tracking-wider border border-white/10">
                        {story.year}
                      </div>
                    </div>

                    {/* Verified Status */}
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 opacity-90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      <span className="text-white text-[10px] font-medium tracking-wide">Verified</span>
                    </div>
                  </div>

                  {/* Card Body - 55% Height */}
                  <div className="relative p-4 flex flex-col h-[55%]">
                    {/* Floating Uni Logo */}
                    <div className="absolute -top-6 right-4 w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-500 z-20">
                      <img
                        src={story.universityLogo || "/placeholder.svg"}
                        alt={story.university}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-1">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {story.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-indigo-600/80">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide line-clamp-1">
                          {story.university}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 relative flex-grow">
                      <Quote className="w-6 h-6 text-gray-100 absolute -top-3 -left-1 -z-10" />
                      <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-3">"{story.testimonial}"</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Stats</div>
                      <div className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md max-w-[70%] truncate">
                        {story.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SuccessStoryModal story={selectedStory} onClose={closeModal} />
    </section>
  )
}
