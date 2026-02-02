import React, { useState, useEffect } from 'react';
import { useCart } from "./CartContext";
import { IoArrowBack, IoShieldCheckmarkOutline, IoLocateOutline, IoCardOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Site configuration (Currency & Fees)
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '$', shippingFee: 50 };
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

    // 1. Create Order Object
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      customerName: formData.name,
      email: formData.email,
      items: cart,
      total: total,
      status: 'Pending',
      address: `${formData.address}, ${formData.city}`,
      paymentMethod: formData.paymentMethod
    };

    // 2. Save to Admin Panel Data (customerOrders)
    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    localStorage.setItem('customerOrders', JSON.stringify([newOrder, ...existingOrders]));

    // 3. Clear cart and redirect
    clearCart();
    navigate('/order-success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-4xl font-black uppercase mb-4">Your bag is empty</h2>
        <button onClick={() => navigate('/products')} className="text-green-400 font-bold flex items-center gap-2">
          <IoArrowBack /> Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT: Shipping Form */}
        <div className="space-y-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Checkout</h1>
            <p className="text-white/40">Secure delivery to your doorstep.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-green-400">
                <IoLocateOutline size={20}/> Shipping Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-400" />
                <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-400" />
              </div>
              <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-400" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-400" />
                <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-400" />
              </div>
            </section>

            <section className="space-y-4 pt-6">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-green-400">
                <IoCardOutline size={20}/> Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${formData.paymentMethod === 'card' ? 'bg-green-400/10 border-green-400' : 'bg-white/5 border-white/10'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                  <span className="font-bold text-sm">Credit Card</span>
                </label>
                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${formData.paymentMethod === 'cod' ? 'bg-green-400/10 border-green-400' : 'bg-white/5 border-white/10'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                  <span className="font-bold text-sm">Cash on Delivery</span>
                </label>
              </div>
            </section>

            <button type="submit" className="w-full py-6 bg-green-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-green-500/20">
              Confirm Order • {config.currency}{total}
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white/5 rounded-[40px] border border-white/10 p-10 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-8 uppercase tracking-widest">Order Summary</h3>
          <div className="space-y-6 max-h-80 overflow-y-auto pr-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex gap-4">
                  <img src={item.img} className="w-12 h-12 object-cover rounded-xl" alt="" />
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-mono">{config.currency}{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex justify-between text-white/40 text-sm">
              <span>Subtotal</span>
              <span>{config.currency}{subtotal}</span>
            </div>
            <div className="flex justify-between text-white/40 text-sm">
              <span>Shipping Fee</span>
              <span>{config.currency}{config.shippingFee}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-green-400 pt-2">
              <span>Total</span>
              <span>{config.currency}{total}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest justify-center">
            <IoShieldCheckmarkOutline size={14}/> Encrypted Secure Transaction
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;