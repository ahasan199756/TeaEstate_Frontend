import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";
import { Search, ShoppingBag, Plus, SlidersHorizontal } from 'lucide-react';

export const initialProductItems = [
  { id: 1, name: "Organic Green Tea", basePrice: 24, category: "Green Tea", description: "Hand-picked leaves from the high altitude estates.", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500" },
  { id: 2, name: "Premium Black Tea", basePrice: 18, category: "Black Tea", description: "Bold and robust flavor profile.", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?w=500" },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
];

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [notification, setNotification] = useState({ show: false, name: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    const data = savedProducts ? JSON.parse(savedProducts) : initialProductItems;
    setProducts(data);
    setIsVisible(true);
  }, []);

  const handleAddToCart = (item) => {
    const rawPrice = item.basePrice || item.price || 0;
    const normalizedPrice = typeof rawPrice === 'string'
      ? Number(rawPrice.replace(/[^0-9.-]+/g, ''))
      : rawPrice;

    addToCart({ ...item, price: normalizedPrice });

    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: '' }), 2000);
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const list = products
      .filter((item) => activeCategory === 'All' || item.category === activeCategory)
      .filter((item) => {
        if (!normalizedQuery) return true;
        return (`${item.name} ${item.category} ${item.description || ''}`).toLowerCase().includes(normalizedQuery);
      });

    if (sortBy === 'price-low') {
      return [...list].sort((a, b) => (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0));
    }
    if (sortBy === 'price-high') {
      return [...list].sort((a, b) => (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0));
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeCategory, query, sortBy]);

  return (
    <div className="relative min-h-screen bg-[#f3f8f2] text-[#1f3a2f] pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#bfdcc8]/35 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#dcebdc]/60 blur-[120px] rounded-full pointer-events-none" />

      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
        <div className="bg-white/90 backdrop-blur-xl border border-[#b8d4c0] text-[#1f3a2f] px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-8 h-8 bg-[#6fa884] text-white rounded-full flex items-center justify-center animate-pulse">
            <ShoppingBag size={14} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4f8d67]">Added to Cart</p>
            <p className="text-sm font-bold uppercase">{notification.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-6 mb-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Tea <span className="text-[#5f9a74]">Collection</span></h1>
          <p className="text-[#355546]/80 max-w-3xl text-sm md:text-base">
            Calm browsing, clear filters, and simple shopping to help every customer feel comfortable and confident.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_auto] gap-4 mb-8 items-center">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d8a7b]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search teas, categories, tasting notes..."
              className="w-full bg-white/85 border border-[#c2d9c8] rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#6fa884]"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/85 border border-[#c2d9c8] rounded-2xl px-4 py-3">
            <SlidersHorizontal size={16} className="text-[#6d8a7b]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[#4f6f5f] lg:text-right">{filteredProducts.length} products found</p>
        </div>

        <div className="flex items-center gap-2 bg-white/70 p-2 rounded-3xl border border-[#d1e2d4] backdrop-blur-md overflow-x-auto no-scrollbar max-w-full mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#6fa884] text-white shadow-md' : 'text-[#4d6b5b] hover:text-[#264336] hover:bg-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-[#cfe0d3] rounded-[40px] bg-white/40">
            <h2 className="text-xl font-black uppercase tracking-widest text-[#6d8a7b]">No products match your filters</h2>
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
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <div className="relative aspect-[4/5] rounded-[35px] overflow-hidden bg-white border border-[#d7e5db] group-hover:border-[#8bb89a] transition-colors duration-500 shadow-lg">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    alt={item.name}
                  />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-white/85 text-[#315441] px-3 py-1 rounded-full border border-[#c8dacd]">
                    {item.category}
                  </div>
                </div>

                <div className="mt-5 px-2 flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#1f3a2f]">{item.name}</h3>
                    <p className="text-[#4f6f5f] text-sm mt-1 line-clamp-2">{item.description || 'Single estate tea with balanced aroma and clean finish.'}</p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-bold text-[#3a7a58]">${Number(item.basePrice || item.price || 0).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white hover:bg-[#edf5ef] border border-[#c7dacd] text-[#2d4e3d] p-3 rounded-full transition-all"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <Plus size={18} />
                      </button>
                      <Link
                        to={`/product/${item.id}`}
                        className="bg-[#6fa884] hover:bg-[#5f9a74] text-white px-5 py-3 rounded-full text-xs font-black tracking-widest"
                      >
                        VIEW
                      </Link>
                    </div>
                  </div>
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
