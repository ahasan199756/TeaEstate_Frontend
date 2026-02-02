import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle, Clock } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Load real orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('teaOrders') || '[]');
    setOrders(savedOrders);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('teaOrders', JSON.stringify(updated));
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <ShoppingBag className="text-emerald-500" size={36} /> Fulfillment
          </h1>
          <p className="text-emerald-500/60 font-medium mt-1">Manage customer orders and shipping logistics.</p>
        </div>

        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['All', 'Pending', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* ORDERS TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Order ID</th>
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Customer</th>
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Items</th>
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Total</th>
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-white/40 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <span className="text-white font-mono text-xs">#{order.id.toString().slice(-6)}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{order.customerName || 'Guest User'}</span>
                      <span className="text-[10px] text-white/40 font-mono">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white/60 text-sm">{order.items?.length || 0} Products</span>
                  </td>
                  <td className="p-6">
                    <span className="text-emerald-400 font-black font-mono text-lg">৳{order.totalAmount}</span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateStatus(order.id, 'Shipped')}
                        className="p-3 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all"
                        title="Mark as Shipped"
                      >
                        <Truck size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'Delivered')}
                        className="p-3 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 rounded-xl transition-all"
                        title="Mark as Delivered"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <Clock size={48} className="mx-auto text-white/10 mb-4" />
                    <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No orders found in queue</p>
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

export default Orders;