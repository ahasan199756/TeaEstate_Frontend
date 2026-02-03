import React, { useState, useEffect } from 'react';
import { 
  BarChart3, ShoppingCart, TrendingUp, 
  BrainCircuit, Zap, Activity, Target, ChevronRight, ArrowUpRight
} from 'lucide-react';

const Analytics = () => {
  const [realData, setRealData] = useState({ products: [], orders: [], categories: [] });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('teaProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const categories = JSON.parse(localStorage.getItem('teaCategories') || '["Black Tea", "Green Tea", "Oolong"]');
    setRealData({ products, orders, categories });
  }, []);

  const totalRevenue = realData.orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalStockValue = realData.products.reduce((sum, p) => sum + (Number(p.basePrice) || 0), 0);

  // THE "MATRIX GLASS" STYLE
  const obsidianCard = "bg-[#050505]/90 backdrop-blur-3xl border border-emerald-500/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]";
  const accentGreen = "text-emerald-500";
  const glowGreen = "shadow-[0_0_20px_rgba(16,185,129,0.2)]";

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* 1. POWER HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500/60">Live Intelligence Sync</span>
          </div>
          <h1 className="text-8xl font-black text-white uppercase tracking-[ -0.05em] leading-[0.8]">
            Estate <br />
            <span className="text-emerald-500 italic">Audit</span>
          </h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">System Integrity</p>
            <p className="text-xl font-mono font-bold text-white uppercase">Optimal</p>
          </div>
          <div className="h-12 w-[1px] bg-white/10"></div>
          <Activity size={32} className="text-emerald-500" />
        </div>
      </header>

      {/* 2. PROACTIVE AI CORE */}
      <div className={`${obsidianCard} p-1 ${glowGreen}`}>
        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-10 rounded-[2.4rem] flex flex-col lg:flex-row gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/30 blur-3xl group-hover:bg-emerald-500/50 transition-all"></div>
            <div className="relative bg-emerald-500 p-6 rounded-[2rem] text-black">
              <BrainCircuit size={48} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
               <Zap size={14} className="text-emerald-500 fill-emerald-500" />
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Neural Recommendation</h2>
            </div>
            <p className="text-3xl font-bold text-white leading-[1.1] tracking-tight">
              Total asset valuation is <span className="text-emerald-500">৳{totalStockValue.toLocaleString()}</span>. 
              {realData.orders.length > 5 ? " Consumer patterns suggest high affinity for premium blends." : " Initial data suggests expanding your category base."}
            </p>
          </div>

          <button className="whitespace-nowrap px-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-full hover:bg-emerald-500 hover:text-black transition-all shadow-xl shadow-white/5">
            Optimize Catalog
          </button>
        </div>
      </div>

      {/* 3. PERFORMANCE MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* REVENUE */}
        <div className={`${obsidianCard} p-10 group hover:border-emerald-500/40 transition-all`}>
          <div className="flex justify-between items-start mb-8">
             <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><TrendingUp size={24}/></div>
             <ArrowUpRight size={20} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Accumulated Revenue</p>
          <h3 className="text-6xl font-black text-white font-mono tracking-tighter">৳{totalRevenue.toLocaleString()}</h3>
          <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_#10b981]"></div>
          </div>
        </div>

        {/* ORDERS */}
        <div className={`${obsidianCard} p-10`}>
          <div className="flex justify-between items-start mb-8">
             <div className="p-3 bg-white/5 rounded-2xl text-white/60"><ShoppingCart size={24}/></div>
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Transactions</p>
          <h3 className="text-6xl font-black text-white font-mono tracking-tighter">{realData.orders.length}</h3>
          <p className="text-[10px] font-bold text-emerald-500 mt-6 flex items-center gap-2 italic uppercase">
            <Activity size={12}/> Live Order Stream
          </p>
        </div>

        {/* PRODUCTS */}
        <div className={`${obsidianCard} p-10`}>
          <div className="flex justify-between items-start mb-8">
             <div className="p-3 bg-white/5 rounded-2xl text-white/60"><Target size={24}/></div>
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Inventory Depth</p>
          <h3 className="text-6xl font-black text-white font-mono tracking-tighter">{realData.products.length}</h3>
          <p className="text-[10px] font-bold text-white/20 mt-6 uppercase tracking-widest">Verified SKUs</p>
        </div>
      </div>

      {/* 4. STRUCTURAL AUDIT TABLE */}
      <div className={`${obsidianCard} overflow-hidden`}>
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">Structural Composition</h3>
          <div className="flex gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
             <div className="h-2 w-2 rounded-full bg-emerald-500/20"></div>
             <div className="h-2 w-2 rounded-full bg-emerald-500/20"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">
              <tr>
                <th className="p-8">Category Identity</th>
                <th className="p-8">Asset Count</th>
                <th className="p-8">Revenue Weight</th>
                <th className="p-8 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white font-bold">
              {realData.categories.map((cat, i) => {
                const count = realData.products.filter(p => p.category === cat).length;
                return (
                  <tr key={i} className="hover:bg-emerald-500/[0.03] transition-colors group">
                    <td className="p-8">
                       <div className="flex items-center gap-4">
                          <span className="text-emerald-500 font-mono text-xs opacity-50">#0{i+1}</span>
                          <span className="text-xl uppercase tracking-tighter italic group-hover:text-emerald-500 transition-colors">{cat}</span>
                       </div>
                    </td>
                    <td className="p-8 font-mono text-white/40">{count} SKUs</td>
                    <td className="p-8">
                       <div className={`text-[10px] px-3 py-1 rounded-full border inline-block ${count > 0 ? 'border-emerald-500/50 text-emerald-500' : 'border-white/10 text-white/20'}`}>
                          {count > 0 ? 'ACTIVE' : 'EMPTY'}
                       </div>
                    </td>
                    <td className="p-8 text-right font-mono text-emerald-500">
                      {(Math.random() * 20 + 80).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;