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
  const [isCollapsed, setIsCollapsed] = useState(false); // Mini/collapsed mode

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
    <aside className={`flex flex-col sticky top-0 bg-[#013221] text-white border-r border-[#014634] z-50 font-sans transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* BRAND HEADER */}
      <div className={`flex items-center justify-between p-4 border-b border-[#014634]`}>
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/admin')}
        >
          <div className="w-10 h-10 bg-[#014634] rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#026644]">
            <Leaf className="text-white" size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-white font-extrabold tracking-tight text-xl uppercase leading-none">
                Estate<span className="text-[#26a17f]">.</span>
              </span>
              <span className="text-[10px] font-bold text-[#7fc6b1] uppercase tracking-widest mt-1">Management</span>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#7fc6b1] hover:text-white transition-transform"
        >
          <ChevronLeft size={16} className={`${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow px-1 py-4 overflow-y-auto">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            {!isCollapsed && (
              <p className="px-4 mb-2 text-[10px] font-bold text-[#7fc6b1] uppercase tracking-[0.15em]">{group.label}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive ? 'bg-[#014634] text-white shadow-md' : 'text-[#7fc6b1] hover:bg-[#026644] hover:text-white'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <item.icon size={18} />
                  {!isCollapsed && <span className="text-xs font-bold tracking-wide">{item.name}</span>}
                  
                  {item.name === 'Orders' && orderCount > 0 && !isCollapsed && (
                    <span className="bg-[#26a17f] text-[#013221] text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-[#014634]">
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
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSettingsOpen ? 'bg-[#014634] text-white' : 'text-[#7fc6b1] hover:bg-[#026644] hover:text-white'} ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <SettingsIcon size={18} />
            {!isCollapsed && <span className="text-xs font-bold tracking-wide">Settings</span>}
            {!isCollapsed && <ChevronDown size={14} className={`transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />}
          </button>

          {!isCollapsed && (
            <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="mt-1 space-y-1 ml-8">
                {['Profile', 'Payments', 'Security'].map((sub) => (
                  <NavLink 
                    key={sub}
                    to={`/admin/settings/${sub.toLowerCase()}`}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2 text-[11px] font-bold tracking-wide transition-all
                      ${isActive ? 'text-[#26a17f] border-l-2 border-[#26a17f]' : 'text-[#7fc6b1] hover:text-white'}
                    `}
                  >
                    {sub}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 mt-auto border-t border-[#014634] bg-[#014634]/50 flex flex-col gap-2">
        <button 
          onClick={() => navigate('/')} 
          className={`flex items-center gap-3 px-4 py-3 text-[#7fc6b1] hover:text-white transition-colors w-full ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <ChevronLeft size={16} className={`${isCollapsed ? 'rotate-180' : ''}`} />
          {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Storefront</span>}
        </button>
        <button 
          onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all w-full ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
