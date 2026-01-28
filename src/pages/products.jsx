import React from 'react';

const Products = () => {
  const items = [
    { id: 1, name: "Organic Green Tea", price: "$24", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Premium Black Tea", price: "$18", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "Jasmine Infusion", price: "$22", img: "https://images.unsplash.com/photo-1563911302283-d2bc1dad5b6d?auto=format&fit=crop&q=80&w=500" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      
      {/* --- BACKGROUND IMAGE LAYER --- */}
      <div className="absolute inset-0 z-0"> {/* Changed 'fixed' to 'absolute' */}
        <img 
          src="/misty-tea-fields-stockcake.webp" 
          alt="Estate Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-950/90 backdrop-blur-[3px]"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 pt-32 pb-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <h5 className="text-green-400 font-bold tracking-[0.4em] uppercase text-sm mb-4">
              Pure Selection
            </h5>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
              The <span className="text-white/40 font-light italic">Collection</span>
            </h2>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] overflow-hidden transition-all duration-500 hover:-translate-y-3 shadow-2xl"
              >
                {/* Image Container */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Text Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-green-400 font-black text-xl">{item.price}</p>
                    <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase italic">
                      Organic Cert.
                    </span>
                  </div>
                  
                  <button className="mt-8 w-full py-4 bg-green-500 hover:bg-green-400 text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-green-900/40 transform active:scale-95">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;