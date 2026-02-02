import React, { useState, useEffect } from 'react';
import { Upload, Save, X, Percent, BadgePercent } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editProduct;

  const [formData, setFormData] = useState({
    id: Date.now(),
    name: '',
    category: 'Green Tea',
    basePrice: '',
    discountPrice: '',
    vat: '5', // Default VAT %
    description: '',
    img: ''
  });

  useEffect(() => {
  // Load real categories from localStorage
  const savedCats = JSON.parse(localStorage.getItem('teaCategories') || '["Black Tea", "Green Tea"]');
  setAvailableCategories(savedCats);
  
  if (editData) setFormData(editData);
}, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingItems = JSON.parse(localStorage.getItem('teaProducts')) || [];
    
    // Final check for the data object
    const finalProduct = {
      ...formData,
      // Ensure prices are treated as numbers
      basePrice: Number(formData.basePrice),
      discountPrice: Number(formData.discountPrice || 0),
      vat: Number(formData.vat),
      updatedAt: new Date().toISOString()
    };

    let updatedItems;
    if (editData) {
      updatedItems = existingItems.map(item => item.id === formData.id ? finalProduct : item);
    } else {
      updatedItems = [...existingItems, { ...finalProduct, id: Date.now() }];
    }

    localStorage.setItem('teaProducts', JSON.stringify(updatedItems));
    navigate('/admin/products');
  };

  // Helper to handle image URL simulation (since we aren't using a cloud server yet)
  const handleImageUpload = () => {
    const url = prompt("Enter Image URL (Unsplash or similar):");
    if (url) setFormData({ ...formData, img: url });
  };

  return (
    <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            {editData ? 'Modify Product' : 'Catalog New Item'}
          </h1>
          <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mt-1">Inventory Management System</p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="text-white/20 hover:text-white transition-colors">
          <X size={32} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: MEDIA SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onClick={handleImageUpload}
            className="aspect-[4/5] bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center gap-4 group hover:border-emerald-500 transition-all overflow-hidden cursor-pointer relative"
          >
            {formData.img ? (
              <>
                <img src={formData.img} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={30} className="text-white" />
                </div>
              </>
            ) : (
              <>
                <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                  <Upload size={30} />
                </div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Add Product Image</p>
              </>
            )}
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Price Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-white/40">MSRP:</span> <span className="text-white font-mono">৳{formData.basePrice || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/40">Discount:</span> <span className="text-red-400 font-mono">-৳{formData.discountPrice || 0}</span></div>
              <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-emerald-400 font-bold">Final Price:</span>
                <span className="text-emerald-400 font-black text-lg font-mono">
                  ৳{((Number(formData.basePrice) - Number(formData.discountPrice)) * (1 + Number(formData.vat)/100)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DATA SECTION */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Product Title</label>
              <input 
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all" 
                placeholder="e.g. Premium Sylhet Black Tea" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Category</label>
              <select 
  value={formData.category}
  onChange={(e) => setFormData({...formData, category: e.target.value})}
  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
>
  <option value="" disabled className="bg-[#062016]">Select a Category</option>
  {availableCategories.map(cat => (
    <option key={cat} value={cat} className="bg-[#062016]">{cat}</option>
  ))}
</select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Tax (VAT %)</label>
              <input 
                type="number" value={formData.vat}
                onChange={(e) => setFormData({...formData, vat: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all" 
              />
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="grid grid-cols-2 gap-6 p-8 bg-emerald-500/5 rounded-[30px] border border-emerald-500/10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Base Price (৳)</label>
              <input 
                type="number" required value={formData.basePrice}
                onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all" 
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Discount Price (৳)</label>
              <input 
                type="number" value={formData.discountPrice}
                onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all" 
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Detailed Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-48 focus:border-emerald-500 outline-none transition-all resize-none" 
              placeholder="Describe the aroma, taste, and origin..."
            />
          </div>

          <button type="submit" className="w-full py-6 bg-emerald-500 text-white rounded-[25px] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3">
            <Save size={20} /> {editData ? 'Update Estate Database' : 'Publish to Storefront'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;