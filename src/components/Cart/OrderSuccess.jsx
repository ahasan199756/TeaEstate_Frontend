import React, { useEffect, useState } from 'react';
import { 
  IoCheckmarkCircle, 
  IoArrowForward, 
  IoBagHandleOutline, 
  IoPrintOutline,
  IoShieldCheckmarkOutline,
  IoLocationOutline,
  IoCalendarOutline
} from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');

    if (currentUser?.email) {
      const userEmail = currentUser.email.toLowerCase();
      const userOrders = allOrders.filter(order => 
        order.email?.toLowerCase() === userEmail
      );
      if (userOrders.length > 0) setLatestOrder(userOrders[0]);
    }
  }, []);

  if (!latestOrder) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* COMPACT SUCCESS HEADER (Hidden on Print) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <IoCheckmarkCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Confirmed</h1>
              <p className="text-slate-500 text-sm font-medium">Thank you, {latestOrder.customerName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
              <IoPrintOutline size={16}/> Print Invoice
            </button>
            <button onClick={() => navigate('/products')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
              Shop More <IoArrowForward />
            </button>
          </div>
        </div>

        {/* MAIN INVOICE CARD (The "One Page" Content) */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col lg:flex-row print:border-none print:shadow-none">
          
          {/* LEFT: INVOICE DETAILS */}
          <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Invoice Details</p>
                <h2 className="text-xl font-bold text-slate-900">Order #{latestOrder.id}</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <IoCalendarOutline /> {latestOrder.date}
                </div>
              </div>
            </div>

            {/* PRODUCT TABLE (No Expand Button, Always Visible) */}
            <div className="space-y-6 mb-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 pb-2">Manifest Breakdown</p>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none">
                {latestOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <img src={item.img} className="w-10 h-10 rounded-lg object-cover grayscale" alt="" />
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Unit Price: {config.currency}{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-900">x{item.quantity}</p>
                      <p className="text-[11px] font-mono text-emerald-600 font-bold">{config.currency}{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGISTICS GRID */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <IoLocationOutline size={14}/>
                  <span className="text-[9px] font-black uppercase tracking-widest">Delivery</span>
                </div>
                <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-tighter">
                  {latestOrder.address}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <IoShieldCheckmarkOutline size={14}/>
                  <span className="text-[9px] font-black uppercase tracking-widest">Method</span>
                </div>
                <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-tighter">
                  {latestOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: FINANCIAL SUMMARY */}
          <div className="w-full lg:w-[320px] bg-slate-50 p-8 md:p-10 flex flex-col justify-between print:bg-white print:border-t print:border-slate-200">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Summary</h3>
              
              <div className="space-y-4 mb-10 text-xs font-medium border-b border-slate-200 pb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{config.currency}{Number(latestOrder.subtotal).toLocaleString()}</span>
                </div>
                {latestOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{config.currency}{Number(latestOrder.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-slate-900">{config.currency}{Number(latestOrder.shipping).toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Total Amount Paid</span>
                <p className="text-4xl font-black font-mono text-slate-900 tracking-tighter">
                  <span className="text-emerald-500 text-xl mr-1 font-sans italic">{config.currency}</span>
                  {Number(latestOrder.total).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4 print:hidden">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <IoBagHandleOutline size={16}/>
                 </div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Your package will be delivered in 2-3 days.</p>
              </div>
            </div>
            
            {/* INVOICE FOOTER (Print Only) */}
            <div className="hidden print:block mt-auto pt-10 text-[8px] text-slate-400 uppercase font-bold text-center italic">
              Thank you for your business. This is a computer generated invoice.
            </div>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 print:hidden">
          Confirmation sent to {latestOrder.email}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;