import React, { useEffect, useState } from 'react';
import { 
  IoCheckmarkCircle, 
  IoArrowForward, 
  IoBagHandleOutline, 
  IoReceiptOutline, 
  IoChevronDownOutline,
  IoShieldCheckmarkOutline,
  IoTimerOutline,
  IoSparkles
} from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    // Scroll to top on entry
    window.scrollTo(0, 0);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');

    if (currentUser && currentUser.email) {
      const userEmail = currentUser.email.toLowerCase();
      const userOrders = allOrders.filter(order => 
        order.email && order.email.toLowerCase() === userEmail
      );
      // userOrders[0] is the most recent order because we unshift new orders in Checkout
      if (userOrders.length > 0) setLatestOrder(userOrders[0]);
    }
  }, []);

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
        <div className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">
          Authenticating Manifest...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040d0a] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full relative z-10">
        
        {/* SUCCESS HEADER */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center relative">
            <div className="relative z-10 p-5 bg-emerald-500 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.4)] animate-bounce-slow">
              <IoCheckmarkCircle size={60} className="text-black" />
            </div>
            <IoSparkles className="absolute top-0 right-1/3 text-emerald-400 animate-ping" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white italic leading-none">
              Harvest <br />
              <span className="text-emerald-500">Secured.</span>
            </h1>
            <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">
              Order #{latestOrder.id} • Confirmed & Logged
            </p>
          </div>
        </div>

        {/* LOGISTICS STEPS */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: <IoReceiptOutline />, label: 'Confirmed' },
            { icon: <IoTimerOutline />, label: 'Processing' },
            { icon: <IoBagHandleOutline />, label: 'Shipping' }
          ].map((step, i) => (
            <div key={i} className={`flex flex-col items-center gap-3 p-4 rounded-3xl border ${i === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
              <div className={`${i === 0 ? 'text-emerald-500' : 'text-white/20'}`}>{step.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${i === 0 ? 'text-emerald-500' : 'text-white/20'}`}>{step.label}</span>
            </div>
          ))}
        </div>

        {/* ORDER CARD */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="p-8 md:p-12 space-y-10">
            
            {/* Total Section */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Total Value</span>
                <p className="text-white/60 text-xs font-bold uppercase">{latestOrder.items?.length} Items Handpicked</p>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black font-mono text-white tracking-tighter">
                  <span className="text-emerald-500 text-2xl mr-1 italic">{config.currency}</span>
                  {Number(latestOrder.total || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Expandable Items */}
            <div className="pt-8 border-t border-white/5">
              <button 
                onClick={() => setShowItems(!showItems)} 
                className="flex items-center justify-between w-full group transition-all"
              >
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] group-hover:gap-4 flex items-center gap-2">
                   Manifest Breakdown <IoChevronDownOutline className={`transition-transform duration-500 ${showItems ? 'rotate-180' : ''}`} />
                </span>
              </button>

              <div className={`transition-all duration-700 overflow-hidden ${showItems ? 'max-h-[500px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-6">
                  {latestOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-[20px] border border-white/5">
                      <img src={item.img} className="w-12 h-12 rounded-lg object-cover grayscale" alt="" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-white/80 tracking-wide">{item.name}</p>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-white/60">
                        {config.currency}{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
              <div>
                <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em] block mb-2">Deliver To</span>
                <p className="text-[11px] text-white/60 font-black uppercase leading-relaxed tracking-tighter">{latestOrder.address}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em] block mb-2">Payment</span>
                <p className="text-[11px] text-white/60 font-black uppercase tracking-tighter">
                  {latestOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Verified Electronic'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="bg-emerald-500 p-4 flex items-center justify-center gap-2">
            <IoShieldCheckmarkOutline className="text-black" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black">Authentic Estate Manifest Signed</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => navigate('/orders')} 
            className="flex-1 py-6 bg-white/5 border border-white/10 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all group"
          >
            Track History <IoArrowForward className="inline ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/products')} 
            className="flex-1 py-6 bg-white text-black rounded-[24px] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-emerald-500 transition-all shadow-xl"
          >
            Back to Estate
          </button>
        </div>

        <p className="text-center mt-12 text-white/10 text-[8px] font-black uppercase tracking-[0.5em]">
          A confirmation email has been dispatched to {latestOrder.email}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;