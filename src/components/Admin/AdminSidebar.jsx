import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Leaf, PlusCircle, Settings as SettingsIcon, 
  LogOut, ChevronLeft, ShoppingBag, ChevronDown,
  Globe, CreditCard, Users, BarChart3, Tag
} from 'lucide-react';

const MENU_GROUPS = [
  {
    label: 'Main Operations',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
      { name: 'Customers', icon: Users, path: '/admin/customers' },
      { name: 'Transactions', icon: CreditCard, path: '/admin/transactions' },
    ]
  },
  {
    label: 'Inventory',
    items: [
      { name: 'Manage Products', icon: Leaf, path: '/admin/products' },
      { name: 'Add Products', icon: PlusCircle, path: '/admin/add-product' },
      { name: 'Categories', icon: Tag, path: '/admin/categories' },
    ]
  },
  {
    label: 'Data & Growth',
    items: [
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { name: 'Marketing', icon: Globe, path: '/admin/marketing' },
    ]
  }
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCount, setOrderCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(location.pathname.includes('/admin/settings'));

  const updateOrderBadge = () => {
    const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrderCount(savedOrders.length);
  };

  useEffect(() => {
    updateOrderBadge();
    window.addEventListener('storage', updateOrderBadge);
    window.addEventListener('orderUpdate', updateOrderBadge);
    return () => {
      window.removeEventListener('storage', updateOrderBadge);
      window.removeEventListener('orderUpdate', updateOrderBadge);
    };
  }, []);

  return (
    <aside className="flex flex-col h-full bg-transparent text-white font-sans">
      
      {/* BRAND HEADER: Elegant & Minimal */}
      <div className="p-8 border-b border-white/5">
        <div 
          className="flex flex-col cursor-pointer group" 
          onClick={() => navigate('/admin')}
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500">
                <Leaf className="text-emerald-500" size={16} />
             </div>
             <span className="text-white font-light tracking-[0.2em] text-lg uppercase italic">
                Estate<span className="text-emerald-500">.</span>
             </span>
          </div>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-3 ml-1">
            Global Curators
          </span>
        </div>
      </div>

      {/* NAVIGATION: Subtle Hover & Active States */}
      <nav className="flex-grow px-4 py-6 overflow-y-auto no-scrollbar">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="mb-8">
            <p className="px-4 mb-4 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500 group
                    ${isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                      : 'text-white/50 hover:text-white hover:bg-white/[0.03]'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">{item.name}</span>
                  </div>
                  
                  {item.name === 'Orders' && orderCount > 0 && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                      {orderCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* SETTINGS ACCORDION */}
        <div className="mb-10">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500 ${isSettingsOpen ? 'text-white' : 'text-white/50 hover:text-white'}`}
          >
            <div className="flex items-center gap-4">
              <SettingsIcon size={16} />
              <span className="text-[11px] font-bold tracking-wider uppercase">Settings</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isSettingsOpen ? 'rotate-180 text-emerald-500' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-700 ${isSettingsOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-2 space-y-1 ml-6 border-l border-white/5">
              {['Profile', 'Payments', 'Security'].map((sub) => (
                <NavLink 
                  key={sub}
                  to={`/admin/settings/${sub.toLowerCase()}`}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300
                    ${isActive ? 'text-emerald-400' : 'text-white/30 hover:text-white'}
                  `}
                >
                  {sub}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* FOOTER ACTIONS: Integrated into Glass Surface */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-emerald-400 transition-all w-full group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Back to Store</span>
        </button>
        
        <button 
          onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} 
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full mt-2"
        >
          <LogOut size={16} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">End Session</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;