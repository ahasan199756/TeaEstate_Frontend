import React from 'react';
import Hero from '../components/Hero/Hero';
import { Link } from 'react-router-dom';

const Home = () => {
  // Mini array for the homepage preview
  const featured = [
    { id: 1, name: "Misty Mountain Green", price: "$24", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Ancient Black Tea", price: "$18", img: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=500" },
  ];

  return (
    <div>
      <Hero />
      
      {/* Featured Section */}
      <section className="py-24 bg-green-950 px-6 lg:px-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h5 className="text-green-400 font-bold tracking-[0.3em] uppercase text-xs mb-2">The Daily Steep</h5>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Featured Collection</h2>
            </div>
            <Link to="/products" className="hidden md:block text-white border-b border-green-500 pb-1 text-sm font-bold tracking-widest hover:text-green-400 transition-all">
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featured.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-[40px] bg-white/5 border border-white/10 p-4">
                <img src={item.img} className="w-full h-80 object-cover rounded-[30px] group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                <div className="mt-6 flex justify-between items-center px-4 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-green-400 font-bold">{item.price}</p>
                  </div>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs">ADD</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;