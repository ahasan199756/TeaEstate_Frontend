import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Package, ShoppingBag, Users, TrendingUp, AlertTriangle, 
  Activity, Clock, ChevronRight, Search, Plus, Filter, ArrowUpRight,
  Archive, RefreshCcw, ShieldCheck, Calendar, MoreHorizontal
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
    const startOfDay = new Date(new Date().setHours(0,0,0,0));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const getSales = (start) => orders
      .filter(o => new Date(o.date || o.timestamp) >= start)
      .reduce((acc, o) => acc + Number(o.total || 0), 0);

    setData({
      products,
      orders: [...orders].reverse(), 
      customers: [...new Set(orders.map(o => o.email))],
      temporal: {
        today: getSales(startOfDay),
        weekly: getSales(startOfWeek),
        monthly: getSales(startOfMonth)
      }
    });
  }, []);

  const totalRev = data.orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const lowStock = data.products.filter(p => Number(p.stock) < 10).length;
  const aov = data.orders.length > 0 ? (totalRev / data.orders.length).toFixed(0) : 0;
  const config = { currency: '৳' };

  // STYLE PRESETS - Label text is now Emerald Green by default
  const cardStyle = "bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden";
  const labelStyle = "text-[11px] font-black text-emerald-600 uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 text-slate-900 font-sans antialiased">
      
      {/* 1. HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live System Metrics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Dashboard <span className="text-emerald-500 font-light italic">Core</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH DATA..." 
              className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all uppercase tracking-wider"
            />
          </div>
        </div>
      </header>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Revenue Today', val: data.temporal.today, icon: Clock },
          { label: 'Total Sales', val: totalRev, icon: TrendingUp },
          { label: 'Avg Order Value', val: aov, icon: Activity },
          { label: 'Total Customers', val: data.customers.length, icon: Users, isCurrency: false }
        ].map((kpi, i) => (
          <div key={i} className={`${cardStyle} p-7 border-l-4 border-l-emerald-500`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <kpi.icon size={22} />
              </div>
            </div>
            <div>
              <p className={labelStyle}>{kpi.label}</p>
              <h3 className="text-3xl font-black mt-1 tracking-tighter text-slate-900">
                {kpi.isCurrency === false ? '' : config.currency}
                {kpi.val.toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CORE ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ORDERS */}
        <div className={`${cardStyle} lg:col-span-2 shadow-lg shadow-emerald-900/5`}>
          <div className="p-8 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/10">
            <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 text-sm">
               Live Order Stream
            </h3>
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-emerald-50/30">
                  <th className="px-8 py-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {data.orders.slice(0, 8).map((order, i) => (
                  <tr key={i} className="hover:bg-emerald-50/20 transition-colors cursor-pointer">
                    <td className="px-8 py-5 font-mono text-[12px] font-bold text-emerald-600">#{order.id?.toString().slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{order.customerName}</p>
                      <p className="text-[11px] font-bold text-emerald-600/70">{order.email}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                      {config.currency}{Number(order.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVENTORY WIDGET */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-8 text-emerald-400">Inventory Status</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Low Stock</p>
                  <p className="text-4xl font-black text-white">{lowStock}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Products</p>
                  <p className="text-4xl font-black text-white">{data.products.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white border-2 border-emerald-50 p-6 rounded-[28px] flex flex-col items-center gap-4 hover:border-emerald-500 transition-all group">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">New Product</span>
            </button>
            <button className="bg-white border-2 border-emerald-50 p-6 rounded-[28px] flex flex-col items-center gap-4 hover:border-emerald-500 transition-all group">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <RefreshCcw size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sync Inventory</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 pt-8 border-t border-emerald-50 flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
        <p>© Estate Admin Dashboard</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><ShieldCheck size={14}/> Encrypted</span>
          <span className="text-slate-200">|</span>
          <span>Session: Active</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;