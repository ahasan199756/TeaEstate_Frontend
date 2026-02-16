import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";
import { Filter, ShoppingBag, ArrowRight, Plus, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const initialProductItems = [
  { id: 1, name: "Organic Green Tea", basePrice: 2400, category: "Green Tea", rating: 4.8, description: "Hand-picked leaves from the high altitude estates.", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800" },
  { id: 2, name: "Premium Black Tea", basePrice: 1800, category: "Black Tea", rating: 4.9, description: "Bold and robust flavor profile.", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?w=800" },
];

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Default");

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    const data = savedProducts ? JSON.parse(savedProducts) : initialProductItems;
    setProducts(data);
    setFilteredProducts(data);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (maxPrice) result = result.filter(p => (p.basePrice || p.price) <= Number(maxPrice));

    // Sorting Logic
    if (sortBy === "Price: Low to High") result.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "Price: High to Low") result.sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === "Best Rating") result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, maxPrice, sortBy, products]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, price: item.basePrice || item.price }); 
    toast.success(`${item.name} added to bag`);
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    /* Background changed to High-End Black-Green */
    <div className="relative min-h-screen bg-[#010801] text-white pt-32 pb-32 px-6 lg:px-20 overflow-hidden font-sans">
      
      {/* Cinematic Depth Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="h-[1px] w-8 bg-emerald-500"></span>
               <span className="text-emerald-500 text-[10px] font-black tracking-[0.4em] uppercase">Premium Selection</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-100">Products</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-full border border-white/5 backdrop-blur-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-emerald-500 text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* REFINED FILTER BAR */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white/[0.03] p-4 rounded-[35px] border border-white/10 backdrop-blur-2xl shadow-2xl">
          
          <div className="lg:col-span-5 relative">
            <input
              type="text"
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition"
            />
          </div>

          <div className="lg:col-span-3">
             <div className="relative">
                <select 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                    <option value="Default" className="bg-[#010801]">Sort By: Default</option>
                    <option value="Best Rating" className="bg-[#010801]">Best Rating</option>
                    <option value="Price: Low to High" className="bg-[#010801]">Price: Low to High</option>
                    <option value="Price: High to Low" className="bg-[#010801]">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="flex-1 relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-bold italic">৳</span>
                <input
                    type="number"
                    placeholder="Max Price Range"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition"
                />
            </div>
          </div>
        </div>

        {/* PRODUCT GRID - Kept your requested Box Design */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[60px]">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/20 italic">No products found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {filteredProducts.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative flex flex-col transition-all duration-1000"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  opacity: isVisible ? 1 : 0
                }}
              >
                <div className="relative aspect-[4/5] rounded-[45px] overflow-hidden bg-white/5 border border-white/10 group-hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt={item.name} 
                  />
                  
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[4px]">
                    <p className="text-white/60 text-xs font-medium mb-8 italic leading-relaxed">
                      "{item.description}"
                    </p>
                    <Link 
                      to={`/product/${item.id}`} 
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="absolute top-8 left-8 px-5 py-2 bg-emerald-500 rounded-full shadow-xl">
                    <p className="text-xs font-black text-white italic">৳{item.basePrice || item.price}</p>
                  </div>
                </div>

                <div className="mt-8 px-4">
                  <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.4em] mb-2">{item.category}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tighter group-hover:text-emerald-400 transition-colors italic line-clamp-1">{item.name}</h3>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 active:scale-90 transition-all"
                  >
                    <Plus size={24} strokeWidth={3} />
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