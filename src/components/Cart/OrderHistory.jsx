import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoArrowBack, IoCubeOutline, IoTimeOutline, 
  IoChevronDownOutline, IoTrashOutline, IoAlertCircleOutline 
} from "react-icons/io5";

const OrdersHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Configuration for currency and locale
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  /**
   * MEMOIZED DATA LOADER
   * Pulls orders from localStorage and filters by the active user's email
   */
  const loadFilteredOrders = useCallback(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    if (currentUser && currentUser.email) {
      const userEmail = currentUser.email.toLowerCase();
      const myOrders = allOrders.filter(order => 
        order.email && order.email.toLowerCase() === userEmail
      );
      // Sort by date descending (newest first)
      setOrders(myOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadFilteredOrders();
  }, [loadFilteredOrders]);

  /**
   * CANCEL ORDER LOGIC
   * Changes status to 'Cancelled' instead of deleting the record
   */
  const handleCancelOrder = (orderId) => {
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const updatedOrders = allOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'Cancelled' };
      }
      return order;
    });

    localStorage.setItem('customerOrders', JSON.stringify(updatedOrders));
    loadFilteredOrders();
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-10 pb-20 px-4 md:px-10 relative">
      
      {/* CANCEL CONFIRMATION MODAL */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/60 p-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] max-w-sm w-full text-center space-y-6 shadow-2xl">
            <IoAlertCircleOutline size={50} className="mx-auto text-red-500" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter">Cancel Harvest?</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              This will mark manifest <span className="text-white">#{orderToCancel}</span> as withdrawn.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setOrderToCancel(null)} 
                className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button 
                onClick={() => handleCancelOrder(orderToCancel)} 
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-16">
          <div 
            className="flex items-center gap-4 text-emerald-500 mb-4 cursor-pointer hover:translate-x-[-4px] transition-transform w-fit" 
            onClick={() => navigate('/products')}
          >
            <IoArrowBack /> 
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Estate</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Order <span className="text-emerald-500">History</span>
          </h1>
        </div>

        {/* ORDERS LIST / EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="text-center py-40 border border-white/5 rounded-[40px] bg-white/[0.02]">
            <IoCubeOutline size={60} className="mx-auto text-white/10 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8">No recorded harvests found</p>
            <button 
              onClick={() => navigate('/products')} 
              className="px-8 py-4 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-2xl hover:bg-white transition-all font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`group border transition-all duration-500 rounded-[32px] overflow-hidden ${
                  expandedOrder === order.id 
                    ? 'bg-white/[0.05] border-emerald-500/30 ring-1 ring-emerald-500/20' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                {/* ORDER HEADER (CLICKABLE) */}
                <div 
                  className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6" 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      <IoCubeOutline size={24} />
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-bold tracking-tight">ID: {order.id}</h4>
                      <p className="text-[9px] font-black uppercase text-white/30 flex items-center gap-2 mt-1">
                        <IoTimeOutline /> {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12">
                    <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${
                      order.status === 'Cancelled' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {order.status}
                    </span>
                    <p className="font-mono font-bold text-lg text-emerald-500">
                      {config.currency}{order.total?.toLocaleString()}
                    </p>
                    <IoChevronDownOutline 
                      className={`transition-transform duration-500 hidden md:block ${
                        expandedOrder === order.id ? 'rotate-180 text-emerald-500' : 'text-white/20'
                      }`} 
                    />
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {expandedOrder === order.id && (
                  <div className="px-8 pb-8 pt-4 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* ITEMS LIST */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Manifest Contents</p>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-white/60 font-bold uppercase group/item">
                              <span className="group-hover/item:text-white transition-colors">{item.name} <span className="text-emerald-500/50 ml-2">x{item.quantity}</span></span>
                              <span className="font-mono text-white/80">
                                {config.currency}{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* LOGISTICS & ACTIONS */}
                      <div className="bg-black/20 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase text-emerald-500 mb-3 tracking-widest">Delivery Ledger</p>
                          <p className="text-xs text-white/50 uppercase leading-relaxed font-medium">
                            <span className="text-white block mb-1">{order.customerName}</span>
                            {order.address}
                          </p>
                        </div>
                        
                        {order.status === 'Pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToCancel(order.id);
                            }} 
                            className="mt-8 w-full py-4 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            Withdraw Harvest
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

export default OrdersHistory;