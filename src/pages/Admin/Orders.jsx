import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Truck, CheckCircle, Clock, XCircle, Trash2, 
  Eye, Package, Search, ChevronRight, Download, Box,
  BarChart3, Hash, User, Activity
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Burnham Palette & UI Constants
  const colors = {
    burnham: '#013221',
    emerald: '#10b981',
    border: 'rgba(16, 185, 129, 0.1)',
    card: 'rgba(1, 50, 33, 0.4)'
  };

  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrders(savedOrders.reverse());
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
    if (window.confirm("Archive this record?")) {
      const updated = orders.filter(order => order.id !== orderId);
      localStorage.setItem('customerOrders', JSON.stringify(updated));
      setOrders(updated);
      window.dispatchEvent(new Event('orderUpdate'));
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesFilter = filter === 'All' || order.status === filter;
      const matchesSearch = 
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toString().includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchTerm]);

  // Styles
  const cardStyle = "bg-[#013221]/20 backdrop-blur-md border border-emerald-500/10 rounded-3xl p-6 transition-all duration-300 hover:border-emerald-500/30";
  const glassInput = "bg-black/40 border border-emerald-900/50 focus:border-emerald-500 rounded-2xl px-12 py-3 text-sm text-white placeholder:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all w-full";

  return (
    <div className="min-h-screen bg-[#010c09] text-emerald-50 p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* TOP NAVIGATION & HUD */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/60">Logistics Command</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              COMMAND <span className="text-emerald-500 italic font-light">center</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" size={18} />
                <input 
                  type="text" 
                  placeholder="Scan Track ID / Name..." 
                  className={glassInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex bg-black/40 p-1.5 rounded-2xl border border-emerald-950">
                {['All', 'Pending', 'Shipped', 'Delivered'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-emerald-600 text-black' : 'text-emerald-700 hover:text-emerald-400'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Global Throughput" value={filteredOrders.length} icon={<Activity size={20}/>} trend="+12%" />
          <MetricCard 
            label="Gross Revenue" 
            value={`৳${filteredOrders.reduce((acc, o) => acc + Number(o.total), 0).toLocaleString()}`} 
            icon={<BarChart3 size={20}/>} 
            trend="Live" 
          />
          <MetricCard label="Active Manifests" value={orders.filter(o => o.status !== 'Delivered').length} icon={<Box size={20}/>} />
        </div>

        {/* MAIN DATA TABLE */}
        <div className="bg-black/20 border border-emerald-900/30 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-900/30 bg-emerald-950/20">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/50">Tracking Hash</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/50">Consignee</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-center text-emerald-500/50">Current Phase</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-right text-emerald-500/50">Net Value</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-center text-emerald-500/50">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-500/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                         <Hash size={14} className="text-emerald-800" />
                         <span className="font-mono text-sm text-emerald-400">{(order.id || '0000').toString().slice(-8).toUpperCase()}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                           <User size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm uppercase">{order.customerName}</p>
                          <p className="text-[10px] text-emerald-700 font-medium">{order.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-8 py-6 text-right font-black text-white italic">৳{order.total}</td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-2">
                        <ActionButton icon={<Eye size={16}/>} onClick={() => setSelectedOrder(order)} color="emerald" />
                        <ActionButton icon={<Truck size={16}/>} onClick={() => updateStatus(order.id, 'Shipped')} color="blue" />
                        <ActionButton icon={<Trash2 size={16}/>} onClick={() => deleteOrder(order.id)} color="rose" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL SYSTEM */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-[#010c09]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <div className="bg-[#013221] border border-emerald-500/30 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
                <div className="p-10 border-b border-emerald-900/50 flex justify-between items-center bg-black/20">
                   <div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter">Manifest <span className="text-emerald-500 italic">Audit</span></h2>
                     <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest mt-1">Order Ref: {selectedOrder.id}</p>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:scale-110 transition-transform">
                      <XCircle size={24} />
                   </button>
                </div>
                
                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <section className="bg-black/30 p-8 rounded-[2rem] border border-emerald-900/30">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 block">Shipping Destination</label>
                        <h4 className="text-2xl font-black mb-1">{selectedOrder.customerName}</h4>
                        <p className="text-emerald-400/60 text-sm mb-4">{selectedOrder.email}</p>
                        <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-900/50 text-sm italic">
                          {selectedOrder.address}
                        </div>
                      </section>
                   </div>

                   <div className="space-y-6">
                      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <Package size={14}/> Inventory Breakdown
                      </label>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-emerald-900/20 hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <img src={item.img} className="w-12 h-12 rounded-xl object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                              <div>
                                <p className="text-xs font-black uppercase">{item.name}</p>
                                <p className="text-[10px] font-bold text-emerald-600">Unit Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-bold text-white italic">৳{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-6 border-t border-emerald-900 flex justify-between items-center">
                         <div>
                            <p className="text-[10px] uppercase font-bold text-emerald-700">Total Settlement</p>
                            <p className="text-4xl font-black italic text-white">৳{selectedOrder.total}</p>
                         </div>
                         <button className="flex items-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors">
                            <Download size={16} /> Print Invoice
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// UI Sub-components
const MetricCard = ({ label, value, icon, trend }) => (
  <div className="bg-[#013221]/20 border border-emerald-500/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
        {icon}
      </div>
      {trend && <span className="text-[10px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg">{trend}</span>}
    </div>
    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };
  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
      {status || 'Pending'}
    </span>
  );
};

const ActionButton = ({ icon, onClick, color }) => {
  const colors = {
    emerald: 'bg-emerald-500 hover:bg-white',
    blue: 'bg-blue-500 hover:bg-white',
    rose: 'bg-rose-500 hover:bg-white'
  };
  return (
    <button onClick={onClick} className={`p-3 rounded-xl text-black transition-all hover:-translate-y-1 active:scale-95 ${colors[color]}`}>
      {icon}
    </button>
  );
};

export default Orders;