import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Search, Download, 
  Filter, CreditCard, ArrowRight, CheckCircle2, Clock, 
  AlertCircle, DollarSign, Wallet, Receipt
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");

  // 1. DATA INITIALIZATION
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    const formatted = orders.map(order => ({
      id: order.id.toString().replace('ORD', 'TXN'),
      orderRef: order.id,
      date: order.date,
      amount: Number(order.total) || 0,
      status: order.status === 'Delivered' ? 'Completed' : 'Pending',
      method: order.paymentMethod || "Digital Gateway",
      customer: order.customerName || "Verified Guest"
    })).reverse(); // Newest first

    setTransactions(formatted);
  }, []);

  // 2. FILTERING LOGIC
  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' || t.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filter]);

  // 3. FINANCIAL SUMMARY CALCULATIONS
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completed = transactions
      .filter(t => t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
    return { total, completed, count: transactions.length };
  }, [transactions]);

  // 4. DESIGN TOKENS
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]";
  const glassInput = "bg-white/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all outline-none shadow-inner";

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Financial Ledger</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Payment <span className="text-emerald-500 font-light italic lowercase tracking-normal">Audit</span>
          </h1>
        </div>

        <button className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95">
          <Download size={18} /> Export Settlement
        </button>
      </header>

      {/* --- QUICK STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${glassCard} p-8 rounded-[40px] flex items-center gap-6`}>
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">৳{stats.total.toLocaleString()}</h3>
          </div>
        </div>
        <div className={`${glassCard} p-8 rounded-[40px] flex items-center gap-6`}>
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settled Funds</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">৳{stats.completed.toLocaleString()}</h3>
          </div>
        </div>
        <div className={`${glassCard} p-8 rounded-[40px] flex items-center gap-6`}>
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stats.count} <span className="text-sm uppercase not-italic text-slate-400">Txns</span></h3>
          </div>
        </div>
      </div>

      {/* --- SEARCH & CONTROL BAR --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search TXN Hash or Customer Name..."
            className={`${glassInput} w-full rounded-2xl py-5 pl-14 pr-6 text-slate-900 text-[11px] font-black tracking-widest uppercase placeholder:text-slate-300`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl p-1.5 shadow-inner">
          {['All', 'Completed', 'Pending'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === opt 
                  ? 'bg-white text-slate-900 shadow-md translate-y-[-1px]' 
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* --- TRANSACTION TABLE --- */}
      <div className={`${glassCard} rounded-[40px] overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-8 text-[10px] font-black uppercase text-emerald-600 tracking-widest border-b border-slate-100">TXN Identity</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Counterparty</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Settlement Date</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-right">Value</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTxns.length > 0 ? filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-white/80 transition-all group">
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-mono text-sm font-black group-hover:text-emerald-600 transition-colors uppercase">
                        #{txn.id.slice(-10)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Ref: {txn.orderRef}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-black text-[13px] uppercase tracking-tight italic">{txn.customer}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-widest">{txn.method}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-slate-600 text-xs font-bold font-mono tracking-tight">{txn.date}</span>
                  </td>
                  <td className="p-8 text-right">
                    <span className="text-slate-900 font-black text-lg italic tracking-tighter">৳{txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      {txn.status === 'Completed' ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                          <CheckCircle2 size={14} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Settled</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-5 py-2 rounded-full border border-amber-100 animate-pulse">
                          <Clock size={14} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Escrow</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-40 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <AlertCircle size={64} className="mb-4 text-slate-900" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Transactional Records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;