import { useEffect, useState, useRef } from 'react';

export default function PortfolioContent() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Delay showing content slightly for better visual effect
    const timer = setTimeout(() => {
      setVisible(true);
    }, 700);
    
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / scrollHeight;
      
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Decorative stars with different sizes and positions
  const stars = [
    { size: 6, top: '20%', right: '15%', opacity: 0.8 },
    { size: 8, top: '30%', right: '25%', opacity: 0.9 },
    { size: 4, top: '25%', right: '10%', opacity: 0.7 },
    { size: 5, top: '40%', right: '20%', opacity: 0.8 },
    { size: 7, top: '15%', right: '30%', opacity: 0.9 },
    { size: 4, top: '35%', right: '35%', opacity: 0.7 },
    { size: 6, top: '45%', right: '18%', opacity: 0.8 },
    { size: 9, top: '50%', right: '25%', opacity: 0.9 },
    { size: 5, top: '55%', right: '15%', opacity: 0.7 },
    { size: 7, top: '60%', right: '30%', opacity: 0.8 },
  ];

  return (
    <div 
      ref={contentRef}
      className={`min-h-screen transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Custom scrollbar at top */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#20202033] z-50">
        <div 
          className="h-full bg-[#714DD7]"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Decorative stars on right side */}
      {stars.map((star, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            top: star.top,
            right: star.right,
            width: star.size,
            height: star.size,
            backgroundColor: '#714DD7',
            opacity: star.opacity,
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(113, 77, 215, 0.3)',
            zIndex: 1,
          }}
        />
      ))}

      {/* Minimalist hero section */}
      <section className="min-h-screen flex items-center">
        <div className="container mx-auto pl-[150px] pr-12">
          <div className="max-w-4xl relative">
            <h1 
              className="text-[#D8D7D7] text-[72px] md:text-8xl lg:text-9xl font-light mb-8"
              style={{ lineHeight: '1.0' }}
            >
              hi, i'm nichtvikki
            </h1>
            
            <p className="text-[#878787] text-[32px] md:text-3xl font-light mb-16 max-w-xl">
              a designer and developer who loves clean, casual aesthetics.
            </p>
            
            <div className="flex flex-wrap gap-[20px] mt-[20px]">
                <button
                    className="
                    px-12 py-5
                    bg-[#714DD7] text-[#D8D7D7] text-[24px]
                    rounded-lg
                    transition duration-200
                    hover:bg-[#5a3bb5] hover:scale-105
                    shadow-md
                    "
                >
                    see my work
                </button>
                <button
                    className="
                    px-12 py-5
                    bg-[#1A1A1A] text-[#878787] text-[24px]
                    rounded-lg
                    transition duration-200
                    hover:bg-[#333] hover:text-white hover:scale-105
                    shadow-md
                    "
                >
                    let's talk
                </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 