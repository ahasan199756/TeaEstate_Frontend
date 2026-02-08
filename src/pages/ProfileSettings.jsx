import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const ProfileSettings = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Account Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Full Name</label>
          <input 
            type="text" 
            defaultValue={user.name}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-emerald-500 outline-none transition-all text-white"
          />
        </div>

        <div className="space-y-2 opacity-60 group relative">
          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            Email Address <ShieldCheck size={12} className="text-emerald-500" />
          </label>
          <input 
            type="email" 
            value={user.email}
            disabled
            className="w-full bg-white/10 border border-white/5 p-4 rounded-2xl cursor-not-allowed"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Shipping Address</label>
          <textarea 
            rows="3"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-emerald-500 outline-none transition-all text-white"
            placeholder="Enter your primary address"
          />
        </div>
      </div>

      <button className="mt-10 bg-emerald-500 text-[#04160f] px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-white transition-all">
        SAVE CHANGES
      </button>
    </div>
  );
};

export default ProfileSettings;