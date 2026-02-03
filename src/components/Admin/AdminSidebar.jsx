import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Leaf, PlusCircle, Settings as SettingsIcon, 
  LogOut, ChevronLeft, ShoppingBag, ChevronDown,
  Globe, Truck, CreditCard, ShieldCheck, Users, BarChart3, Tag, MessageSquare
} from 'lucide-react';

// 1. Centralized Menu Configuration
const MENU_GROUPS = [
  {
    label: 'Main Menu',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Orders', icon: ShoppingBag, path: '/admin/orders', badge: '' },
      { name: 'Customers', icon: Users, path: '/admin/customers' },
    ]
  },
  {
    label: 'Inventory',
    items: [
      { name: 'Manage Tea', icon: Leaf, path: '/admin/products' },
      { name: 'Add Variety', icon: PlusCircle, path: '/admin/add-product' },
      { name: 'Categories', icon: Tag, path: '/admin/categories' },
    ]
  },
  {
    label: 'Data & Growth',
    items: [
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { name: 'Marketing', icon: Globe, path: '/admin/marketing' },
      { name: 'Support', icon: MessageSquare, path: '/admin/support' },
    ]
  }
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(location.pathname.startsWith('/admin/settings'));

  useEffect(() => {
    if (location.pathname.startsWith('/admin/settings')) setIsSettingsOpen(true);
  }, [location.pathname]);

  return (
    <aside className="w-64 min-h-screen sticky top-0 flex flex-col shrink-0 bg-[#020c08] border-r border-white/5 z-50">
      
      {/* BRAND HEADER */}
      <div className="p-8 pb-6 shrink-0">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:rotate-6 transition-all duration-300">
            <Leaf className="text-white" size={22} />
          </div>
          <span className="text-white font-black tracking-tighter text-2xl uppercase italic">
            ESTATE<span className="text-emerald-500">.</span>
          </span>
        </div>
      </div>

      {/* SCROLLABLE NAV */}
      <nav className="flex-grow px-4 space-y-6 overflow-y-auto custom-scrollbar">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-emerald-500 text-[10px] text-black font-bold px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {/* SETTINGS SECTION */}
        <div className="pb-4">
          <p className="px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Configuration</p>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isSettingsOpen ? 'text-white bg-white/5' : 'text-white/40 hover:text-white'}`}
          >
            <div className="flex items-center gap-4">
              <SettingsIcon size={18} className={isSettingsOpen ? 'text-emerald-500' : ''} />
              <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isSettingsOpen ? 'rotate-180 text-emerald-500' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSettingsOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="ml-6 mt-2 border-l border-white/5 space-y-1">
              {['Profile', 'Shipping', 'Payments', 'Security'].map((sub) => (
                <NavLink 
                  key={sub}
                  to={`/admin/settings/${sub.toLowerCase()}`}
                  className={({ isActive }) => `
                    flex items-center gap-3 ml-4 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                    ${isActive ? 'text-emerald-400 bg-emerald-500/5' : 'text-white/20 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {sub}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-6 mt-auto shrink-0 space-y-3 bg-[#020c08]">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-4 px-4 py-2 text-white/30 hover:text-emerald-400 transition-colors w-full group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Back to Store</span>
        </button>
        
        <button 
          onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} 
          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-red-500/5 text-red-500/60 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-500 w-full"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;