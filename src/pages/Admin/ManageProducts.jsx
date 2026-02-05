import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Search, ChevronLeft, ChevronRight, Star } from 'lucide-react'; // Added Star
import { Link, useNavigate } from 'react-router-dom';
import { initialProductItems as initialData } from '../products';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialData);
    }
  }, []);

  // --- LOGIC: TOGGLE FEATURED ---
  const toggleFeatured = (id) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProducts(updated);
    localStorage.setItem('teaProducts', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this tea?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('teaProducts', JSON.stringify(updated));
    }
  };

  // Filter & Pagination Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... (Existing TOP BAR remains the same) ... */}

      <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Featured</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Visual</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Product Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {currentItems.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                {/* NEW FEATURED TOGGLE CELL */}
                <td className="p-6">
                  <button 
                    onClick={() => toggleFeatured(item.id)}
                    className={`transition-all duration-300 ${item.isFeatured ? 'text-yellow-400 scale-125' : 'text-white/10 hover:text-white/30'}`}
                  >
                    <Star size={20} fill={item.isFeatured ? "currentColor" : "none"} />
                  </button>
                </td>

                <td className="p-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                    <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </td>
                
                <td className="p-6">
                  <p className="text-white font-bold text-base leading-none mb-1 uppercase tracking-tight">
                    {item.name} 
                    {item.isFeatured && <span className="ml-2 text-[8px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">FEATURED</span>}
                  </p>
                  <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider">{item.category}</p>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate('/admin/add-product', { state: { editProduct: item } })}
                      className="p-3 rounded-xl bg-white/5 text-white hover:bg-emerald-500 transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 rounded-xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ... (Existing Pagination logic remains the same) ... */}
      </div>
    </div>
  );
};

export default ManageProducts;