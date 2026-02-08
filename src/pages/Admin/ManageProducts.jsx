import React, { useState, useEffect, useMemo } from 'react';
import { 
  Edit3, Trash2, Plus, Search, ChevronLeft, 
  ChevronRight, Star, Package, ShoppingBag, Filter 
} from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import { initialProductItems as initialData } from '../products';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Design Tokens (Matching your new theme)
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]";
  const glassInput = "bg-white/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all outline-none shadow-inner";

  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialData);
    }
  }, []);

  const toggleFeatured = (id) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProducts(updated);
    localStorage.setItem('teaProducts', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this tea from the inventory?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('teaProducts', JSON.stringify(updated));
    }
  };

  // Filter & Pagination Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Inventory Control</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Manage <span className="text-emerald-500 font-light italic lowercase tracking-normal">Products</span>
          </h1>
        </div>

        <button 
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} /> Add New Tea
        </button>
      </header>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or category..."
            className={`${glassInput} w-full rounded-2xl py-5 pl-14 pr-6 text-slate-900 text-[11px] font-black tracking-widest uppercase placeholder:text-slate-300`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className={`${glassCard} rounded-[40px] overflow-hidden`}>
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-8 text-[10px] font-black uppercase text-emerald-600 tracking-widest border-b border-slate-100">Status</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Preview</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Product Details</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.map((item) => (
              <tr key={item.id} className="group hover:bg-white/80 transition-all">
                {/* FEATURED TOGGLE */}
                <td className="p-8">
                  <button 
                    onClick={() => toggleFeatured(item.id)}
                    className={`transition-all duration-300 transform hover:scale-110 ${item.isFeatured ? 'text-yellow-500' : 'text-slate-200 hover:text-slate-400'}`}
                  >
                    <Star size={24} fill={item.isFeatured ? "currentColor" : "none"} strokeWidth={item.isFeatured ? 0 : 2} />
                  </button>
                </td>

                {/* IMAGE */}
                <td className="p-8">
                  <div className="relative w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white shadow-sm group-hover:shadow-md transition-all">
                    <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </td>
                
                {/* DETAILS */}
                <td className="p-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="text-slate-900 font-black text-lg uppercase tracking-tighter italic">
                        {item.name}
                      </p>
                      {item.isFeatured && (
                        <span className="text-[8px] font-black bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full tracking-widest border border-yellow-200">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{item.category}</p>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => navigate('/admin/add-product', { state: { editProduct: item } })}
                      className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-4 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <Package size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No products found in manifest</p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Showing <span className="text-slate-900">{indexOfLastItem - itemsPerPage + 1}</span> - <span className="text-slate-900">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of {filteredProducts.length}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
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