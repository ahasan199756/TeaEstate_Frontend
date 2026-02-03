import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoArrowForward, IoBagHandle, IoReceiptOutline, IoChevronDownOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);
  const [showItems, setShowItems] = useState(false);

  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    // Retrieval Logic
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    if (orders.length > 0) {
      setLatestOrder(orders[0]); // Get the very last order placed
    } else {
      console.log("No orders found in customerOrders key.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#040d0a] flex items-center justify-center px-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />

      <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-[#040d0a] rounded-full p-4 border border-white/10">
               <IoCheckmarkCircle size={100} className="text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black uppercase tracking-tighter text-white italic leading-none">
            Harvest <span className="text-emerald-500">Secured</span>
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] max-w-sm mx-auto">
            Your premium selection has been successfully recorded in the estate ledger.
          </p>
        </div>

        {/* This card only renders if latestOrder is found */}
        {latestOrder ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 text-left space-y-8 backdrop-blur-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <IoReceiptOutline size={18} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Manifest ID</span>
              </div>
              <span className="font-mono text-white font-bold">{latestOrder.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Fulfillment</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                   <p className="text-emerald-400 text-xs font-black uppercase italic italic">Processing</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Total Investment</p>
                <p className="text-white text-3xl font-black font-mono">
                  {config.currency}{latestOrder.total?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowItems(!showItems)}
                  className="flex items-center justify-between w-full text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors"
                >
                  View Harvest Details 
                  <IoChevronDownOutline className={`transition-transform duration-500 ${showItems ? 'rotate-180' : ''}`} size={16}/>
                </button>
                
                {showItems && (
                  <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-500">
                    {latestOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-white/60 font-bold uppercase">{item.name} x{item.quantity}</span>
                        <span className="text-white/40 font-mono">{config.currency}{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="p-10 border border-white/5 rounded-[40px] text-white/20 uppercase font-black text-xs tracking-widest">
            Fetching Ledger Details...
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={() => navigate('/orders')} className="flex-1 py-6 bg-white/5 border border-white/10 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <IoBagHandle size={18} className="text-emerald-500" /> Track Shipment
          </button>
          <button onClick={() => navigate('/products')} className="flex-1 py-6 bg-emerald-500 text-black rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-2">
            Return to Estate <IoArrowForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;