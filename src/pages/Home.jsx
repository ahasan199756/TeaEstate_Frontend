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
  const [featuredItems, setFeaturedItems] = useState([]);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      const featured = allProducts.filter(item => item.isFeatured === true);
      setFeaturedItems(featured);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current && featuredItems.length > 0) {
      setWidth(carouselRef.current.scrollWidth / 3);
    }
  }, [featuredItems]);

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
    setTimeout(() => setNotification({ show: false, name: "" }), 2500);
  };

  return (
    /* THE SNAP CONTAINER: This handles the one-page scroll behavior */
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory selection:bg-emerald-500 selection:text-white bg-[#062016] pt-20">
      
      {/* POPUP NOTIFICATION (Fixed to stay on screen) */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-2xl text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
          <div className="bg-emerald-500 rounded-full p-1"><svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Added to Cart</p><p className="text-sm font-bold uppercase">{notification.name}</p></div>
        </div>
      </div>

      {/* SECTION 0: HERO (Section 1 in scroll) */}
      <div className="snap-start w-full h-screen">
        <Hero />
      </div>
      
      {/* SECTION 1: FEATURED CAROUSEL (Section 2 in scroll) */}
      <section className="relative h-screen w-full snap-start flex flex-col pt-24 overflow-hidden bg-[#062016]"> 
        <div className="absolute inset-0 z-0">
          <img src="/fe.png" alt="Misty Tea Fields" className="w-full h-full object-cover opacity-10 scale-105 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#062016]/20 to-black/80"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-6 lg:px-16 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <RevealText className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-[10px]">Curated Selection</RevealText>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  <RevealText>Featured</RevealText>
                  <RevealText className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-100 to-emerald-400 bg-[length:200%_auto] animate-gradient-x">Collection</RevealText>
                </h2>
              </div>
              <Link to="/products" className="group flex items-center gap-1 text-white/60 text-xs font-bold tracking-widest hover:text-emerald-400 mb-2">
                <span className="border-b border-emerald-500/30 group-hover:border-emerald-400 pb-0.5 uppercase">Explore All</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          <div className="relative border-y border-white/5 py-6 group">
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
                {[...featuredItems, ...featuredItems, ...featuredItems].map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex-shrink-0 px-3 md:px-4">
                    <div className="w-52 md:w-64 relative overflow-hidden rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10 p-4 transition-all duration-500 hover:-translate-y-2 hover:bg-emerald-500/10 hover:border-emerald-500/30">
                      <div className="overflow-hidden rounded-[24px] aspect-[4/5] relative group/card shadow-xl">
                        <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" alt={item.name} />
                      </div>
                      <div className="mt-5 flex justify-between items-center px-1">
                        <div className="flex-1 min-w-0 mr-2"> 
                          <h3 className="text-sm font-bold text-white truncate uppercase tracking-wide">{item.name}</h3>
                          <p className="text-emerald-400 font-mono font-bold text-sm">৳{item.basePrice || item.price}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} className="h-10 w-10 rounded-full bg-emerald-500 text-black transition-all hover:bg-white hover:scale-105 active:scale-90 flex-shrink-0 font-black text-[9px]">ADD</button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-10"><p className="text-white/20 font-black text-xs uppercase tracking-widest italic">No varieties featured</p></div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: HERITAGE (Section 3 in scroll) */}
      <section className="h-screen w-full snap-start flex items-center px-6 lg:px-16 relative z-10 bg-[#04140e]">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group order-2 lg:order-1">
            <div className="absolute -inset-4 bg-emerald-500/10 backdrop-blur-3xl rounded-[60px] -rotate-1"></div>
            <div className="relative overflow-hidden rounded-[50px] shadow-2xl aspect-video border border-white/10">
              <img src="public\misty-tea-fields-stockcake.webp" className="w-full h-full object-cover" alt="Heritage" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <RevealText className="text-emerald-400 font-bold tracking-[0.4em] uppercase text-xs">Our Heritage</RevealText>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              <RevealText>Sourced from the</RevealText>
              <RevealText className="text-emerald-200/40 italic font-serif lowercase">edge of the world.</RevealText>
            </h2>
            <p className="text-xl text-white/60 max-w-md leading-relaxed font-medium">Every leaf tells a story of the soil it grew in. Sustainability in every cup.</p>
            <motion.button whileHover={{ y: -5, backgroundColor: "white", color: "black" }} className="px-10 py-4 border-2 border-white/20 text-white rounded-full font-bold uppercase text-xs">Discover Our Process</motion.button>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTACT (Section 4 in scroll) */}
      <section className="h-screen w-full snap-start flex items-center px-6 lg:px-16 bg-black border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                <RevealText className="text-emerald-500">Reach</RevealText>
                <RevealText className="text-emerald-500">Out.</RevealText>
              </h2>
              <div className="space-y-4">
                <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Based in Portland — Worldwide</p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:hello@teaEstate.com" className="text-2xl md:text-4xl font-bold text-gray-400 hover:text-emerald-500 transition-colors">hello@teaEstate.com</a>
                  <a href="tel:+8801700000000" className="text-2xl md:text-4xl font-bold text-gray-400 hover:text-emerald-500 transition-colors">+88 017 000 00 00</a>
                </div>
              </div>
            </div>
            
            <form className="flex flex-col gap-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[50px]">
              <div className="space-y-6">
                <input type="text" placeholder="NAME" className="w-full border-b border-white/20 py-4 bg-transparent font-bold text-white placeholder:text-white/30 text-xs" />
                <input type="email" placeholder="EMAIL" className="w-full border-b border-white/20 py-4 bg-transparent font-bold text-white placeholder:text-white/30 text-xs" />
                <textarea placeholder="MESSAGE" rows="3" className="w-full border-b border-white/20 py-4 bg-transparent font-bold text-white placeholder:text-white/30 text-xs"></textarea>
              </div>
              <motion.button whileHover={{ scale: 1.02, backgroundColor: 'white' }} className="bg-emerald-500 text-black py-5 rounded-full font-black uppercase text-xs tracking-[0.2em]">Send Inquiry</motion.button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;