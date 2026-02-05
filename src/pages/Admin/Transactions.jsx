import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Search, Download, 
  Filter, CreditCard, ArrowRight, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Merging our customer orders into a flat transaction list
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    // Map orders to a transaction format
    const formatted = orders.map(order => ({
      id: order.id.replace('ORD', 'TXN'),
      orderRef: order.id,
      date: order.date,
      amount: order.total,
      status: order.status === 'Delivered' ? 'Completed' : 'Pending',
      method: "Online Payment",
      customer: order.customerName || "Verified Guest"
    }));

    setTransactions(formatted);
  }, []);

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Payment <span className="text-emerald-500">Transactions</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
            Audit trail of all estate commerce
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
          <Download size={16} /> Export CSV
        </button>
      </header>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or Customer..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-emerald-500 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
          {['All', 'Completed', 'Pending'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === opt ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-8 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Transaction ID</th>
              <th className="p-8 text-[10px] font-black uppercase text-white/40 tracking-widest">Customer</th>
              <th className="p-8 text-[10px] font-black uppercase text-white/40 tracking-widest">Date</th>
              <th className="p-8 text-[10px] font-black uppercase text-white/40 tracking-widest text-right">Amount</th>
              <th className="p-8 text-[10px] font-black uppercase text-white/40 tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTxns.map((txn) => (
              <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-8">
                  <div className="flex flex-col">
                    <span className="text-white font-mono text-sm font-bold">{txn.id}</span>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">Ref: {txn.orderRef}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-white font-bold text-sm uppercase">{txn.customer}</span>
                </td>
                <td className="p-8">
                  <span className="text-white/60 text-xs font-medium">{txn.date}</span>
                </td>
                <td className="p-8 text-right">
                  <span className="text-emerald-500 font-mono font-black text-lg">৳{txn.amount.toFixed(2)}</span>
                </td>
                <td className="p-8">
                  <div className="flex justify-center">
                    {txn.status === 'Completed' ? (
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Successful</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-400 bg-orange-400/10 px-4 py-1.5 rounded-full border border-orange-400/20">
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">In Process</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTxns.length === 0 && (
          <div className="p-20 text-center">
            <AlertCircle size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 uppercase text-xs font-black tracking-widest">No matching records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;