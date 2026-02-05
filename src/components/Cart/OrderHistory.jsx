import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoArrowBack, IoCubeOutline, IoTimeOutline, 
  IoChevronDownOutline, IoTrashOutline, IoAlertCircleOutline 
} from "react-icons/io5";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    loadFilteredOrders();
  }, []);

  const loadFilteredOrders = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    if (currentUser && currentUser.email) {
      const userEmail = currentUser.email.toLowerCase();
      // Only show orders belonging to the logged-in user
      const myOrders = allOrders.filter(order => 
        order.email && order.email.toLowerCase() === userEmail
      );
      setOrders(myOrders);
    } else {
      setOrders([]); // No user logged in, no orders shown
    }
  };

  const handleCancelOrder = (id) => {
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const updated = allOrders.filter(order => order.id !== id);
    localStorage.setItem('customerOrders', JSON.stringify(updated));
    loadFilteredOrders(); // Refresh the list
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-32 pb-20 px-6 lg:px-16 relative">
      {/* CANCEL MODAL */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/60 p-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] max-w-sm w-full text-center space-y-6 shadow-2xl">
            <IoAlertCircleOutline size={50} className="mx-auto text-red-500" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter">Cancel Harvest?</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">This will remove manifest {orderToCancel} from the ledger.</p>
            <div className="flex gap-4">
              <button onClick={() => setOrderToCancel(null)} className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase">Back</button>
              <button onClick={() => handleCancelOrder(orderToCancel)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-4 text-emerald-500 mb-4 cursor-pointer" onClick={() => navigate('/products')}>
            <IoArrowBack /> <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Estate</span>
          </div>
          <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Order <span className="text-emerald-500">History</span></h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-40 border border-white/5 rounded-[40px] bg-white/[0.02]">
            <IoCubeOutline size={60} className="mx-auto text-white/10 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8">No recorded harvests found</p>
            <button onClick={() => navigate('/products')} className="px-8 py-4 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-2xl hover:bg-white transition-all">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className={`group border transition-all duration-500 rounded-[32px] overflow-hidden ${expandedOrder === order.id ? 'bg-white/[0.05] border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><IoCubeOutline size={24} /></div>
                    <div>
                      <h4 className="font-mono text-sm font-bold">{order.id}</h4>
                      <p className="text-[9px] font-black uppercase text-white/30 flex items-center gap-2 mt-1"><IoTimeOutline /> {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{order.status}</span>
                    <p className="font-mono font-bold text-lg text-emerald-500">{config.currency}{order.total?.toLocaleString()}</p>
                    <IoChevronDownOutline className={`transition-transform duration-500 ${expandedOrder === order.id ? 'rotate-180 text-emerald-500' : ''}`} />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-8 pb-8 pt-4 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs text-white/60 font-bold uppercase">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-mono">{config.currency}{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-black/20 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase text-emerald-500 mb-2">Logistics</p>
                          <p className="text-xs text-white/40 uppercase tracking-tighter">{order.customerName}<br/>{order.address}</p>
                        </div>
                        {order.status === 'Pending' && (
                          <button onClick={() => setOrderToCancel(order.id)} className="mt-6 w-full py-4 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/5 transition-all">Withdraw Harvest</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;