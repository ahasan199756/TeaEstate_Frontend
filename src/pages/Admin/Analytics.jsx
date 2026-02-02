import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Package, 
  DollarSign, ShoppingCart, Star, ArrowUpRight 
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    categories: []
  });

  useEffect(() => {
    // Pulling real data from the keys we used in Checkout and Admin
    const products = JSON.parse(localStorage.getItem('teaProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const categories = JSON.parse(localStorage.getItem('teaCategories') || '["Black Tea", "Green Tea", "Oolong", "White Tea"]');
    
    setData({ products, orders, categories });
  }, []);

  // 1. Calculate REAL Sales Metrics
  const totalSalesRevenue = data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalOrders = data.orders.length;
  const avgOrderValue = totalOrders > 0 ? (totalSalesRevenue / totalOrders).toFixed(2) : 0;

  // 2. Inventory vs Market Value
  const inventoryValue = data.products.reduce((sum, p) => sum + Number(p.basePrice || 0), 0);

  // 3. Category Distribution
  const categoryStats = data.categories.map(cat => {
    const productsInCat = data.products.filter(p => p.category === cat);
    const count = productsInCat.length;
    const value = productsInCat.reduce((sum, p) => sum + Number(p.basePrice || 0), 0);
    
    return { name: cat, count, value };
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <BarChart3 className="text-emerald-500" size={36} /> Market Intelligence
          </h1>
          <p className="text-emerald-500/60 font-medium mt-2">Live performance of your tea empire.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Data Status:</span>
            <span className="ml-3 text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse">● Live</span>
        </div>
      </header>

      {/* PRIMARY SALES METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-emerald-500 p-8 rounded-[35px] text-black">
          <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">Gross Revenue</p>
          <h3 className="text-4xl font-black font-mono">৳{totalSalesRevenue.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold">
            <ArrowUpRight size={14} /> +12.5% vs last month
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[35px]">
          <div className="flex justify-between items-start mb-4">
            <ShoppingCart className="text-emerald-500" size={20} />
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">LIVE</span>
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-3xl font-mono text-white">{totalOrders}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[35px]">
          <TrendingUp className="text-blue-400 mb-4" size={20} />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Avg Order Value</p>
          <h3 className="text-3xl font-mono text-white">৳{avgOrderValue}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[35px]">
          <Package className="text-purple-400 mb-4" size={20} />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Items in Catalog</p>
          <h3 className="text-3xl font-mono text-white">{data.products.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CATEGORY TABLE */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-white font-bold text-xl flex items-center gap-3">
              <PieChart size={20} className="text-emerald-500" /> Catalog Composition
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Estate Category</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest text-center">SKUs</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Asset Value</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categoryStats.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 font-bold text-white group-hover:text-emerald-400 transition-colors uppercase text-xs tracking-widest">{stat.name}</td>
                    <td className="p-6 text-white/60 font-mono text-center">{stat.count}</td>
                    <td className="p-6 text-white/60 font-mono">৳{stat.value.toLocaleString()}</td>
                    <td className="p-6">
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-1000"
                          style={{ width: `${(stat.value / (inventoryValue || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT SALES FEED */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
          <h3 className="text-white font-bold text-xl mb-8 flex items-center gap-3">
            <Star size={20} className="text-emerald-500" /> Recent Activity
          </h3>
          <div className="space-y-6">
            {data.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center group">
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-tight">{order.id}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-500 font-mono font-bold">৳{order.total}</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest">Completed</p>
                </div>
              </div>
            ))}
            {data.orders.length === 0 && (
              <div className="text-center py-20 text-white/20 text-xs font-black uppercase tracking-[0.2em]">
                No sales yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-1 rounded-[40px]">
        <div className="bg-[#0a0a0a] p-10 rounded-[38px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-white font-black text-2xl uppercase leading-tight">Export Business Review</h3>
            <p className="text-white/40 text-sm mt-2 font-medium">Generate a comprehensive PDF of all orders, inventory shifts, and customer growth.</p>
          </div>
          <button className="bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-emerald-500/10">
            Download Q1 Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;