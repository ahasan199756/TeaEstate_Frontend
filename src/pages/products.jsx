import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/Cart/CartContext";

export const productItems = [
  { id: 1, name: "Organic Green Tea", price: 24, description: "Hand-picked leaves from the high altitude estates.", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "Premium Black Tea", price: 18, description: "Bold and robust flavor profile with a smooth finish.", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "Jasmine Infusion", price: 22, description: "Delicate floral notes infused with premium silver needle.", img: "https://images.unsplash.com/photo-1563911302283-d2bc1dad5b6d?auto=format&fit=crop&q=80&w=500" },
];

const Products = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, name: "" });

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification({ show: true, name: item.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-green-950 pt-32 pb-20 px-6">
      
      {/* --- ADDED: POPUP NOTIFICATION UI --- */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-green-500">
          <div className="bg-green-500 rounded-full p-1 text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {productItems.map((item) => (
            <div key={item.id} className="group relative bg-white/5 rounded-[40px] overflow-hidden border border-white/10">
              
              {/* IMAGE WITH HOVER OVERLAY */}
              <div className="h-80 overflow-hidden relative">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link 
                    to={`/product/${item.id}`} 
                    className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white">{item.name}</h3>
                <p className="text-green-400 font-black mt-2">${item.price}</p>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="mt-6 w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-green-400 transition-all active:scale-95"
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