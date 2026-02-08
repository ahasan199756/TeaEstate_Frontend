import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Truck, CheckCircle, Clock, XCircle, Trash2, 
  Eye, Phone, Calendar, Search, Package, CreditCard, ArrowRight,
  Filter, Download, ChevronRight
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. DATA LOGIC
  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrders(savedOrders.reverse()); // Newest first
  };

  useEffect(() => {
    fetchOrders();
    const handleUpdate = () => fetchOrders();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('orderUpdate', handleUpdate); 
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('orderUpdate', handleUpdate);
    };
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('customerOrders', JSON.stringify(updated));
    setOrders(updated);
    window.dispatchEvent(new Event('orderUpdate'));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Archiving this order will remove it from active fulfillment. Proceed?")) {
      const updated = orders.filter(order => order.id !== orderId);
      localStorage.setItem('customerOrders', JSON.stringify(updated));
      setOrders(updated);
      window.dispatchEvent(new Event('orderUpdate'));
    }
  };

  // 2. SEARCH & FILTER FEATURE
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesFilter = filter === 'All' || order.status === filter;
      const matchesSearch = 
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toString().includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchTerm]);

  // 3. STYLE PRESETS (Glassmorphism)
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]";
  const glassInput = "bg-white/40 backdrop-blur-md border border-white/60 focus:bg-white/80 transition-all";

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-1000">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Inventory Sync</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Orders <span className="text-emerald-500 font-light italic lowercase">pipeline</span>
          </h1>
        </div>

        {/* NEW FEATURE: SEARCH & FILTER BAR */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${glassInput} pl-12 pr-6 py-3.5 rounded-2xl w-full md:w-80 text-sm font-bold text-slate-700 placeholder:text-emerald-900/30 outline-none focus:ring-4 focus:ring-emerald-500/10`}
            />
          </div>
          
          <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-inner">
            {['All', 'Pending', 'Shipped', 'Delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-800/50 hover:text-emerald-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Pipeline', val: filteredOrders.length, color: 'text-emerald-600' },
          { label: 'Today Revenue', val: `৳${filteredOrders.reduce((acc, o) => acc + Number(o.total), 0).toLocaleString()}`, color: 'text-slate-900' }
        ].map((stat, i) => (
          <div key={i} className={`${glassCard} p-6 rounded-[32px] group hover:scale-[1.02] transition-transform`}>
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* GLASS TABLE */}
      <div className={`${glassCard} rounded-[40px] overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-white/40">
                <th className="px-8 py-6 text-[10px] font-black text-emerald-700 uppercase tracking-widest">Tracking Hash</th>
                <th className="px-8 py-6 text-[10px] font-black text-emerald-700 uppercase tracking-widest">Client Manifest</th>
                <th className="px-8 py-6 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-center">Logistic Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-right">Settlement</th>
                <th className="px-8 py-6 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-center">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/60 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
                      <span className="font-mono text-[12px] font-bold text-emerald-700/60">#{order.id.toString().slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{order.customerName}</p>
                    <p className="text-[10px] font-bold text-emerald-600/40">{order.date}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-slate-900 font-black text-lg italic tracking-tighter">৳{order.total}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => updateStatus(order.id, 'Shipped')} className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <Truck size={16} />
                      </button>
                      <button onClick={() => deleteOrder(order.id)} className="p-2.5 bg-white rounded-xl shadow-sm text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                    <div className="inline-block p-6 bg-white/40 rounded-full mb-4">
                      <ShoppingBag className="text-emerald-200" size={40} />
                    </div>
                    <p className="text-emerald-900/30 font-black uppercase tracking-widest text-xs">No records matching search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL - GLASS OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-emerald-950/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white animate-in zoom-in duration-300">
              <div className="p-10 border-b border-emerald-100 flex justify-between items-center bg-white/50">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Manifest <span className="text-emerald-500 italic">Audit</span></h2>
                <button onClick={() => setSelectedOrder(null)} className="p-4 bg-white/50 border border-emerald-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="p-8 bg-emerald-600 text-white rounded-[32px] shadow-xl shadow-emerald-900/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Recipient</p>
                    <h4 className="text-2xl font-black mb-1 italic">{selectedOrder.customerName}</h4>
                    <p className="text-sm font-bold opacity-80">{selectedOrder.email}</p>
                    <p className="text-xs mt-4 leading-relaxed font-medium bg-white/10 p-4 rounded-2xl">{selectedOrder.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14}/> Cargo List
                  </p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white border border-emerald-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.img} className="w-10 h-10 rounded-xl object-cover" alt="" />
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{item.name}</p>
                            <p className="text-[10px] font-bold text-emerald-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-black text-slate-900 italic">৳{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-emerald-100 flex justify-between items-end">
                    <p className="text-5xl font-black text-slate-900 tracking-tighter italic">৳{selectedOrder.total}</p>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                      Export Invoice
                    </button>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Orders;