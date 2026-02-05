import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion'; 
import Hero from '../components/Hero/Hero';
import { useCart } from "../components/Cart/CartContext";

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
  const [featuredItems, setFeaturedItems] = useState([]); // State for dynamic products
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  // 1. LOAD FEATURED PRODUCTS FROM LOCALSTORAGE
  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      // Only get items marked as isFeatured
      const featured = allProducts.filter(item => item.isFeatured === true);
      setFeaturedItems(featured);
    }
  }, []);

  // 2. CAROUSEL CALCULATIONS
  useEffect(() => {
    if (carouselRef.current && featuredItems.length > 0) {
      // We divide by 3 because we triplicate the array for the infinite loop effect
      setWidth(carouselRef.current.scrollWidth / 3);
    }
  }, [featuredItems]);

  // 3. INFINITE ANIMATION LOGIC
  useEffect(() => {
    if (width > 0) {
      controls.start({
        x: -width,
        transition: { duration: 35, ease: "linear", repeat: Infinity },
      });
    }
  }, [width, controls]);

  const handleAddToCart = (item) => {
    // Normalizing price: support both string "$24" and number 24
    const rawPrice = item.basePrice || item.price || 0;
    const numericPrice = typeof rawPrice === 'string' 
      ? Number(rawPrice.replace(/[^0-9.-]+/g, "")) 
      : rawPrice;

    addToCart({ ...item, price: numericPrice });
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2500);
  };

  return (
    <div className="min-h-screen selection:bg-emerald-500 selection:text-white relative bg-gradient-to-b from-[#062016] via-[#04140e] to-black">
      
      {/* POPUP NOTIFICATION */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-2xl text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
          <div className="bg-emerald-500 rounded-full p-1"><svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Added to Cart</p><p className="text-sm font-bold uppercase">{notification.name}</p></div>
        </div>
      </div>

      <Hero />
      
      {/* --- PRODUCT & HERITAGE EXPERIENCE --- */}
      <div className="relative overflow-hidden"> 
        <div className="absolute inset-0 z-0">
          <img 
            src="/fe.png" 
            alt="Misty Tea Fields" 
            className="w-full h-full object-cover opacity-20 scale-110 animate-[slowZoom_60s_infinite_alternate] mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#062016]/40 to-black"></div>
        </div>

        <section className="pt-32 pb-16 relative z-10 overflow-hidden">
          <div className="container mx-auto px-6 lg:px-16 mb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <RevealText className="text-emerald-400 font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs">
                  Curated Selection
                </RevealText>
                <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                  <RevealText>Featured</RevealText>
                  <RevealText className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-100 to-emerald-400 bg-[length:200%_auto] animate-gradient-x">
                    Collection
                  </RevealText>
                </h2>
              </div>
              <Link to="/products" className="group flex items-center gap-1 text-white/60 text-sm font-bold tracking-widest hover:text-emerald-400 transition-all duration-300">
                <span className="border-b-2 border-emerald-500/30 group-hover:border-emerald-400 pb-1 uppercase">Explore All</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="relative border-y border-white/5 py-10 group">
            <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#062016] via-[#062016]/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black via-black/20 to-transparent z-10 pointer-events-none" />

            {featuredItems.length > 0 ? (
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
                {/* Triple the items for infinite scroll effect */}
                {[...featuredItems, ...featuredItems, ...featuredItems].map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex-shrink-0 px-5 md:px-8 select-none">
                    <div className="w-56 md:w-72 relative overflow-hidden rounded-[45px] bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-700 hover:-translate-y-4 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)]">
                      <div className="overflow-hidden rounded-[35px] aspect-[4/5] relative group/card shadow-2xl">
                        <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 pointer-events-none" alt={item.name} />
                      </div>
                      <div className="mt-8 flex justify-between items-center px-2 relative z-10">
                        <div className="flex-1 min-w-0 mr-4"> 
                          <h3 className="text-lg font-bold text-white truncate uppercase tracking-wide">{item.name}</h3>
                          <p className="text-emerald-400 font-mono font-bold mt-1">৳{item.basePrice || item.price}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} 
                          className="relative h-14 w-14 rounded-full bg-emerald-500 text-black transition-all hover:bg-white hover:scale-110 active:scale-90 flex-shrink-0 font-black text-[10px]"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/20 font-black uppercase tracking-widest italic">No varieties currently featured</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: HERITAGE */}
        <section className="pb-32 pt-16 px-6 lg:px-16 relative z-10">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-emerald-500/10 backdrop-blur-3xl rounded-[60px] -rotate-1 scale-95 group-hover:rotate-0 transition-transform duration-700 border border-white/5 shadow-2xl"></div>
              <div className="relative overflow-hidden rounded-[50px] shadow-2xl aspect-video border border-white/10">
                <img 
                  src="public\misty-tea-fields-stockcake.webp" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="Heritage" 
                />
              </div>
            </div>

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
                className="px-10 py-4 border-2 border-white/20 text-white rounded-full font-bold uppercase text-xs transition-all duration-300"
              >
                Discover Our Process
              </motion.button>
            </div>
          </div>
        </section>
      </div>

      {/* 3. CONTACT SECTION */}
      <section className="py-32 px-6 lg:px-16 bg-black border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="sticky top-10">
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                <RevealText className="text-emerald-500">Reach</RevealText>
                <RevealText className="text-emerald-500">Out.</RevealText>
              </h2>
              <div className="space-y-6 mt-8">
                <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Based in Portland — Worldwide</p>
                <div className="flex flex-col gap-2 text-gray-400">
                  <a href="mailto:hello@teaEstate.com" className="text-2xl md:text-4xl font-bold hover:text-emerald-500 transition-colors">hello@teaEstate.com</a>
                  <a href="tel:+8801700000000" className="text-2xl md:text-4xl font-bold hover:text-emerald-500 transition-colors">+88 017 000 00 00</a>
                </div>
              </div>
            </div>
            
            <form className="flex flex-col gap-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-12 rounded-[50px] relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="space-y-8 relative z-10">
                <div className="group relative">
                  <input type="text" placeholder="NAME" className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent font-bold text-white placeholder:text-white/30 tracking-widest text-xs" />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-500 group-focus-within:w-full" />
                </div>
                <div className="group relative">
                  <input type="email" placeholder="EMAIL" className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent font-bold text-white placeholder:text-white/30 tracking-widest text-xs" />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-500 group-focus-within:w-full" />
                </div>
                <div className="group relative">
                  <textarea placeholder="MESSAGE" rows="4" className="w-full border-b border-white/20 py-4 focus:outline-none focus:border-emerald-400 transition-all bg-transparent resize-none font-bold text-white placeholder:text-white/30 tracking-widest text-xs"></textarea>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-500 group-focus-within:w-full" />
                </div>
              </div>
              <motion.button 
                whileHover={{ y: -5, scale: 1.02, backgroundColor: 'white' }} 
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 text-black px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg"
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