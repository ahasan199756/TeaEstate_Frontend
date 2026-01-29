import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import { useCart } from "../components/Cart/CartContext";

const featured = [
  { id: 101, name: "Misty Mountain Green", price: "$24", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
  { id: 102, name: "Ancient Black Tea", price: "$18", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
  { id: 103, name: "Silver Needle White", price: "$32", img: "https://images.unsplash.com/photo-1563911191283-d4c3822f7823?auto=format&fit=crop&q=80&w=500" },
  { id: 104, name: "Golden Oolong", price: "$28", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=500" },
  { id: 105, name: "Emerald Dragon", price: "$35", img: "https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&q=80&w=500" },
  { id: 106, name: "Velvet Pu-erh", price: "$42", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=500" },
  { id: 107, name: "Ceremonial Matcha", price: "$48", img: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=500" },
  { id: 108, name: "Midnight Jasmine", price: "$22", img: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=500" },
  { id: 109, name: "Himalayan Gold", price: "$38", img: "https://images.unsplash.com/photo-1597481416685-610196726859?auto=format&fit=crop&q=80&w=500" },
  { id: 110, name: "Crimson Hibiscus", price: "$16", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=500" },
];

const Home = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, name: "" });

  const handleAddToCart = (item) => {
    // 1. Convert "$24" string to number 24 for the cart logic
    const numericPrice = Number(item.price.replace(/[^0-9.-]+/g, ""));
    
    // 2. Call the context function
    addToCart({ ...item, price: numericPrice });

    // 3. Trigger Popup
    setNotification({ show: true, name: item.name });
    
    // 4. Auto-hide after 2.5 seconds
    setTimeout(() => {
      setNotification({ show: false, name: "" });
    }, 2500);
  };

  return (
    <div className="bg-green-950 min-h-screen selection:bg-green-500 selection:text-white relative">
      
      {/* --- POPUP NOTIFICATION --- */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-green-500/20">
          <div className="bg-green-500 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Added to Cart</p>
            <p className="text-sm font-bold uppercase">{notification.name}</p>
          </div>
        </div>
      </div>

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
            <Link to="/products" className="group flex items-center gap-1 text-white text-sm font-bold tracking-widest hover:text-green-400 transition-all duration-300">
              <span className="border-b-2 border-green-500/50 group-hover:border-green-400 pb-1">VIEW ALL PRODUCTS</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        <div className="relative flex overflow-hidden border-y border-white/5 py-5">
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-green-950 via-green-950/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-green-950 via-green-950/80 to-transparent z-10 pointer-events-none" />

          <div className="flex min-w-max animate-marquee group hover:[animation-play-state:paused] will-change-transform">
            {[...featured, ...featured].map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 px-4 md:px-6">
                <div className="w-40 md:w-60 relative overflow-hidden rounded-[40px] bg-white/5 border border-white/10 p-4 transition-all duration-500 hover:bg-white/10 hover:border-green-500/30">
                  <div className="overflow-hidden rounded-[30px] aspect-[4/5] relative group/card">
                    <img 
                      src={item.img} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 will-change-transform" 
                      alt={item.name} 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="mt-6 flex justify-between items-center px-2 pb-2 text-white">
                    <div className="flex-1 min-w-0 mr-3"> 
                      <h3 className="text-lg font-bold truncate uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-green-400 text-sm font-black font-mono">
                        {item.price}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center justify-center h-12 w-12 min-w-[3rem] rounded-full bg-white text-black font-black text-[10px] hover:bg-green-400 hover:text-white transition-all duration-300 shadow-xl active:scale-90 flex-shrink-0"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HERITAGE SECTION */}
      <section className="py-32 bg-white rounded-t-[60px] md:rounded-t-[100px] px-6 lg:px-16 text-black relative z-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-4 bg-green-100 rounded-[60px] -rotate-1 scale-95 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="relative overflow-hidden rounded-[50px] shadow-2xl border border-black/5 aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover" 
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

      {/* 3. CONTACT SECTION */}
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
                <input type="text" placeholder="NAME" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent font-bold placeholder:text-gray-300 placeholder:font-black" />
                <input type="email" placeholder="EMAIL" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent font-bold placeholder:text-gray-300 placeholder:font-black" />
                <textarea placeholder="MESSAGE" rows="4" className="w-full border-b-2 border-black/10 py-4 focus:outline-none focus:border-green-600 transition-colors bg-transparent resize-none font-bold placeholder:text-gray-300 placeholder:font-black"></textarea>
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