import React, { useState } from 'react';
import { useCart } from "./CartContext";
import { IoArrowBack, IoLocateOutline, IoCardOutline, IoWalletOutline, IoShieldCheckmarkOutline, IoBagCheckOutline } from "react-icons/io5";
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

  // Number Safety: Ensure math is correct
  const safeSubtotal = Number(subtotal || 0);
  const safeShipping = Number(config.shippingFee || 0);
  const total = safeSubtotal + safeShipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      customerName: formData.name,
      email: formData.email.toLowerCase(), 
      items: [...cart], 
      subtotal: safeSubtotal,
      shipping: safeShipping,
      total: total,
      status: 'Pending',
      address: `${formData.address}, ${formData.city}`,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      timestamp: new Date().getTime()
    };

    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    localStorage.setItem('customerOrders', JSON.stringify([newOrder, ...existingOrders]));

    window.dispatchEvent(new Event('orderUpdate'));
    clearCart();
    navigate('/order-success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex flex-col items-center justify-center p-10 text-center text-white">
        <IoBagCheckOutline size={60} className="text-emerald-500/20 mb-6" />
        <h2 className="text-4xl font-black uppercase mb-6 italic tracking-tighter">Your Bag is Empty</h2>
        <button onClick={() => navigate('/products')} className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 border border-emerald-500/30 px-6 py-3 rounded-full hover:bg-emerald-500 hover:text-black transition-all">
          <IoArrowBack /> Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-32 pb-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:gap-4 transition-all">
            <IoArrowBack /> Go Back
          </button>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">Checkout <span className="text-emerald-500">Center</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 mb-8">
                  <IoLocateOutline size={20}/> 01. Shipping Logistics
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="Full Name" />
                    <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="Email Address" />
                  </div>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" placeholder="Street Address" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" placeholder="City" />
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" placeholder="Phone Number" />
                  </div>
                </div>
              </section>

              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 mb-8">
                  <IoCardOutline size={20}/> 02. Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                    <IoCardOutline /> Online
                  </label>
                  <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                    <IoWalletOutline /> COD
                  </label>
                </div>
              </section>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] sticky top-32">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">Summary</h3>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{item.name} x {item.quantity}</span>
                    <span className="font-mono text-emerald-500">{config.currency}{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs text-white/40 font-bold uppercase">
                  <span>Subtotal</span>
                  <span>{config.currency}{safeSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/40 font-bold uppercase">
                  <span>Shipping</span>
                  <span>{config.currency}{safeShipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Total</span>
                  <span className="text-4xl font-black font-mono tracking-tighter">{config.currency}{total.toLocaleString()}</span>
                </div>
              </div>
              <button form="checkout-form" type="submit" className="w-full py-6 mt-8 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-xl shadow-emerald-500/20">
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;