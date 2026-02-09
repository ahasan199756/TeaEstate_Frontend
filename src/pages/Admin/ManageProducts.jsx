import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { initialProductItems as initialData } from '../products';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Keep it clean
  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialData);
    }
  }, []);

  // --- LOGIC: FILTER & SEARCH ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC: PAGINATION ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this tea?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('teaProducts', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Manage Products</h1>
          <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Active Stock Control</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* SEARCH BOX */}
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH HARVESTS..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
          <Link to="/admin/add-product" className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 md:px-6 md:py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Plus size={18} /> <span className="hidden md:inline">Add Variety</span>
          </Link>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Visual</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Product Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Category</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Market Price</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-500 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {currentItems.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                    <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-white font-bold text-base leading-none mb-1 uppercase tracking-tight">{item.name}</p>
                  <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider line-clamp-1 max-w-[200px]">
                    {item.description || "No description provided."}
                  </p>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-white/60 text-[10px] font-bold uppercase border border-white/5">
                    {item.category}
                  </span>
                </td>
                <td className="p-6">
                  {/* FIX: Changed item.price to item.basePrice */}
                  <span className="text-white font-black text-lg font-mono">
                    ৳{item.basePrice || item.price || "0"}
                  </span>
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

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-white/20 font-black uppercase tracking-[0.3em]">No items found in estate</p>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;