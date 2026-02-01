import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";

export const productItems = [
  { id: 1, name: "Organic Green Tea", price: 24, description: "Hand-picked leaves from the high altitude estates.", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "Premium Black Tea", price: 18, description: "Bold and robust flavor profile with a smooth finish.", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "Jasmine Infusion", price: 22, description: "Delicate floral notes infused with premium silver needle.", img: "https://images.unsplash.com/photo-1563911302283-d2bc1dad5b6d?auto=format&fit=crop&q=80&w=500" },
  { id: 4, name: "Earl Grey Classic", price: 20, description: "Distinctive bergamot flavor with a smooth black tea base.", img: "https://images.unsplash.com/photo-1563911302283-d2bc1dad5b6d?auto=format&fit=crop&q=80&w=500" },
];

const Products = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, name: "" });
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-black text-white pt-40 pb-20 px-6 lg:px-16 overflow-hidden">
      
      {/* NOTIFICATION UI: Added 'backdrop-blur' for a glassmorphism feel */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${notification.show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-24 opacity-0 scale-95'}`}>
        <div className="bg-white/90 backdrop-blur-md text-black px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-green-500/30">
          <div className="bg-green-500 rounded-full p-1 text-white animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Added to Collection</p>
            <p className="text-sm font-bold uppercase">{notification.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productItems.map((item, index) => (
            <div 
              key={item.id} 
              // STAGGERED ENTRANCE: Cards slide up one by one
              style={{ 
                transitionDelay: `${index * 150}ms`,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible ? 1 : 0
              }}
              className="group relative bg-white/5 rounded-[40px] overflow-hidden border border-white/10 transition-all duration-1000 ease-out hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]"
            >
              
              <div className="h-80 overflow-hidden relative">
                {/* IMAGE ZOOM: Smooth slow-motion zoom on hover */}
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                  alt={item.name} 
                />
                
                {/* BUTTON OVERLAY: Uses 'backdrop-blur' and specific 'translate' for a "pop" effect */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Link 
                    to={`/product/${item.id}`} 
                    className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="p-8">
                {/* Text reveals slightly after the image */}
                <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-green-400">{item.name}</h3>
                <p className="text-green-400 font-black mt-2 text-xl">${item.price}</p>
                
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="mt-6 w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase transition-all duration-300 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 active:bg-green-600"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;