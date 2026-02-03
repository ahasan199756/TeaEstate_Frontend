import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoArrowBack, 
  IoCubeOutline, 
  IoTimeOutline, 
  IoChevronDownOutline, 
  IoCheckmarkCircle, 
  IoSearchOutline,
  IoTrashOutline,
  IoAlertCircleOutline
} from "react-icons/io5";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null); // For the modal

  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrders(savedOrders);
  };

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const handleCancelOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    localStorage.setItem('customerOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-32 pb-20 px-6 lg:px-16 relative overflow-hidden">
      
      {/* 1. CANCEL CONFIRMATION MODAL */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] max-w-sm w-full text-center space-y-6 shadow-2xl">
            <IoAlertCircleOutline size={50} className="mx-auto text-red-500" />
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Cancel Harvest?</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">This action will remove the manifest {orderToCancel} from the ledger permanently.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={() => handleCancelOrder(orderToCancel)}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAGE CONTENT */}
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 text-emerald-500 mb-4 cursor-pointer hover:gap-6 transition-all" onClick={() => navigate('/products')}>
              <IoArrowBack /> <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Estate</span>
            </div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">Order <span className="text-emerald-500">History</span></h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-40 border border-white/5 rounded-[40px] bg-white/[0.02]">
            <IoCubeOutline size={60} className="mx-auto text-white/10 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">No recorded harvests found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`group border transition-all duration-500 rounded-[32px] overflow-hidden ${
                  expandedOrder === order.id ? 'bg-white/[0.05] border-emerald-500/30 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                {/* Order Summary Row */}
                <div 
                  className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                      <IoCubeOutline size={24} />
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-bold">{order.id}</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1 flex items-center gap-2">
                        <IoTimeOutline /> {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Status</p>
                      <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Value</p>
                      <p className="font-mono font-bold text-lg text-emerald-500">{config.currency}{order.total?.toLocaleString()}</p>
                    </div>
                    <IoChevronDownOutline 
                      className={`transition-transform duration-500 text-white/20 ${expandedOrder === order.id ? 'rotate-180 text-emerald-500' : ''}`} 
                      size={20} 
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="px-8 pb-8 pt-4 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Manifest Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center group/item">
                            <div className="flex items-center gap-4">
                              <img src={item.img} className="w-10 h-10 rounded-lg object-cover grayscale" alt="" />
                              <span className="text-xs font-bold text-white/60">{item.name} <span className="text-emerald-500/40 ml-2">x{item.quantity}</span></span>
                            </div>
                            <span className="font-mono text-xs text-white/40">{config.currency}{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-8">
                        <div className="bg-black/20 rounded-3xl p-6 border border-white/5">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Logistics</p>
                          <p className="text-xs text-white/60 font-medium leading-relaxed uppercase tracking-tighter">
                            {order.customerName}<br />
                            {order.address}
                          </p>
                        </div>
                        
                        {/* CANCEL BUTTON - Only show if Pending */}
                        {order.status === 'Pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToCancel(order.id);
                            }}
                            className="w-full py-4 border border-red-500/20 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                          >
                            <IoTrashOutline size={14} /> Withdraw Harvest
                          </button>
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