import React, { useState, useEffect } from 'react';
import { IoArrowForward } from "react-icons/io5";

const images = [
  "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1563911191470-85bc9107d93e?auto=format&fit=crop&q=80&w=2000"
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000); // Change every 7 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-black">
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <img 
            key={img}
            src={img} 
            alt={`Tea Plantation ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
              ${index === currentImage ? "opacity-100" : "opacity-0"}
              animate-[slowZoom_25s_infinite_alternate]`}
          />
        ))}
        {/* Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-4xl">
          <div className="overflow-hidden mb-4">
             <span className="inline-block text-green-400 font-bold tracking-[0.3em] uppercase text-sm animate-slide-up">
               EST. 2026 • Premium Organic Tea
            </span>
          </div>

          <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8 animate-fade-in-up">
            Pure Taste <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-600">
              Hand Picked.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-lg font-light leading-relaxed mb-10 animate-fade-in-up delay-200">
            Discover the harmony of nature in every cup. Our estates practice sustainable 
            farming to bring you the freshest organic leaves straight to your doorstep.
          </p>

          <div className="flex flex-wrap gap-5 animate-fade-in-up delay-300">
            <button className="bg-green-500 hover:bg-green-400 text-white px-10 py-5 rounded-full font-bold text-xs tracking-[0.2em] flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-green-900/20 group">
              SHOP COLLECTION 
              <IoArrowForward className="text-lg group-hover:translate-x-2 transition-transform"/>
            </button>
            
            <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black text-white px-10 py-5 rounded-full font-bold text-xs tracking-[0.2em] transition-all duration-300">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* --- DECORATIVE ELEMENTS --- */}
      <div className="absolute bottom-12 left-6 lg:left-16 z-10 hidden md:flex items-center gap-4">
        <div className="h-px w-20 bg-green-500/50"></div>
        <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-medium">
          Scroll to Explore
        </span>
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.4s; }
      `}</style>
    </section>
  );
};

export default Hero;