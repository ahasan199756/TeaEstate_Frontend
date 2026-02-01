import React from 'react';

const About = () => {
  return (
    <div className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden bg-green-950">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/misty-tea-fields-stockcake.webp" 
          alt="Estate Background" 
          className="w-full h-full object-cover animate-slowZoom"
        />
        {/* Dark overlay with slight blur for readability */}
        <div className="absolute inset-0 bg-green-950/85 backdrop-blur-[2px]"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Column: Video Card */}
        <div className="relative group max-w-md mx-auto w-full">
          {/* 1. The Glow Effect behind the video */}
          <div className="absolute -inset-4 bg-green-500/20 rounded-[60px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

          {/* 2. The Video Container */}
          <div className="relative aspect-[4/5] rounded-[45px] overflow-hidden border border-white/10 shadow-2xl z-10 transition-transform duration-700 group-hover:-translate-y-2">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="/misty-tea-fields-stockcake.webp"
            >
              <source src="/13261930_3840_2160_60fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* 3. The Floating Badge */}
          <div className="absolute -bottom-8 -right-8 bg-green-500 text-white p-8 rounded-3xl hidden lg:block shadow-2xl border border-green-400 z-20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
            <p className="text-5xl font-black italic">25+</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-tight mt-1">
              Years of <br/> Estate Heritage
            </p>
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="space-y-8 text-white">
          <div className="space-y-4">
            <h5 className="text-green-400 font-bold tracking-[0.4em] uppercase text-sm">
              Our Story
            </h5>
            
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
              Grown with Soul, <br/> 
              <span className="text-white/40 italic">Steeped in Tradition.</span>
            </h2>
          </div>
          
          <p className="text-white/70 leading-relaxed text-lg max-w-md">
            Located in the lush hills of the Tea Estate, we believe in a symbiotic relationship with nature. 
            Every leaf is hand-plucked at dawn to preserve its essential antioxidants and pure flavor profile.
          </p>

          {/* Stats Row */}
          <div className="pt-10 border-t border-white/10 flex gap-16">
            <div className="group cursor-default">
              <p className="font-black text-4xl text-green-400 tracking-tighter transition-transform group-hover:scale-110">
                100%
              </p>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">
                Organic
              </p>
            </div>
            
            <div className="group cursor-default">
              <p className="font-black text-4xl text-green-400 tracking-tighter transition-transform group-hover:scale-110">
                Fair
              </p>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">
                Trade
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <button className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 hover:bg-green-500 hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(34,197,94,0.3)] active:scale-95">
            Discover Our Process
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;