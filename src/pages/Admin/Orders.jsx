import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock, XCircle, Trash2, Eye, MapPin, Phone, Mail } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Fetch data using the 'customerOrders' key from Checkout
  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    // Sorting by date - since your date is 'en-GB' string, we parse it or use ID (which is timestamp-based)
    setOrders(savedOrders);
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener('storage', fetchOrders);
    return () => window.removeEventListener('storage', fetchOrders);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('customerOrders', JSON.stringify(updated));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Permanentally delete this order record?")) {
      const updated = orders.filter(order => order.id !== orderId);
      setOrders(updated);
      localStorage.setItem('customerOrders', JSON.stringify(updated));
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8">
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
                filter === tab ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl">
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
                <td className="p-6 font-mono text-xs text-emerald-500/50">{order.id}</td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{order.customerName}</span>
                    <span className="text-[10px] text-white/40 font-mono uppercase">{order.date}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-white/60 text-xs font-bold uppercase">{order.items?.length || 0} Units</span>
                </td>
                <td className="p-6">
                  <span className="text-emerald-400 font-black font-mono text-lg">৳{order.total}</span>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                    order.status === 'Shipped' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                    order.status === 'Cancelled' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-orange-500/30 text-orange-500 bg-orange-500/5'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all" title="View Payload">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => updateStatus(order.id, 'Shipped')} className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all">
                      <Truck size={18} />
                    </button>
                    <button onClick={() => updateStatus(order.id, 'Delivered')} className="p-2.5 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 rounded-xl transition-all">
                      <CheckCircle size={18} />
                    </button>
                    <button onClick={() => updateStatus(order.id, 'Cancelled')} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl transition-all">
                      <XCircle size={18} />
                    </button>
                    <button onClick={() => deleteOrder(order.id)} className="p-2.5 bg-white/5 hover:bg-red-600/20 text-white/10 hover:text-red-600 rounded-xl transition-all">
                      <Trash2 size={18} />
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

      {/* DETAILED INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#040d0a]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic">Order <span className="text-emerald-500">Manifest</span></h2>
                <p className="text-white/40 font-mono text-xs mt-1">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Customer Intel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Mail size={12}/> Contact</p>
                  <p className="text-white font-bold">{selectedOrder.customerName}</p>
                  <p className="text-white/40 text-sm">{selectedOrder.email}</p>
                  <p className="text-white/40 text-sm flex items-center gap-2"><Phone size={12}/> {selectedOrder.phone || 'N/A'}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Logistics</p>
                  <p className="text-white text-sm leading-relaxed">{selectedOrder.address}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase">Payment: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Items Audit</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <img src={item.img} className="w-12 h-12 rounded-xl object-cover bg-white/5" alt="" />
                      <div>
                        <p className="text-white text-xs font-black uppercase">{item.name}</p>
                        <p className="text-white/30 text-[10px] font-bold">QTY: {item.quantity} × ৳{item.price}</p>
                      </div>
                    </div>
                    <p className="text-emerald-400 font-mono font-bold text-sm">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Total Revenue</span>
              <span className="text-4xl font-black text-emerald-500 font-mono tracking-tighter">৳{selectedOrder.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;