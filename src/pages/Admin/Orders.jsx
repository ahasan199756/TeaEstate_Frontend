import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock, XCircle, Trash2, Eye, MapPin, Phone, Mail } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Fetch data and calculate totals
  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrders(savedOrders);
  };

  useEffect(() => {
    fetchOrders();
    // Listen for storage changes (other tabs) and custom updates (this tab)
    window.addEventListener('storage', fetchOrders);
    window.addEventListener('orderUpdate', fetchOrders); 
    
    return () => {
      window.removeEventListener('storage', fetchOrders);
      window.removeEventListener('orderUpdate', fetchOrders);
    };
  }, []);

  // 2. Enhanced Update Status with Event Trigger
  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('customerOrders', JSON.stringify(updated));
    
    // Trigger sidebar badge refresh
    window.dispatchEvent(new Event('orderUpdate'));
  };

  // 3. Enhanced Delete with Event Trigger
  const deleteOrder = (orderId) => {
    if (window.confirm("Permanently delete this order record?")) {
      const updated = orders.filter(order => order.id !== orderId);
      setOrders(updated);
      localStorage.setItem('customerOrders', JSON.stringify(updated));
      
      // Trigger sidebar badge refresh
      window.dispatchEvent(new Event('orderUpdate'));
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <ShoppingBag className="text-emerald-500" size={36} /> Fulfillment
          </h1>
          <p className="text-emerald-500/60 font-medium mt-1 uppercase text-[10px] tracking-widest">
            {orders.length} Global Transactions Found
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* TABLE SECTION */}
      <div className="bg-[#050505] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">
                <th className="p-6">Order Hash</th>
                <th className="p-6">Client</th>
                <th className="p-6">Payload</th>
                <th className="p-6">Revenue</th>
                <th className="p-6">Logistic Status</th>
                <th className="p-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 font-mono text-[10px] text-emerald-500/50">{order.id}</td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{order.customerName}</span>
                      <span className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">{order.date}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white/60 text-[10px] font-black bg-white/5 px-3 py-1 rounded-full uppercase">
                      {order.items?.length || 0} Units
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-emerald-400 font-black font-mono text-lg">৳{order.total}</span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                      order.status === 'Shipped' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                      order.status === 'Cancelled' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-orange-500/30 text-orange-500 bg-orange-500/5 animate-pulse'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => updateStatus(order.id, 'Shipped')} className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all">
                        <Truck size={16} />
                      </button>
                      <button onClick={() => updateStatus(order.id, 'Delivered')} className="p-2.5 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 rounded-xl transition-all">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => deleteOrder(order.id)} className="p-2.5 bg-white/5 hover:bg-red-600/20 text-white/10 hover:text-red-600 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-32 text-center">
                    <Clock size={48} className="mx-auto text-white/5 mb-4" />
                    <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Zero Orders in Pipeline</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION - Remains Same */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#000]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           {/* ... Modal Content from your previous code ... */}
           <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl relative">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full text-white/40 transition-all z-10"
              >
                <XCircle size={20} />
              </button>
              
              <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                <h2 className="text-2xl font-black text-white uppercase italic">Order <span className="text-emerald-500">Manifest</span></h2>
                <p className="text-white/20 font-mono text-[10px] mt-1 tracking-widest">{selectedOrder.id}</p>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Client Detail</p>
                    <p className="text-white font-bold">{selectedOrder.customerName}</p>
                    <p className="text-white/40 text-xs mt-1">{selectedOrder.email}</p>
                    <p className="text-white/40 text-xs flex items-center gap-2 mt-2"><Phone size={10}/> {selectedOrder.phone}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Logistics</p>
                    <p className="text-white/60 text-xs leading-relaxed">{selectedOrder.address}</p>
                    <p className="text-emerald-500/50 text-[10px] font-black uppercase mt-4">Method: {selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Cargo Audit</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <img src={item.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="text-white text-[11px] font-black uppercase">{item.name}</p>
                          <p className="text-white/30 text-[9px] font-bold">QTY: {item.quantity} units</p>
                        </div>
                      </div>
                      <p className="text-emerald-400 font-mono font-bold text-sm">৳{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-emerald-500/5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Settlement Amount</span>
                <span className="text-4xl font-black text-emerald-500 font-mono tracking-tighter">৳{selectedOrder.total}</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Orders;