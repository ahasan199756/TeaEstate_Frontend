import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';

const featured = [
  { id: 1, name: "Misty Mountain Green", price: "$24", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "Ancient Black Tea", price: "$18", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "Silver Needle White", price: "$32", img: "https://images.unsplash.com/photo-1563911191283-d4c3822f7823?auto=format&fit=crop&q=80&w=500" },
  { id: 4, name: "Golden Oolong", price: "$28", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=500" },
  { id: 5, name: "Emerald Dragon", price: "$35", img: "https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&q=80&w=500" },
  { id: 6, name: "Velvet Pu-erh", price: "$42", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=500" },
  { id: 7, name: "Ceremonial Matcha", price: "$48", img: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=500" },
  { id: 8, name: "Midnight Jasmine", price: "$22", img: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=500" },
  { id: 9, name: "Himalayan Gold", price: "$38", img: "https://images.unsplash.com/photo-1597481416685-610196726859?auto=format&fit=crop&q=80&w=500" },
  { id: 10, name: "Crimson Hibiscus", price: "$16", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=500" },
];

const Home = () => {
  return (
    <div className="bg-green-950 min-h-screen selection:bg-green-500 selection:text-white">
      <Hero />
      
      {/* 1. FEATURED COLLECTION: INFINITE MARQUEE */}
<section className="py-32 bg-green-950 overflow-hidden">
  <div className="container mx-auto px-6 lg:px-16 mb-16">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="space-y-2">
        <h5 className="text-green-400 font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs">
          Curated Selection
        </h5>
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
          Featured <br /> Collection
        </h2>
      </div>
      <Link to="/products" className="group flex items-center gap-2 text-white text-sm font-bold tracking-widest hover:text-green-400 transition-all duration-300">
        <span className="border-b-2 border-green-500/50 group-hover:border-green-400 pb-1">VIEW ALL PRODUCTS</span>
        <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </div>

  {/* The Moving Track Wrapper */}
  <div className="relative flex overflow-hidden border-y border-white/5 py-10">
    {/* Edge Fades */}
    <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-green-950 via-green-950/80 to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-green-950 via-green-950/80 to-transparent z-10 pointer-events-none" />

    {/* Animating Track: Using min-w-max is vital here */}
    <div className="flex min-w-max animate-marquee group hover:[animation-play-state:paused] will-change-transform">
      {/* We map twice to create the infinite illusion */}
      {[...featured, ...featured].map((item, index) => (
        <div key={`${item.id}-${index}`} className="flex-shrink-0 px-4 md:px-6">
          <div className="w-72 md:w-96 relative overflow-hidden rounded-[40px] bg-white/5 border border-white/10 p-4 transition-all duration-500 hover:bg-white/10 hover:border-green-500/30">
            <div className="overflow-hidden rounded-[30px] aspect-[4/5] relative group/card">
              <img 
                src={item.img} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 will-change-transform" 
                alt={item.name} 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="mt-6 flex justify-between items-center px-2 pb-2 text-white">
              <div className="max-w-[180px] md:max-w-[240px]">
                <h3 className="text-lg font-bold truncate uppercase tracking-tight">{item.name}</h3>
                <p className="text-green-400 text-sm font-black font-mono">{item.price}</p>
              </div>
              <button className="bg-white text-black h-12 w-12 rounded-full font-black text-[10px] hover:bg-green-400 hover:text-white transition-all duration-300 shadow-xl active:scale-90 flex-shrink-0">
                ADD
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* 2. HERITAGE SECTION: ASYMMETRIC DESIGN */}
      <section className="py-32 bg-white rounded-t-[60px] md:rounded-t-[100px] px-6 lg:px-16 text-black relative z-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-4 bg-green-100 rounded-[60px] -rotate-1 scale-95 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="relative overflow-hidden rounded-[50px] shadow-2xl border border-black/5 aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover animate-slowZoom will-change-transform" 
                alt="Tea Estate Heritage" 
              />
            </div>
            <div className="absolute -bottom-10 -right-4 md:-right-10 bg-green-600 text-white p-8 md:p-12 rounded-[40px] shadow-2xl z-10 hidden sm:block">
              <p className="text-5xl md:text-7xl font-black italic leading-none">25+</p>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-90 mt-2">Years of Estate Heritage</p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h5 className="text-green-800 font-bold tracking-[0.4em] uppercase text-xs">Our Heritage</h5>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-balance">
              Sourced from the <br/>
              <span className="text-green-600 italic font-serif lowercase">edge</span> of the world.
            </h2>
            <p className="text-xl text-gray-500 max-w-md leading-relaxed font-medium">
              Every leaf tells a story of the soil it grew in. We partner exclusively with sustainable estates to bring you clarity in every cup.
            </p>
            <button className="px-10 py-4 border-2 border-black rounded-full font-bold uppercase text-xs hover:bg-black hover:text-white transition-all">
              Discover Our Process
            </button>
          </div>
        </div>
      </section>

      {/* 3. CONTACT SECTION: MINIMALIST FORM */}
      <section className="py-32 px-6 lg:px-16 bg-white border-t border-black/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="sticky top-10">
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-none">
                Reach <br/> Out.
              </h2>
              <div className="space-y-6">
                <p className="text-gray-400 uppercase font-black tracking-widest text-[10px] md:text-xs">
                  Based in Portland, OR — Shipping Worldwide
                </p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:hello@steep.com" className="text-2xl md:text-4xl font-bold hover:text-green-600 transition-colors">hello@steep.com</a>
                  <a href="tel:+15035550199" className="text-2xl md:text-4xl font-bold hover:text-green-600 transition-colors">+1 (503) 555-0199</a>
                </div>
              </div>
            </div>
            
            <form className="flex flex-col gap-10 bg-gray-50 p-8 md:p-12 rounded-[50px]" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-8">
                <div className="group relative">
                  <input type="text" placeholder="NAME" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent font-bold placeholder:text-gray-300 placeholder:font-black" />
                </div>
                <div className="group relative">
                  <input type="email" placeholder="EMAIL" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent font-bold placeholder:text-gray-300 placeholder:font-black" />
                </div>
                <div className="group relative">
                  <textarea placeholder="MESSAGE" rows="4" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent resize-none font-bold placeholder:text-gray-300 placeholder:font-black"></textarea>
                </div>
              </div>
              <button className="bg-black text-white w-full md:w-auto px-12 py-6 rounded-full font-black uppercase text-sm hover:bg-green-600 transition-all active:scale-95 shadow-2xl">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
//Build Infinite Carousel Animations