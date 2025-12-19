import React from 'react'

const Partner = () => {
  const partners = [
    { src: "/uni1.png", alt: "Partner 1" },
    { src: "/uni2.png", alt: "Partner 2" },
    { src: "/uni3.png", alt: "Partner 3" },
    { src: "/uni4.png", alt: "Partner 4" },
    { src: "/uni5.png", alt: "Partner 5" },
    { src: "/uni6.png", alt: "Partner 6" },
  ]

  return (
    <div className='w-full flex flex-col items-center justify-center py-8'>
        <h1 className='text-3xl md:text-4xl font-bold mb-8 text-[#5D38DE] text-center'>Partnered with</h1>
        
        {/* Desktop: Static layout */}
        <div className='hidden md:flex w-full items-center justify-center gap-8'>
            {partners.map((partner, index) => (
              <img 
                key={index} 
                src={partner.src} 
                alt={partner.alt} 
                className='h-12 w-auto object-contain' 
              />
            ))}
        </div>

        {/* Mobile: Infinite scroll carousel */}
        <div className='md:hidden w-full overflow-hidden'>
          <div className='flex gap-6 animate-infinite-scroll'>
            {/* Render images 3 times for seamless loop */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <img 
                key={index} 
                src={partner.src} 
                alt={partner.alt} 
                className='h-10 w-auto object-contain flex-shrink-0' 
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes infinite-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }

          .animate-infinite-scroll {
            animation: infinite-scroll 5s linear infinite;
          }

          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
    </div>
  )
}

export default Partner