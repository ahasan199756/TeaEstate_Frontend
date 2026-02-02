import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoPrintOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Mock data fetch for specific order ID
    const fetchOrderDetails = () => {
      const details = {
        id: id || "ORD-9921",
        date: "October 24, 2025",
        status: "Delivered",
        shippingAddress: "123 Misty Lane, Portland, OR 97201",
        paymentMethod: "Visa ending in 4242",
        subtotal: 76.00,
        shipping: 8.00,
        total: 84.00,
        items: [
          { id: 101, name: "Misty Mountain Green", price: 24, qty: 2, img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=200" },
          { id: 103, name: "Silver Needle White", price: 32, qty: 1, img: "https://images.unsplash.com/photo-1563911191283-d4c3822f7823?auto=format&fit=crop&q=80&w=200" }
        ]
      };
      setOrder(details);
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) return <div className="min-h-screen bg-[#062016]" />;

  return (
    <div className="min-h-screen bg-[#062016] pt-32 pb-20 px-6 lg:px-16 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/orders')} 
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400"
          >
            <IoArrowBack className="text-lg group-hover:-translate-x-1 transition-transform" /> 
            Back to History
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <IoPrintOutline size={18} /> Print Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: ITEMS & SUMMARY */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tight">Items Ordered</h2>
                <span className="text-xs font-mono text-emerald-400 font-bold">{order.id}</span>
              </div>
              
              <div className="p-8 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold uppercase text-sm tracking-wide">{item.name}</h3>
                      <p className="text-white/40 text-xs mt-1">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="p-8 bg-black/20 space-y-3">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black uppercase tracking-tighter pt-3 border-t border-white/10 text-white">
                  <span>Total Paid</span>
                  <span className="text-emerald-500">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STATUS & LOGISTICS */}
          <div className="space-y-6">
            
            {/* DELIVERY STATUS */}
            <div className="bg-emerald-500 text-black p-8 rounded-[40px] shadow-2xl shadow-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <IoTimeOutline size={24} />
                <span className="font-black uppercase text-xs tracking-[0.2em]">Status</span>
              </div>
              <h3 className="text-3xl font-black uppercase leading-none">{order.status}</h3>
              <p className="text-black/60 text-xs font-bold mt-2 uppercase tracking-widest">{order.date}</p>
            </div>

            {/* SHIPPING INFO */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <IoLocationOutline size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Delivery Address</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {order.shippingAddress}
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Payment</span>
                <p className="text-sm text-white/70 mt-1">{order.paymentMethod}</p>
              </div>

              <Link to="/products" className="block w-full text-center bg-white text-black py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-400 transition-colors">
                Order These Again
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;