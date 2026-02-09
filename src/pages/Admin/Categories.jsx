import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Layers } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

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
    const updated = categories.map(c => c === oldName ? editValue : c);
    saveToStorage(updated);
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
          <Layers className="text-emerald-500" size={36} /> Category Manager
        </h1>
        <p className="text-emerald-500/60 font-medium mt-2">Create and organize the structural layers of your shop.</p>
      </header>

      {/* INPUT BOX */}
      <div className="flex gap-4 mb-10 bg-white/5 p-3 rounded-[30px] border border-white/10 focus-within:border-emerald-500/50 transition-all">
        <input 
          type="text" 
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Enter new category name (e.g. Herbal Infusions)"
          className="flex-1 bg-transparent border-none text-white outline-none px-6 font-medium"
        />
        <button 
          onClick={addCategory}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="grid gap-4">
        {categories.map((cat) => (
          <div key={cat} className="group flex items-center justify-between bg-white/5 border border-white/5 p-6 rounded-[25px] hover:bg-white/[0.07] transition-all">
            {editingId === cat ? (
              <div className="flex items-center gap-4 flex-1">
                <input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-black/40 text-white px-4 py-2 rounded-xl outline-none border border-emerald-500 w-full max-w-sm"
                  autoFocus
                />
                <button onClick={() => handleUpdate(cat)} className="p-3 bg-emerald-500 rounded-xl text-white"><Save size={18}/></button>
                <button onClick={() => setEditingId(null)} className="p-3 bg-white/10 rounded-xl text-white"><X size={18}/></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-lg text-white font-bold tracking-tight">{cat}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingId(cat); setEditValue(cat); }} 
                    className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                  >
                    <Edit3 size={18}/>
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat)} 
                    className="p-3 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;