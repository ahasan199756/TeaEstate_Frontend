import React, { useState } from 'react';
import { IoArrowForward } from "react-icons/io5";
import { Link } from 'react-router-dom';

const trustStats = [
  { label: 'Happy Customers', value: '12k+' },
  { label: 'Dispatch Window', value: '24h' },
  { label: 'Organic Sourcing', value: '100%' },
];

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#0d1a14] text-white">
      <div className="absolute inset-0 z-0">
        <img
          src="/misty-tea-fields-stockcake.webp"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-45' : 'opacity-70'}`}
          alt="Tea estate landscape"
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-45' : 'opacity-0'}`}
        >
          <source src="/13261930_3840_2160_60fps.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/25" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10 pt-28 md:pt-20 pb-14">
        <div className="max-w-4xl bg-white/12 backdrop-blur-xl border border-white/25 rounded-[36px] p-6 md:p-10 shadow-2xl">
          <span className="inline-block mb-5 text-emerald-200 font-bold tracking-[0.28em] uppercase text-[11px] animate-slide-up">
            EST. 2026 • Calm, premium tea shopping
          </span>

          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tight mb-6 animate-fade-in-up text-white">
            Relaxed Sips.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-lime-200">
              Smoother Shopping.
            </span>
          </h1>

          <p className="text-base md:text-xl text-white/85 max-w-2xl font-light leading-relaxed mb-10 animate-fade-in-up delay-200">
            Discover single-estate teas in a calm, easy-to-browse store experience designed to feel peaceful, trustworthy, and user-friendly.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
            <Link
              to="/products"
              className="bg-[#5f9a74] hover:bg-[#4f8d67] text-white px-9 py-4 rounded-full font-bold text-xs tracking-[0.2em] flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-[#5f9a74]/30 group"
            >
              SHOP COLLECTION
              <IoArrowForward className="text-lg group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="bg-white/20 backdrop-blur-sm border border-white/35 hover:bg-white/30 text-white px-9 py-4 rounded-full font-bold text-xs tracking-[0.2em] transition-all duration-300"
            >
              OUR STORY
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl animate-fade-in-up delay-300">
            {trustStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md px-5 py-4">
                <p className="text-2xl font-black text-emerald-200">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/80 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .animate-fade-in-up { animation: fadeInUp 1.2s ease-out both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.4s; }
      `}</style>
    </section>
  );
};

export default Hero;
