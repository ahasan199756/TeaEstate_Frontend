import React, { useState } from 'react';
import { useCart } from "./CartContext";
import { IoArrowBack, IoShieldCheckmarkOutline, IoLocateOutline, IoCardOutline, IoWalletOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳', shippingFee: 50 };
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'card'
  });

  const total = subtotal + Number(config.shippingFee);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Create the detailed order object
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      customerName: formData.name,
      email: formData.email,
      items: [...cart], // Deep copy of cart
      total: total,
      status: 'Pending',
      address: `${formData.address}, ${formData.city}`,
      paymentMethod: formData.paymentMethod
    };

    // 2. Save to LocalStorage
    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    localStorage.setItem('customerOrders', JSON.stringify([newOrder, ...existingOrders]));

    // 3. Clear and Navigate
    clearCart();
    setTimeout(() => {
      navigate('/order-success');
    }, 100);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex flex-col items-center justify-center p-10 text-center text-white">
        <IoCardOutline size={60} className="text-emerald-500/20 mb-6" />
        <h2 className="text-4xl font-black uppercase mb-6">Bag is empty</h2>
        <button onClick={() => navigate('/products')} className="text-emerald-400 font-bold flex items-center gap-2">
          <IoArrowBack /> Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-32 pb-20 px-6 lg:px-16 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-4 text-emerald-500 mb-4 cursor-pointer" onClick={() => navigate('/cart')}>
            <IoArrowBack /> <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Bag</span>
          </div>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">Finalize <span className="text-emerald-500">Order</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl">
                <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-emerald-500">
                  <IoLocateOutline size={20}/> Shipping Logistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500" placeholder="Full Name" />
                  <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500" placeholder="Email Address" />
                </div>
                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-6">
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500" placeholder="City" />
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500" placeholder="Phone Number" />
                </div>
              </section>

              <section className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl">
                <h3 className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-emerald-500">
                  <IoWalletOutline size={20}/> Transaction Gateway
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`p-6 rounded-[24px] border cursor-pointer transition-all flex flex-col gap-4 ${formData.paymentMethod === 'card' ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                    <IoCardOutline size={24} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Credit Card</span>
                  </label>
                  <label className={`p-6 rounded-[24px] border cursor-pointer transition-all flex flex-col gap-4 ${formData.paymentMethod === 'cod' ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                    <IoWalletOutline size={24} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Cash On Delivery</span>
                  </label>
                </div>
              </section>

              <button type="submit" className="w-full py-8 bg-emerald-500 text-black font-black uppercase tracking-[0.4em] rounded-[30px] hover:bg-white transition-all shadow-2xl shadow-emerald-500/20 text-xs">
                Authorize Transaction • {config.currency}{total}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-[#0a0a0a] rounded-[50px] border border-white/5 p-12">
              <h3 className="text-xs font-black mb-10 uppercase tracking-[0.4em] text-emerald-500">Order Audit</h3>
              <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex gap-6">
                      <img src={item.img} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt="" />
                      <div className="flex flex-col justify-center">
                        <p className="font-black text-[10px] uppercase text-white/80">{item.name}</p>
                        <p className="text-[9px] text-white/30 font-bold uppercase mt-1 tracking-tighter">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm font-bold text-emerald-400">{config.currency}{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-white/5 pt-8">
                <div className="flex justify-between items-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white font-mono text-sm">{config.currency}{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
                  <span>Shipping Log</span>
                  <span className="text-white font-mono text-sm">+{config.currency}{config.shippingFee}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Grand Total</span>
                  <span className="text-4xl font-black font-mono tracking-tighter">{config.currency}{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;