import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, Truck, CreditCard, Shield, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'profile';

  const menuItems = [
    { name: 'Profile', icon: <User size={14} />, path: 'profile' },
    { name: 'Shipping', icon: <Truck size={14} />, path: 'shipping' },
    { name: 'Payments', icon: <CreditCard size={14} />, path: 'payments' },
    { name: 'Security', icon: <Shield size={14} />, path: 'security' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          System <span className="text-emerald-500">Config</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <SettingsIcon size={12} className="text-emerald-500 animate-spin-slow" />
          <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.2em]">
            Admin / Settings / <span className="text-white/60">{currentTab}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[30px] p-4 py-6 shadow-xl">
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 ml-4">Section</p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavLink 
                  key={item.name}
                  to={`/admin/settings/${item.path}`}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all
                    ${isActive 
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'text-white/20 hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px]">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;