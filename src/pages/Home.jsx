import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion'; 
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

// --- Sub-component for dynamic text reveal ---
const RevealText = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Home = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, name: "" });
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth / 3);
    }
  }, []);

  useEffect(() => {
    if (width > 0) {
      controls.start({
        x: -width,
        transition: { duration: 35, ease: "linear", repeat: Infinity },
      });
    }
  }, [width, controls]);

  const handleAddToCart = (item) => {
    const numericPrice = Number(item.price.replace(/[^0-9.-]+/g, ""));
    addToCart({ ...item, price: numericPrice });
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2500);
  };

  return (
    <div className=" min-h-screen selection:bg-green-500 selection:text-white relative">
      
      {/* POPUP NOTIFICATION */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-green-500/20">
          <div className="bg-green-500 rounded-full p-1"><svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Added to Cart</p><p className="text-sm font-bold uppercase">{notification.name}</p></div>
        </div>
      </div>

      <Hero />
      
     {/* --- MERGED PRODUCT & HERITAGE EXPERIENCE --- */}
<div className="relative overflow-hidden bg-[#062016]">
  
  {/* GLOBAL BACKGROUND (Spans both sections) */}
  <div className="absolute inset-0 z-0">
    <img 
      src="public/misty-tea-fields-stockcake.webp" 
      alt="Texture" 
      className="w-full h-full object-cover opacity-50 scale-110 animate-[slowZoom_60s_infinite_alternate]"
    />
    {/* Unified Gradient Overlay: Darker at top/bottom, slightly clearer in the middle */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#062016] via-[#062016]/80 to-[#062016]"></div>
  </div>

  <section className="pt-32 pb-16 relative z-10">
  <div className="container mx-auto px-6 lg:px-16 mb-16">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="space-y-2">
        <RevealText className="text-emerald-400/80 font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs">
          Curated Selection
        </RevealText>
        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
          <RevealText>Featured</RevealText>
          <RevealText className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-100 to-emerald-300 bg-[length:200%_auto] animate-gradient-x">
            Collection
          </RevealText>
        </h2>
      </div>
      <Link to="/products" className="group flex items-center gap-1 text-white/80 text-sm font-bold tracking-widest hover:text-emerald-400 transition-all duration-300">
        <span className="border-b-2 border-emerald-500/30 group-hover:border-emerald-400 pb-1 uppercase">Explore All</span>
        <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </div>

  {/* CAROUSEL WITH GLASS GREEN FINISH */}
  <div className="relative border-y border-white/10 py-10 group">
    {/* Side Fades */}
    <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#062016] via-[#062016]/40 to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#062016] via-[#062016]/40 to-transparent z-10 pointer-events-none" />

    <motion.div 
      ref={carouselRef}
      className="flex min-w-max cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ right: 0, left: -width * 2 }}
      animate={controls}
      onDragStart={() => controls.stop()}
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => {
        controls.start({ x: -width, transition: { duration: 35, ease: "linear", repeat: Infinity } });
      }}
    >
      {[...featured, ...featured, ...featured].map((item, index) => (
        <div key={`${item.id}-${index}`} className="flex-shrink-0 px-5 md:px-8 select-none">
          {/* THE GLASS CARD */}
          <div className="w-56 md:w-72 relative overflow-hidden rounded-[45px] 
                          bg-emerald-900/10 backdrop-blur-2xl 
                          border border-white/20 p-5 
                          transition-all duration-700 
                          hover:bg-emerald-500/10 hover:border-emerald-400/50 
                          hover:-translate-y-4 hover:shadow-[0_20px_80px_rgba(16,185,129,0.2)]">
            
            {/* Glossy Overlay Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="overflow-hidden rounded-[35px] aspect-[4/5] relative group/card shadow-2xl border border-white/5">
              <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 pointer-events-none" alt={item.name} />
            </div>

            <div className="mt-8 flex justify-between items-center px-2 relative z-10">
              <div className="flex-1 min-w-0 mr-4"> 
                <h3 className="text-lg font-bold text-white truncate uppercase tracking-wide">{item.name}</h3>
                <p className="text-emerald-300 font-mono font-bold mt-1 drop-shadow-md">{item.price}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} 
                className="relative h-14 w-14 rounded-full bg-emerald-400 text-[#062016] 
                           transition-all hover:bg-white hover:scale-110 
                           shadow-[0_0_20px_rgba(52,211,153,0.4)] 
                           active:scale-90 flex-shrink-0 font-black text-[10px]"
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
</section>

  {/* SECTION 2: HERITAGE (Merged smoothly) */}
  <section className="pb-32 pt-16 px-6 lg:px-16 relative z-10">
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
      
      {/* Left Column: Image */}
      <div className="lg:col-span-7 relative group order-2 lg:order-1">
        <div className="absolute -inset-4 bg-emerald-500/5 backdrop-blur-xl rounded-[60px] -rotate-1 scale-95 group-hover:rotate-0 transition-transform duration-700 border border-white/5 shadow-2xl"></div>
        <div className="relative overflow-hidden rounded-[50px] shadow-2xl aspect-video border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Heritage" 
          />
        </div>
      </div>

      {/* Right Column: Text Content */}
      <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
        <RevealText className="text-emerald-400 font-bold tracking-[0.4em] uppercase text-xs">
          Our Heritage
        </RevealText>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
          <RevealText>Sourced from the</RevealText>
          <RevealText className="text-emerald-200/40 italic font-serif lowercase">
            edge of the world.
          </RevealText>
        </h2>
        <p className="text-xl text-white/60 max-w-md leading-relaxed font-medium">
          Every leaf tells a story of the soil it grew in. Sustainability in every cup.
        </p>
        <motion.button 
          whileHover={{ y: -5, backgroundColor: "white", color: "black" }} 
          whileTap={{ scale: 0.95 }} 
          className="px-10 py-4 border-2 border-white/20 text-white rounded-full font-bold uppercase text-xs backdrop-blur-md transition-all duration-300 hover:border-white"
        >
          Discover Our Process
        </motion.button>
      </div>
    </div>
  </section>
</div>
      

      {/* 3. CONTACT SECTION */}
      <section className="py-32 px-6 lg:px-16 bg-black border-t border-black/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="sticky top-10">
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                <RevealText className="text-green-600">Reach</RevealText>
                <RevealText className="text-green-600">Out.</RevealText>
              </h2>
              <div className="space-y-6 mt-8">
                <p className="text-gray-400 uppercase font-black tracking-widest text-[10px]">Based in Portland — Worldwide</p>
                <div className="flex flex-col gap-2 text-gray-400">
                  <a href="mailto:hello@teaEstate.com" className="text-2xl md:text-4xl font-bold hover:text-green-600 transition-colors">hello@teaEstate.com</a>
                  <a href="tel:+8801700000000" className="text-2xl md:text-4xl font-bold hover:text-green-600 transition-colors">+88 017 000 00 00</a>
                </div>
              </div>
            </div>
            
           <form className="flex flex-col gap-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-12 rounded-[50px] relative overflow-hidden">
  
  {/* Inner Glow Decorative Element */}
  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

  <div className="space-y-8 relative z-10">
    <div className="group relative">
      <input 
        type="text" 
        placeholder="NAME" 
        className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent font-bold text-white placeholder:text-white/30 tracking-widest text-xs" 
      />
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-500 group-focus-within:w-full" />
    </div>

    <div className="group relative">
      <input 
        type="email" 
        placeholder="EMAIL" 
        className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent font-bold text-white placeholder:text-white/30 tracking-widest text-xs" 
      />
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-500 group-focus-within:w-full" />
    </div>

    <div className="group relative">
      <textarea 
        placeholder="MESSAGE" 
        rows="4" 
        className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent resize-none font-bold text-white placeholder:text-white/30 tracking-widest text-xs"
      ></textarea>

    </div>
  </div>

  <motion.button 
    whileHover={{ y: -5, scale: 1.02 }} 
    whileTap={{ scale: 0.98 }}
    className="bg-green-500 text-[#062016] px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-white/10"
  >
    Send Inquiry
  </motion.button>
</form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;