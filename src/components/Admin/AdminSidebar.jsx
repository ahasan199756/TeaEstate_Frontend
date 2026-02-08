import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Leaf, PlusCircle, Settings as SettingsIcon, 
  LogOut, ChevronLeft, ShoppingBag, ChevronDown,
  Globe, Truck, CreditCard, ShieldCheck, Users, BarChart3, Tag, MessageSquare
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
    <aside className="w-72 min-h-screen sticky top-0 flex flex-col shrink-0 bg-white border-r border-slate-200 z-50 font-sans">
      
      {/* BRAND HEADER */}
      <div className="p-8 mb-4">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => navigate('/admin')}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-emerald-500 transition-all duration-300">
            <Leaf className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-extrabold tracking-tight text-xl leading-none uppercase">
              Estate<span className="text-emerald-500">.</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow px-4 space-y-8 overflow-y-auto">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-xs font-bold tracking-wide">{item.name}</span>
                  </div>
                  
                  {item.name === 'Orders' && orderCount > 0 && (
                    <span className="bg-emerald-500 text-[10px] text-white font-black px-2 py-0.5 rounded-full ring-4 ring-white">
                      {orderCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* SETTINGS ACCORDION */}
        <div className="pb-8">
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">System</p>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isSettingsOpen ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon size={18} />
              <span className="text-xs font-bold tracking-wide">Settings</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-1 space-y-1">
              {['Profile', 'Payments', 'Security'].map((sub) => (
                <NavLink 
                  key={sub}
                  to={`/admin/settings/${sub.toLowerCase()}`}
                  className={({ isActive }) => `
                    flex items-center gap-3 ml-8 px-4 py-2 text-[11px] font-bold tracking-wide transition-all
                    ${isActive ? 'text-emerald-600 border-l-2 border-emerald-500' : 'text-slate-400 hover:text-slate-900'}
                  `}
                >
                  {sub}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-colors w-full group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Storefront</span>
        </button>
        <button 
          onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;