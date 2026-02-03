import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";
import { Filter, ShoppingBag, ArrowRight, Plus } from 'lucide-react';

// Fallback data
export const initialProductItems = [
  { id: 1, name: "Organic Green Tea", basePrice: 24, category: "Green Tea", description: "Hand-picked leaves from the high altitude estates.", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500" },
  { id: 2, name: "Premium Black Tea", basePrice: 18, category: "Black Tea", description: "Bold and robust flavor profile.", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?w=500" },
];

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [notification, setNotification] = useState({ show: false, name: "" });
  const [isVisible, setIsVisible] = useState(false);

  // 1. Load data
  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    const data = savedProducts ? JSON.parse(savedProducts) : initialProductItems;
    setProducts(data);
    setFilteredProducts(data);
    setIsVisible(true);
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  const handleAddToCart = (item) => {
    // Normalizing price for the cart logic
    const priceToStore = item.basePrice || item.price || 0;
    addToCart({ ...item, price: priceToStore }); 
    
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2000);
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div className="relative min-h-screen bg-[#04160f] text-white pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* NOTIFICATION UI */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <ShoppingBag size={14} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Added to Estate Cart</p>
            <p className="text-sm font-bold uppercase">{notification.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER & FILTER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">The <span className="text-emerald-500">Collection</span></h1>
            <p className="text-white/30 font-bold uppercase tracking-[0.4em] mt-4 text-xs">Curated harvests from across the globe</p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-3xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[60px]">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/20">This category is currently empty</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative flex flex-col transition-all duration-700 ease-out"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  opacity: isVisible ? 1 : 0
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-[45px] overflow-hidden bg-white/5 border border-white/10 group-hover:border-emerald-500/50 transition-colors duration-500 shadow-2xl">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt={item.name} 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
                    <p className="text-white/60 text-xs font-medium mb-6 line-clamp-3 leading-relaxed italic">
                      "{item.description}"
                    </p>
                    <Link 
                      to={`/product/${item.id}`} 
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 rounded-2xl shadow-xl">
                    <p className="text-xs font-black text-white">৳{item.basePrice || item.price}</p>
                  </div>
                </div>

                {/* Info Text */}
                <div className="mt-6 px-4">
                  <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em] mb-1">{item.category}</p>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">{item.name}</h3>
                  <button 
  onClick={() => handleAddToCart(item)}
  className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
>
  <Plus size={20} />
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;