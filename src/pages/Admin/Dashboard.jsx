import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign, TrendingUp, Wallet, Search, Zap,
  Sparkles, Trophy, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const COST_RATIO = 0.45;

const glassPanel = "bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 hover:border-emerald-500/20";
const labelText = "text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]";

const formatCurrency = (value) => `৳${Math.round(value || 0).toLocaleString()}`;

const AdminDashboard = () => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    customers: [],
    summary: { income: 0, cost: 0, revenue: 0 },
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("teaProducts") || "[]");
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");

    const totalIncome = orders.reduce((acc, order) => acc + Number(order.total || 0), 0);
    const estimatedCost = totalIncome * COST_RATIO;
    const netRevenue = totalIncome - estimatedCost;

    const uniqueCustomers = [...new Set(orders.map((o) => o.customerEmail).filter(Boolean))];

    setData({
      products,
      orders,
      customers: uniqueCustomers,
      summary: { income: totalIncome, cost: estimatedCost, revenue: netRevenue },
    });
  }, []);

  const analytics = useMemo(() => {
    const base = data.summary.income / 7 || 0;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const financialTrend = days.map((day, index) => {
      const multiplier = 0.85 + (index * 0.05);
      const dailyIncome = base * multiplier;
      const dailyCost = dailyIncome * COST_RATIO;
      return {
        day,
        income: Math.round(dailyIncome),
        revenue: Math.round(dailyIncome - dailyCost),
      };
    });

    const clientMap = {};
    data.orders.forEach((order) => {
      const email = order.customerEmail || "Guest";
      if (!clientMap[email]) {
        clientMap[email] = { name: order.customerName || "Guest User", total: 0, count: 0 };
      }
      clientMap[email].total += Number(order.total || 0);
      clientMap[email].count += 1;
    });

    const topClients = Object.entries(clientMap)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 4);

    return { financialTrend, topClients };
  }, [data.orders, data.summary.income]);

  return (
    <div className="w-full">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-light italic uppercase tracking-tighter text-white">
            Estate <span className="text-emerald-500 font-bold not-italic">Intelligence</span>
          </h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.5em] mt-2">
            Real-time performance metrics
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={14} />
            <input
              type="text"
              placeholder="SEARCH LEDGER..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-[0.2em] w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-white"
            />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 rounded-2xl active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Zap size={18} fill="currentColor" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Gross Income", value: data.summary.income, icon: DollarSign, color: "text-emerald-400" },
          { label: "Operating Cost", value: data.summary.cost, icon: Wallet, color: "text-rose-400" },
          { label: "Net Revenue", value: data.summary.revenue, icon: TrendingUp, color: "text-blue-400" },
        ].map((item, i) => (
          <div key={i} className={`${glassPanel} p-8 group`}>
            <div className="flex justify-between items-start mb-4">
              <p className={labelText}>{item.label}</p>
              <item.icon size={20} className={`${item.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-4">
              {formatCurrency(item.value)}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <ArrowUpRight size={14} className="text-emerald-500" />
              <span className="text-emerald-500">+4.2%</span> vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${glassPanel} p-8 lg:col-span-2`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/80">Profitability Matrix</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-bold uppercase text-white/40">Income</span></div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[9px] font-bold uppercase text-white/40">Revenue</span></div>
            </div>
          </div>

          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" debounce={1}>
              <AreaChart data={analytics.financialTrend}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "#01140d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={`${glassPanel} p-8 bg-emerald-500/[0.03]`}>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={18} className="text-emerald-400" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">AI Narrative</h3>
            </div>
            <p className="text-xs text-emerald-100/60 leading-relaxed font-medium">
              Estate yield is currently <span className="text-emerald-400">18.4% above benchmark</span>. 
              Optimization of logistics could increase net revenue.
            </p>
          </div>

          <div className={`${glassPanel} p-8`}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 mb-8 flex items-center gap-3">
              <Trophy size={16} className="text-yellow-500/50" />
              Portfolio Leaders
            </h3>

            <div className="space-y-6">
              {analytics.topClients.map(([email, info], i) => (
                <div key={i} className="flex justify-between items-center group cursor-default">
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{info.name}</p>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">
                      {info.count} Transactions
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-1 rounded-lg">
                    {formatCurrency(info.total)}
                  </span>
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