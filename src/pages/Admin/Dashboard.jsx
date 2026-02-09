import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, Package, ShoppingBag, Users, TrendingUp, 
  Activity, ArrowUpRight, Search, Sparkles, Trophy,
  Wallet, PieChart, Zap, Filter, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, BarChart, Bar, Cell 
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    customers: [],
    summary: { income: 0, cost: 0, revenue: 0 }
  });

  // 1. DATA INITIALIZATION & FINANCIAL LOGIC
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('teaProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');

    // Financial Calculation Logic
    const totalIncome = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    // Business Logic: 45% represents Cost of Goods (Tea leaves, packaging, shipping)
    const estimatedCost = totalIncome * 0.45; 
    const netRevenue = totalIncome - estimatedCost;

    setData({
      products,
      orders,
      customers: [...new Set(orders.map(o => o.customerEmail))],
      summary: { 
        income: totalIncome, 
        cost: estimatedCost, 
        revenue: netRevenue 
      }
    });
  }, []);

  // 2. ANALYTICS & GRAPH MAPPING
  const analytics = useMemo(() => {
    // Mocking a 7-day financial trend based on the current income
    const base = data.summary.income / 7;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const financialTrend = days.map((day, i) => {
      const dailyIncome = base * (0.8 + Math.random() * 0.5);
      const dailyCost = dailyIncome * 0.45;
      return {
        day,
        income: Math.round(dailyIncome),
        cost: Math.round(dailyCost),
        revenue: Math.round(dailyIncome - dailyCost)
      };
    });

    const topClients = data.orders.reduce((acc, o) => {
      const email = o.customerEmail || 'Guest';
      if (!acc[email]) acc[email] = { name: o.customerName, total: 0, count: 0 };
      acc[email].total += Number(o.total);
      acc[email].count += 1;
      return acc;
    }, {});

    return { 
      financialTrend, 
      topClients: Object.entries(topClients)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 4) 
    };
  }, [data]);

  // UI THEME CONSTANTS
  const glassPanel = "bg-[#01261d]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden";
  const labelText = "text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.3em]";

  return (
    <div className="min-h-screen bg-[#00140d] p-6 lg:p-10 text-white font-sans selection:bg-emerald-500/30">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-emerald-500 h-1.5 w-10 rounded-full" />
            <span className={labelText}>System Live</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Tea Estate <span className="text-emerald-500 text-2xl not-italic ml-2">HQ</span></h1>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input type="text" placeholder="QUERY LEDGER..." className="bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-[11px] font-bold w-full lg:w-80 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest" />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black p-5 rounded-2xl transition-transform active:scale-95 shadow-lg shadow-emerald-500/20">
            <Zap size={20} fill="black" />
          </button>
        </div>
      </header>

      {/* --- FINANCIAL KPI ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Gross Income', val: data.summary.income, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Operating Cost', val: data.summary.cost, icon: Wallet, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Net Revenue', val: data.summary.revenue, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' }
        ].map((stat, i) => (
          <div key={i} className={`${glassPanel} p-8 relative group hover:border-white/10 transition-colors`}>
            <div className={`absolute top-8 right-8 p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className={labelText}>{stat.label}</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">৳{Math.round(stat.val).toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-white/30">
              <ArrowUpRight size={14} className="text-emerald-500" /> +4.2% FROM PREVIOUS PERIOD
            </div>
          </div>
        ))}
      </div>

      {/* --- FINANCIAL TREND GRAPH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className={`${glassPanel} lg:col-span-2 p-10`}>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Profitability Matrix</h3>
              <p className="text-xs text-white/40">Real-time correlation of sales vs operational expenditure</p>
            </div>
            <div className="hidden md:flex gap-6">
              {['income', 'cost', 'revenue'].map(key => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${key === 'income' ? 'bg-emerald-500' : key === 'cost' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.financialTrend}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  cursor={{stroke: '#ffffff10', strokeWidth: 2}}
                  contentStyle={{backgroundColor: '#01140d', border: '1px solid #ffffff10', borderRadius: '20px', padding: '15px'}}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} fill="url(#gradIncome)" animationDuration={2000} />
                <Area type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- PERFORMANCE SIDEBAR --- */}
        <div className="space-y-8">
          {/* AI INSIGHTS */}
          <div className={`${glassPanel} p-8 bg-emerald-500/5 border-emerald-500/20`}>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-emerald-400" size={20} />
              <h3 className="text-sm font-black uppercase italic">AI Analysis</h3>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-black/20 rounded-2xl border-l-4 border-emerald-500">
                <p className="text-[11px] font-bold leading-relaxed text-emerald-100/80">
                  Revenue is outpacing costs by <span className="text-emerald-400">18.4%</span> this week. Recommend increasing marketing spend on "High-Margin" Oolong categories.
                </p>
              </div>
            </div>
          </div>

          {/* TOP CLIENTS */}
          <div className={`${glassPanel} p-8`}>
            <h3 className="text-sm font-black uppercase italic mb-6 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" /> High-Value Clients
            </h3>
            <div className="space-y-5">
              {analytics.topClients.map(([email, info], i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-black text-xs group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      {info.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{info.name || 'Guest User'}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-tighter">{info.count} Orders</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono font-black text-emerald-500">৳{info.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;