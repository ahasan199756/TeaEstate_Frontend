import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Package, ShoppingBag, Users, TrendingUp, AlertTriangle, 
  Activity, Clock, ChevronRight, Search, Plus, Filter, ArrowUpRight,
  MousePointerClick, Archive, RefreshCcw, ShieldCheck, Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    customers: [],
    temporal: { weekly: 0, monthly: 0, today: 0 }
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('teaProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');

    const now = new Date();
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const getSales = (start) => orders
      .filter(o => new Date(o.date || o.timestamp) >= start)
      .reduce((acc, o) => acc + Number(o.total || 0), 0);

    setData({
      products,
      orders,
      customers: [...new Set(orders.map(o => o.customerEmail))],
      temporal: {
        today: getSales(startOfDay),
        weekly: getSales(startOfWeek),
        monthly: getSales(startOfMonth)
      }
    });
  }, []);

  const totalRev = data.orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const lowStock = data.products.filter(p => Number(p.stock) < 10).length;
  const aov = data.orders.length > 0 ? (totalRev / data.orders.length).toFixed(2) : 0;

  const glassPanel = "bg-[#013221]/80 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden";
  const labelText = "text-[10px] font-black text-white/30 uppercase tracking-[0.2em]";

  return (
    <div className="min-h-screen space-y-8 p-6 pb-24 text-white animate-in fade-in duration-1000">

      {/* GLOBAL COMMAND HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Secure Admin Authority</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            Dashboard 
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="GLOBAL SEARCH (ORDERS, SKUS...)" 
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-bold w-72 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
            />
          </div>
          <button className="bg-emerald-500 p-4 rounded-2xl text-black hover:scale-105 transition-transform">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* AT-A-GLANCE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Yield: Today', val: data.temporal.today, icon: Clock, color: 'text-white' },
          { label: 'Yield: 7 Days', val: data.temporal.weekly, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Yield: 30 Days', val: data.temporal.monthly, icon: Calendar, color: 'text-white' }
        ].map((kpi, i) => (
          <div key={i} className={`${glassPanel} p-8 flex justify-between items-center group cursor-pointer hover:shadow-emerald-500/40 transition-shadow`}>
            <div>
              <p className={labelText}>{kpi.label}</p>
              <h3 className={`text-4xl font-black font-mono mt-1 ${kpi.color}`}>৳{kpi.val.toLocaleString()}</h3>
            </div>
            <kpi.icon className="text-white/10 group-hover:text-emerald-500 transition-colors" size={40} />
          </div>
        ))}
      </div>

      {/* CORE ANALYTICS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Orders Overview */}
        <div className={`${glassPanel} p-8 lg:col-span-1 border-t-4 border-emerald-500`}>
          <p className={labelText}>Conversion Engine</p>
          <div className="mt-6 space-y-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black italic uppercase">Orders</span>
                <span className="text-emerald-500 font-mono text-sm">{data.orders.length}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className={labelText}>AOV</p>
                <p className="text-lg font-bold">৳{aov}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className={labelText}>Users</p>
                <p className="text-lg font-bold">{data.customers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Management */}
        <div className={`${glassPanel} lg:col-span-3`}>
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-sm font-black uppercase tracking-widest italic">Live Order Stream</h3>
            <Activity className="text-emerald-500 animate-pulse" size={16} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40">
                <tr>
                  <th className={`p-6 ${labelText}`}>Reference</th>
                  <th className={`p-6 ${labelText}`}>Customer</th>
                  <th className={`p-6 ${labelText}`}>Status</th>
                  <th className={`p-6 ${labelText} text-right`}>Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.orders.slice(0, 5).map((order, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="p-6 font-mono text-xs text-white/40 group-hover:text-emerald-500 transition-colors">#{order.id?.toString().slice(-8).toUpperCase()}</td>
                    <td className="p-6 font-bold text-sm">{order.customerName || 'Anonymous'}</td>
                    <td className="p-6">
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase">Paid</span>
                    </td>
                    <td className="p-6 text-right font-mono font-bold">৳{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* INVENTORY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Stock Management */}
        <div className={`${glassPanel} p-10 bg-gradient-to-br from-[#013221] to-black`}>
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <Archive className="text-emerald-500" size={24} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Inventory Health</h3>
            </div>
            <button className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest">Restock All</button>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className={labelText}>Low Stock Warnings</p>
              <p className={`text-4xl font-black font-mono ${lowStock > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>{lowStock}</p>
            </div>
            <div className="space-y-1">
              <p className={labelText}>Asset Valuation</p>
              <p className="text-4xl font-black font-mono">৳{totalRev.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Add SKU', icon: Plus, color: 'bg-emerald-500 text-black' },
            { label: 'Fulfill', icon: Package, color: 'bg-white/5 text-white' },
            { label: 'Marketing', icon: MousePointerClick, color: 'bg-white/5 text-white' },
            { label: 'Refresh', icon: RefreshCcw, color: 'bg-white/5 text-white' }
          ].map((btn, i) => (
            <button key={i} className={`${btn.color} rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl`}>
              <btn.icon size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
