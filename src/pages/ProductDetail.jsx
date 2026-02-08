import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, name: "" });

  useEffect(() => {
    const fetchProduct = () => {
      // 1. Get from LocalStorage
      const savedProducts = localStorage.getItem('teaProducts');
      let allProducts = savedProducts ? JSON.parse(savedProducts) : [];
      
      // 2. Find the product
      const foundProduct = allProducts.find(p => String(p.id) === String(id));
      
      if (foundProduct) {
        // 3. FIX: Standardize price (check for both price and basePrice)
        const standardizedProduct = {
          ...foundProduct,
          price: parseFloat(foundProduct.price || foundProduct.basePrice || 0)
        };
        setProduct(standardizedProduct);
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#062016] flex items-center justify-center">
      <div className="animate-pulse text-green-500 font-black tracking-widest uppercase">Harvesting Data...</div>
    </div>
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#062016] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">Tea Not Found</h2>
        <Link to="/products" className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-white transition-all">
          Return to Collection
        </Link>
      </div>
    );
  }

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const onAddToCart = () => {
    // We send the standardized price and the selected quantity
    addToCart({ 
      ...product, 
      quantity: quantity 
    });
    
    setNotification({ show: true, name: product.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#062016] text-white pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
      
      {/* NOTIFICATION TOAST */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${notification.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-white text-black px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-green-500">
          <div className="bg-green-500 rounded-full p-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-black uppercase tracking-tight">{notification.name} ({quantity}) added</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT: IMAGE */}
          <div className="lg:sticky lg:top-32">
            <div className="relative rounded-[40px] overflow-hidden bg-black/20 aspect-[4/5] shadow-2xl border border-white/5">
              <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062016]/80 to-transparent" />
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col pt-4">
            <Link to="/products" className="group text-[10px] font-black text-white/40 mb-12 hover:text-green-400 transition-colors flex items-center gap-2 tracking-[0.4em]">
              <span className="group-hover:-translate-x-2 transition-transform">←</span> BACK TO COLLECTION
            </Link>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-12">
              <p className="text-5xl font-mono text-green-400 font-bold">
                ৳{product.price.toFixed(2)}
              </p>
              <div className="h-10 w-[1px] bg-white/10" />
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest italic">Estate Certified</span>
            </div>
            
            <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium max-w-xl">
              {product.description}
            </p>

            {/* ACTION SECTION */}
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border-2 border-white/10 rounded-full px-6 py-4 bg-white/5 min-w-[150px]">
                  <button onClick={handleDecrement} className="w-10 h-10 flex items-center justify-center text-2xl hover:text-green-500 transition-colors">−</button>
                  <span className="text-xl font-black font-mono">{quantity}</span>
                  <button onClick={handleIncrement} className="w-10 h-10 flex items-center justify-center text-2xl hover:text-green-500 transition-colors">+</button>
                </div>

                {/* Add Button */}
                <button 
                  onClick={onAddToCart}
                  className="flex-1 bg-green-500 text-white py-5 rounded-full font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 active:scale-95 shadow-xl shadow-green-500/20"
                >
                  Add to Cart — ৳{(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* DETAILS FOOTER */}
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Category</h4>
                  <p className="text-white text-sm font-bold uppercase">{product.category}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">Shipping</h4>
                  <p className="text-white text-sm font-bold uppercase">Free Nationwide</p>
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