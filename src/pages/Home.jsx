import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'; 
import Hero from '../components/Hero/Hero';
import { useCart } from "../components/Cart/CartContext";

/**
 * Optimized RevealText Component
 * Uses Framer Motion for high-performance GPU-accelerated text reveals
 */
const RevealText = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={isInView ? { y: 0 } : { y: "105%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Home = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, name: "" });
  const [featuredItems, setFeaturedItems] = useState([]);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  // 1. Data Fetching & Memoization
  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      try {
        const allProducts = JSON.parse(savedProducts);
        setFeaturedItems(allProducts.filter(item => item.isFeatured));
      } catch (err) {
        console.error("Error parsing products:", err);
      }
    }
  }, []);

  // 2. Carousel Measurement Logic
  useEffect(() => {
    if (carouselRef.current && featuredItems.length > 0) {
      setWidth(carouselRef.current.scrollWidth / 3);
    }
  }, [featuredItems]);

  // 3. Infinite Auto-Scroll Animation
  useEffect(() => {
    if (width > 0) {
      controls.start({
        x: -width,
        transition: { duration: 35, ease: "linear", repeat: Infinity },
      });
    }
  }, [width, controls]);

  const handleAddToCart = (item) => {
    const rawPrice = item.basePrice || item.price || 0;
    const numericPrice = typeof rawPrice === 'string' 
      ? Number(rawPrice.replace(/[^0-9.-]+/g, "")) 
      : rawPrice;

    addToCart({ ...item, price: numericPrice });
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 3000);
  };

  // Triplicating items for seamless loop in the carousel
  const carouselList = useMemo(() => [...featuredItems, ...featuredItems, ...featuredItems], [featuredItems]);

  return (
    <div className="relative min-h-screen selection:bg-emerald-500 selection:text-white bg-[#062016] text-white antialiased">
      
      {/* GLOBAL NOTIFICATION SYSTEM */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: 50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 20, opacity: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[100] w-max"
          >
            <div className="bg-white/10 backdrop-blur-2xl px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
              <div className="bg-emerald-500 rounded-full p-1">
                <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none mb-1">Added to Cart</p>
                <p className="text-sm font-bold uppercase tracking-tight">{notification.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 0: HERO (Natural Flow) */}
      <Hero />

      {/* SECTION 1: FEATURED CAROUSEL */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#062016]"> 
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/fe.png" alt="Overlay" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#062016] via-transparent to-[#04140e]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-16 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <RevealText className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-[10px]">Curated Selection</RevealText>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                <RevealText>Featured</RevealText>
                <RevealText className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-100 to-emerald-400 bg-[length:200%_auto] animate-gradient-x">Collection</RevealText>
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest hover:text-emerald-400 transition-colors duration-300">
              <span className="border-b border-emerald-500/20 group-hover:border-emerald-400 pb-1 uppercase">Explore All Varieties</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>

        <div className="relative border-y border-white/5 py-10 group">
          {featuredItems.length > 0 ? (
            <motion.div 
              ref={carouselRef}
              className="flex min-w-max cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ right: 0, left: -width * 2 }}
              animate={controls}
              onDragStart={() => controls.stop()}
              onMouseEnter={() => controls.stop()}
              onMouseLeave={() => controls.start({ x: -width, transition: { duration: 35, ease: "linear", repeat: Infinity } })}
            >
              {carouselList.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex-shrink-0 px-4">
                  <div className="w-64 md:w-72 relative group/card rounded-[32px] bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 transition-all duration-500 hover:bg-emerald-500/10 hover:border-emerald-500/40">
                    <div className="overflow-hidden rounded-[24px] aspect-[4/5] relative shadow-2xl">
                      <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" alt={item.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="mt-6 flex justify-between items-center px-1">
                      <div className="flex-1 min-w-0 mr-4"> 
                        <h3 className="text-sm font-bold truncate uppercase tracking-wider">{item.name}</h3>
                        <p className="text-emerald-400 font-mono font-bold text-base mt-1">৳{item.basePrice || item.price}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} 
                        className="h-12 w-12 rounded-full bg-emerald-500 text-black transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 flex-shrink-0 font-black text-[10px] shadow-lg shadow-emerald-500/20"
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
              <p className="text-white/20 font-black text-sm uppercase tracking-[0.4em] italic">No varieties currently featured</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: HERITAGE */}
      <section className="py-24 md:py-40 bg-[#04140e] px-6 lg:px-16 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-6 bg-emerald-500/5 backdrop-blur-3xl rounded-[60px] -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="relative overflow-hidden rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] aspect-video border border-white/10">
              <img src="/misty-tea-fields-stockcake.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Our Estate" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <RevealText className="text-emerald-400 font-bold tracking-[0.5em] uppercase text-xs">The Origin</RevealText>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              <RevealText>Sourced at the</RevealText>
              <RevealText className="text-emerald-200/30 italic font-serif lowercase">edge of the world.</RevealText>
            </h2>
            <p className="text-xl text-white/50 max-w-md leading-relaxed">
              Every leaf tells a story of the high-altitude soil and the misty mornings of our estate. We believe in transparency from crop to cup.
            </p>
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full font-bold uppercase text-[10px] tracking-[0.2em]"
            >
              Discover Our Process
            </motion.button>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTACT */}
      <section className="py-24 md:py-40 bg-black px-6 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12 lg:sticky lg:top-40">
              <h2 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8]">
                <RevealText className="text-emerald-500">Reach</RevealText>
                <RevealText className="text-emerald-500">Out.</RevealText>
              </h2>
              <div className="space-y-6">
                <p className="text-white/30 uppercase font-black tracking-[0.3em] text-[10px]">Based in Sylhet — Exporting Worldwide</p>
                <div className="flex flex-col gap-4">
                  <a href="mailto:hello@teaEstate.com" className="text-3xl md:text-5xl font-bold hover:text-emerald-400 transition-colors duration-300">hello@teaestate.com</a>
                  <a href="tel:+8801700000000" className="text-3xl md:text-5xl font-bold hover:text-emerald-400 transition-colors duration-300">+88 017 000 00 00</a>
                </div>
              </div>
            </div>
            
            <form className="flex flex-col gap-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-16 rounded-[60px] shadow-2xl">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-emerald-500/60 uppercase ml-1">Your Name</label>
                  <input type="text" placeholder="EX. JOHN DOE" className="w-full border-b border-white/10 py-4 bg-transparent font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-emerald-500/60 uppercase ml-1">Email Address</label>
                  <input type="email" placeholder="HELLO@DOMAIN.COM" className="w-full border-b border-white/10 py-4 bg-transparent font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-emerald-500/60 uppercase ml-1">Message</label>
                  <textarea placeholder="HOW CAN WE HELP?" rows="4" className="w-full border-b border-white/10 py-4 bg-transparent font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-emerald-500/20"
              >
                Send Inquiry
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-12 border-t border-white/5 bg-black text-center">
        <p className="text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase">© 2026 Tea Estate Premium. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;