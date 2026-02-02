import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { initialProductItems as initialData } from '../products';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Load products from LocalStorage or initial file
  useEffect(() => {
    const savedProducts = localStorage.getItem('teaProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialData);
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this tea from the estate?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('teaProducts', JSON.stringify(updated));
    }
  };

  const handleEdit = (product) => {
    // Navigate to AddProduct page but pass the product data via state
    navigate('/admin/add-product', { state: { editProduct: product } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Product Catalog</h1>
          <p className="text-emerald-400/60 mt-1">Manage your premium collection</p>
        </div>
        <Link to="/admin/add-product" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all">
          <Plus size={18} /> Add New Variety
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-6 text-[10px] font-black uppercase text-emerald-400">Preview</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-400">Product Detail</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-400">Price</th>
              <th className="p-6 text-[10px] font-black uppercase text-emerald-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <img src={item.img} alt="" className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                </td>
                <td className="p-6">
                  <p className="text-white font-bold text-lg">{item.name}</p>
                  <p className="text-white/40 text-sm line-clamp-1 max-w-xs">{item.description}</p>
                </td>
                <td className="p-6">
                  <span className="text-emerald-400 font-black text-lg">${item.price}</span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-3 rounded-xl bg-white/5 text-white hover:bg-emerald-500 transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 rounded-xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;