import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoArrowForward, IoBagHandle, IoReceiptOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    // Retrieve the most recent order from the shared storage
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    if (orders.length > 0) {
      setLatestOrder(orders[0]); // Most orders are unshifted to the front
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#062016] flex items-center justify-center px-6 selection:bg-emerald-500">
      <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in duration-700">
        
        {/* Success Icon with Glow */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
            <IoCheckmarkCircle size={120} className="text-emerald-500 relative z-10" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
            Order <span className="text-emerald-500">Placed</span>
          </h1>
          <p className="text-white/40 font-medium max-w-sm mx-auto">
            Your premium tea selection has been recorded. An email confirmation is on its way to your inbox.
          </p>
        </div>

        {/* Order Info Card */}
        {latestOrder && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-left space-y-6 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <IoReceiptOutline className="text-emerald-500" size={20} />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Transaction ID</span>
              </div>
              <span className="font-mono text-white font-bold">{latestOrder.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Status</p>
                <p className="text-emerald-400 text-sm font-bold uppercase mt-1">Confirmed</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Total Paid</p>
                <p className="text-white text-xl font-black mt-1">
                  {latestOrder.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
          >
            <IoBagHandle size={20} className="text-white/40 group-hover:text-white" /> 
            Track Order
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10"
          >
            Continue Shopping <IoArrowForward size={18} />
          </button>
        </div>

        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
          Thank you for choosing Estate Tea Co.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;