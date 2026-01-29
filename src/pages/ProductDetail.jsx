import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productItems } from './products'; 
import { useCart } from "../components/Cart/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // --- POPUP STATE ---
  const [notification, setNotification] = useState({ show: false, name: "" });
  
  const product = productItems.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-4xl font-black uppercase mb-4">Product Not Found</h2>
        <Link to="/products" className="text-green-400 underline uppercase tracking-widest text-xs">Return to Collection</Link>
      </div>
    );
  }

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // --- UPDATED ADD TO CART WITH POPUP ---
  const onAddToCart = () => {
    addToCart({ ...product, quantity });
    
    // Show popup
    setNotification({ show: true, name: product.name });
    
    // Hide after 2 seconds
    setTimeout(() => {
      setNotification({ show: false, name: "" });
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-black text-white pt-40 pb-20 px-6 lg:px-16 overflow-hidden">
      
      {/* --- POPUP NOTIFICATION --- */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-green-500">
          <div className="bg-green-500 rounded-full p-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Added to Collection</p>
            <p className="text-sm font-bold uppercase">{notification.name} ({quantity})</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-green-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative rounded-[50px] overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-8 left-8 z-10 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Estate Sourced
                </span>
              </div>
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full md:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="flex flex-col">
            <Link to="/products" className="text-xs font-bold text-white/40 mb-8 hover:text-green-400 transition-colors flex items-center gap-2 tracking-[0.3em]">
              <span>←</span> BACK TO COLLECTION
            </Link>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-10">
              <p className="text-5xl font-mono text-green-400 font-bold">${product.price}</p>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest italic">Free Worldwide Shipping</span>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
              {product.description}
            </p>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex items-center justify-between border-2 border-white/10 rounded-full px-8 py-5 min-w-[160px] bg-white/5 backdrop-blur-sm">
                  <button onClick={handleDecrement} className="text-2xl font-light hover:text-green-400 transition-colors">−</button>
                  <span className="text-xl font-black">{quantity}</span>
                  <button onClick={handleIncrement} className="text-2xl font-light hover:text-green-400 transition-colors">+</button>
                </div>

                <button 
                  onClick={onAddToCart}
                  className="flex-1 bg-white text-black py-5 rounded-full font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 active:scale-95 shadow-2xl"
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Origin</h4>
                  <p className="text-white font-medium">Misty Mountain Estates</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Process</h4>
                  <p className="text-white font-medium">Organic Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;