import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Layers, Tag, ChevronRight } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Design Tokens
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]";
  const glassInput = "bg-white/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all outline-none shadow-inner";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('teaCategories') || '["Black Tea", "Green Tea", "Oolong"]');
    setCategories(saved);
  }, []);

  const saveToStorage = (list) => {
    setCategories(list);
    localStorage.setItem('teaCategories', JSON.stringify(list));
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    if (categories.includes(newCat)) return alert("Category already exists");
    saveToStorage([...categories, newCat.trim()]);
    setNewCat("");
  };

  const deleteCategory = (name) => {
    if (window.confirm(`Delete "${name}"? Existing products in this category won't be deleted, but they will lose their category link.`)) {
      saveToStorage(categories.filter(c => c !== name));
    }
  };

  const handleUpdate = (oldName) => {
    if (!editValue.trim()) return;
    const updated = categories.map(c => c === oldName ? editValue.trim() : c);
    saveToStorage(updated);
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Taxonomy Engine</p>
        </div>
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
          Category <span className="text-emerald-500 font-light italic lowercase tracking-normal">Manager</span>
        </h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">Organize your harvest into structural layers.</p>
      </header>

      {/* NEW CATEGORY INPUT */}
      <div className={`${glassCard} p-4 rounded-[35px] flex flex-col md:flex-row gap-4 mb-12`}>
        <div className="relative flex-grow">
          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="E.G. HERBAL INFUSIONS, RARE HARVESTS..."
            className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] py-5 pl-14 pr-6 text-slate-900 text-[11px] font-black tracking-widest uppercase outline-none focus:bg-white focus:border-emerald-500 transition-all placeholder:text-slate-300"
          />
        </div>
        <button 
          onClick={addCategory}
          className="bg-slate-900 hover:bg-emerald-600 text-white px-10 py-5 rounded-[22px] font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {/* CATEGORY LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat} 
            className={`${glassCard} group flex items-center justify-between p-6 rounded-[30px] hover:border-emerald-200 transition-all hover:translate-y-[-2px]`}
          >
            {editingId === cat ? (
              <div className="flex items-center gap-3 w-full">
                <input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-white border border-emerald-500 text-slate-900 px-4 py-3 rounded-2xl outline-none font-black text-[11px] uppercase tracking-widest"
                  autoFocus
                />
                <button 
                  onClick={() => handleUpdate(cat)} 
                  className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100"
                >
                  <Save size={18}/>
                </button>
                <button 
                  onClick={() => setEditingId(null)} 
                  className="p-3 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X size={18}/>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Layers size={20} />
                  </div>
                  <div>
                    <span className="text-sm text-slate-900 font-black uppercase tracking-tight italic group-hover:text-emerald-600 transition-colors">
                      {cat}
                    </span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manifest Layer</p>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => { setEditingId(cat); setEditValue(cat); }} 
                    className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm transition-all"
                  >
                    <Edit3 size={16}/>
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat)} 
                    className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30">
            <Layers size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory Structure Empty</p>
          </div>
        )}
      </div>

      {/* QUICK INFO FOOTER */}
      <div className="mt-12 p-8 rounded-[35px] border-2 border-dashed border-slate-200 flex items-center gap-6">
        <div className="p-4 bg-white rounded-2xl text-slate-400 shadow-sm">
          <ChevronRight size={20} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          Tip: Category names are case-sensitive. Changing a category name will update the filter labels on the shop floor instantly.
        </p>
      </div>
    </div>
  );
};

export default Categories;