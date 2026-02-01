import React from 'react';
import { IoArrowForward } from "react-icons/io5";
import { Link } from 'react-router-dom'; // <--- THIS IS THE MISSING PIECE

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-black">
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          poster="/misty-tea-fields-stockcake.webp" // Corrected path
        >
          <source src="/13261930_3840_2160_60fps.mp4" type="video/mp4" /> {/* Corrected path */}
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-4xl">
          <div className="overflow-hidden mb-4">
            <span className="inline-block text-emerald-400 font-bold tracking-[0.3em] uppercase text-sm animate-slide-up">
               EST. 2026 • Premium Organic Tea
            </span>
          </div>

          <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8 animate-fade-in-up">
            Pure Taste <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600">
              Hand Picked.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-lg font-light leading-relaxed mb-10 animate-fade-in-up delay-200">
            Discover the harmony of nature in every cup. Our estates practice sustainable 
            farming to bring you the freshest organic leaves straight to your doorstep.
          </p>

          <div className="flex flex-wrap gap-5 animate-fade-in-up delay-300">
            {/* LINK WRAPPER */}
            <Link to="/products">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-full font-bold text-xs tracking-[0.2em] flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-emerald-900/40 group">
                SHOP COLLECTION 
                <IoArrowForward className="text-lg group-hover:translate-x-2 transition-transform"/>
              </button>
            </Link>
            
            <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black text-white px-10 py-5 rounded-full font-bold text-xs tracking-[0.2em] transition-all duration-300">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      <style>{`
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