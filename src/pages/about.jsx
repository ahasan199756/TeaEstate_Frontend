import React from 'react';

const About = () => (
  // We remove bg-green-700 and use 'relative' to layer the background
  <div className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden">
    
    {/* --- BACKGROUND IMAGE LAYER --- */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/misty-tea-fields-stockcake.webp" // Directly from public folder
        alt="Estate Background" 
        className="w-full h-full object-cover"
      />
      {/* GREEN TRANSPARENT OVERLAY:
          bg-green-900/80 = 80% opacity
          backdrop-blur-sm = adds that modern 'frosted glass' feel
      */}
      <div className="absolute inset-0 bg-green-950/85 backdrop-blur-[2px]"></div>
    </div>

    {/* --- CONTENT LAYER --- */}
    <div className="container mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-16 items-center relative z-10">
      
      {/* Left Column: Floating Image Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <img 
          src="https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=2000" 
          className="relative rounded-[40px] shadow-2xl border border-white/10" 
          alt="Farm" 
        />
        <div className="absolute -bottom-6 -right-6 bg-green-500 text-white p-10 rounded-3xl hidden md:block shadow-2xl border border-green-400">
          <p className="text-4xl font-black">25+</p>
          <p className="text-xs font-bold uppercase tracking-widest">Years of Estate Heritage</p>
        </div>
      </div>

      {/* Right Column: Text Content */}
      <div className="space-y-6 text-white">
        <h5 className="text-green-400 font-bold tracking-[0.4em] uppercase text-sm">Our Story</h5>
        
        <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
          Grown with Soul, <br/> 
          <span className="text-white/60">Steeped in Tradition.</span>
        </h2>
        
        <p className="text-white/70 leading-relaxed text-lg max-w-md">
          Located in the lush hills of the Tea Estate, we believe in a symbiotic relationship with nature. 
          Every leaf is hand-plucked at dawn to preserve its essential antioxidants and pure flavor profile.
        </p>

        {/* Stats Row */}
        <div className="pt-8 border-t border-white/10 flex gap-12">
          <div>
            <p className="font-black text-3xl text-green-400 tracking-tighter">100%</p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Organic</p>
          </div>
          <div>
            <p className="font-black text-3xl text-green-400 tracking-tighter">Fair</p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Trade</p>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default About;