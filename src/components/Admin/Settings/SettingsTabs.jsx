import React from 'react';

export const ProfileView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div>
      <h2 className="text-2xl font-black text-white uppercase italic">Admin Profile</h2>
      <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Manage identity</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Name</label>
        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none" defaultValue="Estate Manager" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">Email</label>
        <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none" defaultValue="admin@teaestate.com" />
      </div>
    </div>
    <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">Update</button>
  </div>
);

export const ShippingView = () => {
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { shippingFee: 50 };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-black text-white uppercase italic">Logistics</h2>
      <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <span className="text-white font-bold text-sm block">Standard Shipping</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Fixed Flat Rate</span>
          </div>
          <span className="text-emerald-400 font-mono text-xl font-black">৳{config.shippingFee}.00</span>
        </div>
        <p className="text-[10px] text-white/30 font-medium leading-relaxed uppercase tracking-wider">
          Currently applied to all global checkout transactions.
        </p>
      </div>
    </div>
  );
};

export const PaymentsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div>
      <h2 className="text-2xl font-black text-white uppercase italic">Finance</h2>
      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Active Gateway Integrations</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['bKash', 'Nagad', 'Card / Stripe', 'COD'].map(method => (
        <div key={method} className="p-6 bg-[#111] rounded-3xl border border-white/5 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">{method}</span>
          </div>
          <span className="text-[9px] font-black text-emerald-500/50 uppercase">Operational</span>
        </div>
      ))}
    </div>
  </div>
);

export const SecurityView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <h2 className="text-2xl font-black text-white uppercase italic">Vault</h2>
    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl">
      <p className="text-red-500 text-[10px] font-black uppercase mb-2">Danger Zone</p>
      <button className="text-white bg-red-500/20 px-4 py-2 rounded-lg text-[9px] font-bold uppercase">Change Password</button>
    </div>
  </div>
);