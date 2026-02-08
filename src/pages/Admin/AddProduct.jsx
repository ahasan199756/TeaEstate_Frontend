import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Save, X, Link as LinkIcon, Image as ImageIcon, 
  FileText, Download, AlertCircle, Banknote, Percent, Star 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const fileInputRef = useRef(null);
  const bulkFileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editProduct;

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [formData, setFormData] = useState({
    id: Date.now(),
    name: '',
    category: 'Green Tea',
    basePrice: '',
    discountPrice: '',
    discountType: 'flat',
    vat: '5',
    description: '',
    img: '',
    isFeatured: false 
  });

  // Design Tokens
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]";
  const glassInput = "bg-white/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all outline-none shadow-inner";

  useEffect(() => {
    const savedCats = JSON.parse(localStorage.getItem('teaCategories') || '["Black Tea", "Green Tea", "Oolong", "White Tea"]');
    setAvailableCategories(savedCats);
    if (editData) setFormData(editData);
  }, [editData]);

  const getDiscountValue = () => {
    const base = Number(formData.basePrice) || 0;
    const disc = Number(formData.discountPrice) || 0;
    return formData.discountType === 'percent' ? (base * disc) / 100 : disc;
  };

  const discountAmount = getDiscountValue();
  const priceAfterDiscount = (Number(formData.basePrice) || 0) - discountAmount;
  const finalPrice = priceAfterDiscount * (1 + Number(formData.vat) / 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingItems = JSON.parse(localStorage.getItem('teaProducts')) || [];
    const finalProduct = {
      ...formData,
      basePrice: Number(formData.basePrice),
      discountPrice: Number(formData.discountPrice || 0),
      vat: Number(formData.vat),
      updatedAt: new Date().toISOString()
    };

    let updatedItems = editData 
      ? existingItems.map(item => item.id === formData.id ? finalProduct : item)
      : [...existingItems, { ...finalProduct, id: Date.now() }];

    localStorage.setItem('teaProducts', JSON.stringify(updatedItems));
    navigate('/admin/products');
  };

  // --- LOGIC: CSV TEMPLATE & IMPORT ---
  const downloadTemplate = () => {
    const headers = "Name,Category,BasePrice,DiscountPrice,DiscountType,VAT,Description,ImageURL,IsFeatured\n";
    const sampleData = "Premium Matcha,Green Tea,1200,10,percent,5,High quality matcha powder,https://example.com/tea.jpg,true";
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estate_import_template.csv';
    a.click();
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const dataRows = rows.slice(1); 
        const newProducts = dataRows.map(row => {
          const cols = row.split(',').map(c => c.trim());
          return {
            id: Date.now() + Math.random(),
            name: cols[0],
            category: cols[1] || 'Green Tea',
            basePrice: Number(cols[2]) || 0,
            discountPrice: Number(cols[3]) || 0,
            discountType: cols[4] === 'percent' ? 'percent' : 'flat',
            vat: Number(cols[5]) || 5,
            description: cols[6] || '',
            img: cols[7] || '',
            isFeatured: cols[8]?.toLowerCase() === 'true',
            updatedAt: new Date().toISOString()
          };
        });
        const existing = JSON.parse(localStorage.getItem('teaProducts')) || [];
        localStorage.setItem('teaProducts', JSON.stringify([...existing, ...newProducts]));
        alert(`Imported ${newProducts.length} items.`);
        navigate('/admin/products');
      } catch (err) { alert("CSV Error."); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 pt-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Catalog Management</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            {editData ? 'Modify' : 'Add'} <span className="text-emerald-500 font-light italic lowercase tracking-normal">product</span>
          </h1>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setIsBulkMode(false)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isBulkMode ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Single Entry</button>
          <button onClick={() => setIsBulkMode(true)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isBulkMode ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Bulk Import</button>
        </div>
      </div>

      {isBulkMode ? (
        <div className={`${glassCard} rounded-[40px] p-16 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all border-dashed border-2`}>
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-100">
            <FileText size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-2 tracking-tighter">Global Import</h2>
          <p className="text-slate-400 text-sm max-w-md mb-8">Upload your CSV manifest. Ensure the 'IsFeatured' column contains true/false values.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => bulkFileRef.current.click()} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">Select CSV File</button>
            <button onClick={downloadTemplate} className="px-12 py-5 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"><Download size={16} /> Template</button>
          </div>
          <input type="file" ref={bulkFileRef} className="hidden" accept=".csv" onChange={handleBulkImport} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: VISUALS & AUDIT */}
          <div className="lg:col-span-4 space-y-8">
            <div className={`relative group aspect-[4/5] rounded-[40px] overflow-hidden transition-all shadow-2xl border-4 border-white ${!formData.img && 'bg-slate-100 border-dashed border-slate-200 border-2'}`}>
              {formData.img ? (
                <>
                  <img src={formData.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all bg-slate-900/60 backdrop-blur-sm">
                    <button type="button" onClick={() => fileInputRef.current.click()} className="w-36 py-3 bg-white text-slate-900 text-[10px] font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"><ImageIcon size={14}/> Local File</button>
                    <button type="button" onClick={() => {
                      const url = prompt("Image URL:");
                      if(url) setFormData({...formData, img: url});
                    }} className="w-36 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"><LinkIcon size={14}/> Web URL</button>
                    <button type="button" onClick={() => setFormData({...formData, img: ''})} className="mt-2 text-rose-400 hover:text-rose-300 text-[10px] font-black uppercase tracking-[0.2em]">Clear Image</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center" onClick={() => fileInputRef.current.click()}>
                  <div className="p-8 rounded-full bg-white text-slate-300 mb-6 shadow-inner">
                    <Upload size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Upload Harvest Visual</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setFormData({ ...formData, img: reader.result });
                  reader.readAsDataURL(file);
                }
              }} />
            </div>

            {/* FEATURED TOGGLE */}
            <div 
              onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
              className={`${glassCard} cursor-pointer p-6 rounded-[35px] flex items-center justify-between group transition-all ${formData.isFeatured ? 'border-yellow-400 bg-yellow-50/50' : 'hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all ${formData.isFeatured ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 'bg-slate-100 text-slate-300'}`}>
                  <Star size={20} fill={formData.isFeatured ? "currentColor" : "none"} strokeWidth={3} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${formData.isFeatured ? 'text-yellow-600' : 'text-slate-400'}`}>Market Highlight</p>
                  <p className="text-slate-900 text-xs font-black uppercase italic">{formData.isFeatured ? 'Featured Active' : 'Standard Listing'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all ${formData.isFeatured ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.isFeatured ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className={`${glassCard} rounded-[35px] p-8`}>
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Price Synthesis</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase tracking-widest">Base Value</span> <span className="text-slate-900 font-mono">৳{formData.basePrice || '0.00'}</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase tracking-widest">Deductions</span> <span className="text-rose-500 font-mono">-৳{discountAmount.toFixed(2)}</span></div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Market Price</span>
                  <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter italic">৳{finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM FIELDS */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            <div className={`${glassCard} p-10 rounded-[45px] space-y-8`}>
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Product Designation</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`${glassInput} w-full rounded-2xl p-5 text-slate-900 font-bold placeholder:text-slate-300`} placeholder="e.g. Imperial Oolong Harvest" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`${glassInput} w-full rounded-2xl p-5 text-slate-900 font-bold appearance-none cursor-pointer`}>
                    {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Govt Tax (VAT %)</label>
                  <input type="number" value={formData.vat} onChange={(e) => setFormData({...formData, vat: e.target.value})} className={`${glassInput} w-full rounded-2xl p-5 text-slate-900 font-bold`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[35px] border border-slate-100">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Base Rate (৳)</label>
                  <input type="number" required value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className={`${glassInput} bg-white w-full rounded-2xl p-5 text-slate-900 font-bold`} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mark down</label>
                    <div className="flex bg-slate-200 rounded-lg p-1 scale-90">
                      <button type="button" onClick={() => setFormData({...formData, discountType: 'flat'})} className={`px-3 py-1 text-[9px] font-black rounded-md transition-all ${formData.discountType === 'flat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><Banknote size={12}/></button>
                      <button type="button" onClick={() => setFormData({...formData, discountType: 'percent'})} className={`px-3 py-1 text-[9px] font-black rounded-md transition-all ${formData.discountType === 'percent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><Percent size={12}/></button>
                    </div>
                  </div>
                  <input type="number" value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} className={`${glassInput} bg-white w-full rounded-2xl p-5 text-slate-900 font-bold`} placeholder={formData.discountType === 'flat' ? 'Fixed Amount' : 'Percentage %'} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Product Narrative</label>
                <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`${glassInput} w-full rounded-3xl p-6 text-slate-900 font-bold h-40 resize-none`} placeholder="Describe the aroma, origin, and tasting notes..."></textarea>
              </div>

              <button type="submit" className="group w-full py-8 bg-slate-900 text-white rounded-[35px] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4">
                <Save size={20} className="group-hover:scale-110 transition-transform" /> 
                {editData ? 'Commit Update' : 'Initialize Listing'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;