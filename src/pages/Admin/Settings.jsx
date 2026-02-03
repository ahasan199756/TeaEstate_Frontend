import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Save, Database, Globe, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const { pathname } = useLocation();
  const activeSub = pathname.split('/').pop();

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Settings <span className="text-emerald-500">/</span> <span className="capitalize">{activeSub}</span>
          </h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Manage your tea estate infrastructure</p>
        </div>
        <button className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
          <Save size={18} /> Save All Changes
        </button>
      </header>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 min-h-[600px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-white">
          <Database size={300} />
        </div>
        <div className="relative z-10">
           <Outlet />
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
export const GeneralSettingsForm = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4">
    <h3 className="text-white font-bold text-xl uppercase italic flex items-center gap-3">
      <Globe className="text-emerald-500" size={20} /> Store Profile
    </h3>
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Site Name</label>
        <input type="text" defaultValue="Estate Tea Co." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Support Email</label>
        <input type="email" defaultValue="admin@estatetea.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500" />
      </div>
    </div>
  </div>
);

export const ShippingSettingsForm = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 text-white/50 italic uppercase font-black tracking-widest p-20 border border-dashed border-white/10 rounded-3xl text-center">
    <Truck className="mx-auto mb-4 text-emerald-500" size={48} />
    Shipping Configuration Module
  </div>
);

export const PaymentSettingsForm = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 text-white/50 italic uppercase font-black tracking-widest p-20 border border-dashed border-white/10 rounded-3xl text-center">
    <CreditCard className="mx-auto mb-4 text-emerald-500" size={48} />
    Payment Gateway Module
  </div>
);

export const SecuritySettingsForm = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 text-white/50 italic uppercase font-black tracking-widest p-20 border border-dashed border-white/10 rounded-3xl text-center">
    <ShieldCheck className="mx-auto mb-4 text-emerald-500" size={48} />
    Security & Access Module
  </div>
);

export default Settings;