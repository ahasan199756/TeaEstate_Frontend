import React, { useState, useEffect } from 'react';
import { 
  IoCartOutline, 
  IoChevronForward, 
  IoFlash, 
  IoShieldCheckmark, 
  IoGridOutline, 
  IoLeafOutline, 
  IoSyncOutline, 
  IoLocationOutline 
} from "react-icons/io5";
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  
  const backgrounds = [
    "/misty-tea-fields-stockcake.webp",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563911892149-290f112348b9?q=80&w=2046&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  const categories = [
    "Reserve Green Tea", "Rare Black Leaves", "Artisan White & Herbal", 
    "Precision Accessories", "Curated Gift Sets", "Private Collection", "Wellness Elixirs"
  ];

  return (
    <section className="relative bg-[#010801] pt-28 pb-16 px-4 md:px-10 lg:px-20 min-h-screen flex flex-col justify-center overflow-hidden">
      
      {/* --- DYNAMIC BACKGROUND CAROUSEL --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === currentBg ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={bg} 
              className="w-full h-full object-cover animate-ken-burns scale-110"
              alt="Tea Estate"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#010801] via-transparent to-[#010801] z-10" />
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20 w-full">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="hidden lg:block lg:col-span-3 bg-black/30 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl self-start">
          <div className="p-6 border-b border-white/5 bg-white/5 text-white font-bold flex items-center gap-3 tracking-[0.2em] uppercase text-[10px]">
             <IoGridOutline size={14} className="text-emerald-400" />
             Collections
          </div>
          <ul className="py-6 px-2">
            {categories.map((cat, i) => (
              <li key={i} className="px-6 py-3 text-white/60 hover:text-white hover:bg-emerald-500/10 rounded-2xl cursor-pointer flex justify-between items-center text-[11px] font-medium tracking-widest uppercase transition-all group">
                {cat}
                <IoChevronForward className="opacity-0 group-hover:opacity-100 transition-all text-emerald-500" />
              </li>
            ))}
          </ul>
        </div>

        {/* --- CENTER CONTENT --- */}
        <div className="lg:col-span-6 flex flex-col justify-center py-10 px-4">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
              <span className="h-[1.5px] w-12 bg-emerald-500 rounded-full"></span>
              <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">Premium Organic Tea</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-serif text-white leading-[0.95] tracking-tighter mb-8 italic">
            Nature’s <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-400">
              Purest Gold.
            </span>
          </h2>

          <div className="flex flex-wrap gap-4 mb-10">
            <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-400 tracking-wider">
               <IoLeafOutline /> 100% ORGANIC
            </span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-white/70 tracking-wider">
               <IoSyncOutline /> 7 DAY RETURN
            </span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-white/70 tracking-wider">
               <IoLocationOutline /> DELIVERY ALL OVER BD
            </span>
          </div>

          <Link to="/products">
            <button className="w-fit bg-emerald-500 text-black px-12 py-5 rounded-full font-black text-[11px] tracking-[0.3em] transition-all hover:bg-white hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95">
              SHOP THE HARVEST
            </button>
          </Link>
        </div>

        {/* --- RIGHT FOCUS CARDS --- */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-white/15 to-transparent backdrop-blur-2xl rounded-[40px] p-8 border border-white/10 relative group cursor-pointer overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1 rounded-full w-fit mb-4">BEST SELLER</div>
              <h3 className="text-2xl font-light text-white mb-6 tracking-tight leading-tight italic">Ceremonial <br/>Grade Matcha</h3>
              <p className="text-white text-3xl font-bold italic">৳3,400</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110">
                <IoCartOutline size={150} className="text-white" />
            </div>
          </div>

          <div className="flex-1 relative bg-black/60 backdrop-blur-md rounded-[40px] p-8 border border-emerald-500/20 group cursor-pointer hover:border-emerald-500/60 transition-all duration-1000 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full animate-pulse pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] animate-pulse" />
                 <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em]">Pure Affection</p>
              </div>
              <h3 className="text-2xl font-light text-white/90 tracking-tight leading-tight italic transition-all duration-700 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                  Send a gift <br/> 
                  <span className="font-serif">to your loved ones</span>
              </h3>
            </div>

            <div className="relative z-10 mt-6">
              <p className="text-emerald-500 text-[10px] font-black tracking-[0.4em] flex items-center gap-3 group-hover:gap-5 transition-all duration-700">
                TAILOR YOUR GIFT <IoChevronForward className="group-hover:scale-125 transition-transform" />
              </p>
            </div>
            <div className="absolute inset-0 rounded-[40px] border border-emerald-500/10 group-hover:border-emerald-500/40 transition-all duration-700 pointer-events-none shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" />
          </div>
        </div>
      </div>

      {/* --- TRUST FOOTER --- */}
      <div className="max-w-[1440px] mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full bg-white/[0.02] backdrop-blur-sm p-8 rounded-[32px] border border-white/5 relative z-20">
        {[
          { icon: <IoShieldCheckmark />, title: "Certified Purity", sub: "Lab Tested" },
          { icon: <IoFlash />, title: "Express Concierge", sub: "24h Response" },
          { icon: <IoLeafOutline />, title: "Sustainable Origin", sub: "Direct Trade" },
          { icon: <IoCartOutline />, title: "Secure Checkout", sub: "SSL Encrypted" },
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4 group cursor-default">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 text-xl group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">{feat.icon}</div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{feat.title}</h4>
              <p className="text-[9px] text-white/30 uppercase tracking-tighter">{feat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.2) translate(1%, 1%); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns { animation: ken-burns 20s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 1.5s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;