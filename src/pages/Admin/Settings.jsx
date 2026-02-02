import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, Truck, 
  DollarSign, Globe, Bell, Shield, Mail, 
  RefreshCcw, Database 
} from 'lucide-react';

const Settings = () => {
  const [config, setConfig] = useState({
    siteName: 'Estate Tea Co.',
    currency: '৳',
    taxRate: 5,
    shippingFee: 50,
    contactEmail: 'admin@estatetea.com',
    allowGuestCheckout: true,
    lowStockThreshold: 10
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('siteConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('siteConfig', JSON.stringify(config));
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to factory defaults?")) {
      localStorage.removeItem('siteConfig');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 right-10 bg-emerald-500 text-black px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 z-[100] animate-in slide-in-from-right-10">
          System Configuration Updated
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <SettingsIcon className="text-emerald-500" size={36} /> Control Panel
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
            Global parameters & site-wide variables
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="p-4 bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-500 rounded-2xl transition-all border border-white/5"
            title="Reset to Defaults"
          >
            <RefreshCcw size={20} />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-400'}`}
          >
            {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Syncing...' : 'Save Configuration'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: COMMERCE */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-8">
          <h3 className="text-white font-bold text-xl flex items-center gap-3">
            <DollarSign size={22} className="text-emerald-500" /> Marketplace Rules
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Currency Symbol</label>
              <input 
                type="text" value={config.currency}
                onChange={(e) => setConfig({...config, currency: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all font-mono text-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">VAT/Tax (%)</label>
              <input 
                type="number" value={config.taxRate}
                onChange={(e) => setConfig({...config, taxRate: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Truck size={12}/> Standard Shipping Fee
            </label>
            <input 
              type="number" value={config.shippingFee}
              onChange={(e) => setConfig({...config, shippingFee: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* SECTION 2: INVENTORY & SYSTEM */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-8">
          <h3 className="text-white font-bold text-xl flex items-center gap-3">
            <Database size={22} className="text-emerald-500" /> System Logic
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
              <div>
                <p className="text-white text-sm font-bold uppercase tracking-tight">Guest Checkout</p>
                <p className="text-white/30 text-[10px] font-medium">Allow orders without account</p>
              </div>
              <button 
                onClick={() => setConfig({...config, allowGuestCheckout: !config.allowGuestCheckout})}
                className={`w-12 h-6 rounded-full transition-all relative ${config.allowGuestCheckout ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${config.allowGuestCheckout ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Bell size={12}/> Low Stock Alert Threshold
              </label>
              <input 
                type="number" value={config.lowStockThreshold}
                onChange={(e) => setConfig({...config, lowStockThreshold: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12}/> Support Notification Email
              </label>
              <input 
                type="email" value={config.contactEmail}
                onChange={(e) => setConfig({...config, contactEmail: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

      </div>

      {/* DANGER ZONE */}
      <div className="p-8 border-2 border-dashed border-red-500/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500">
            <Shield size={32} />
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-lg tracking-tighter">Factory Reset</h4>
            <p className="text-white/40 text-xs font-medium italic">Wipe all custom configurations and revert to base code settings.</p>
          </div>
        </div>
        <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
          Execute Wipe
        </button>
      </div>
    </div>
  );
};

export default Settings;