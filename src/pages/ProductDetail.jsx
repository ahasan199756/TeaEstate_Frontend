import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productItems } from './products'; 
import { useCart } from "../components/Cart/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Find the product by ID from the URL
  const product = productItems.find(p => String(p.id) === String(id));

  // Loading/Error State
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

  const onAddToCart = () => {
    addToCart({ ...product, quantity });
    // You could trigger your popup notification logic here as well
  };

  return (
    /* MAIN CONTAINER: Green to Black Fade */
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-black text-white pt-40 pb-20 px-6 lg:px-16">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="relative group">
            {/* Ambient Glow behind image */}
            <div className="absolute -inset-4 bg-green-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="relative rounded-[50px] overflow-hidden border border-white/10 shadow-2xl aspect-square md:aspect-auto">
              {/* Floating Badge */}
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
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.85] text-balance">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-10">
              <p className="text-5xl font-mono text-green-400 font-bold">
                ${product.price}
              </p>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest italic">
                Free Worldwide Shipping
              </span>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
              {product.description || "Experience the pure essence of our hand-selected tea leaves. Sourced directly from sustainable estates to ensure clarity, flavor, and tradition in every single cup."}
            </p>

            <div className="space-y-8">
              {/* QUANTITY & ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-5">
                
                {/* Custom Quantity Selector */}
                <div className="flex items-center justify-between border-2 border-white/10 rounded-full px-8 py-5 min-w-[160px] bg-white/5 backdrop-blur-sm">
                  <button 
                    onClick={handleDecrement} 
                    className="text-2xl font-light hover:text-green-400 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-black">{quantity}</span>
                  <button 
                    onClick={handleIncrement} 
                    className="text-2xl font-light hover:text-green-400 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={onAddToCart}
                  className="flex-1 bg-white text-black py-5 rounded-full font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 active:scale-95 shadow-2xl shadow-green-500/10"
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Origin</h4>
                  <p className="text-white font-medium">Misty Mountain Estates</p>
                  <p className="text-white/40 text-xs">High Altitude (1,200m)</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Process</h4>
                  <p className="text-white font-medium">Traditional Pan-Fired</p>
                  <p className="text-white/40 text-xs">Organic Certified</p>
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