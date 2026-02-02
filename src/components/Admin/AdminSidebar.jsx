import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  Layers,
  Users,
  BarChart3,
  CreditCard,
  Bell,
  Package
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Grouped Menu Items for better UX
  const menuGroups = [
    {
      group: "Overview",
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      ]
    },
    {
      group: "Catalog",
      items: [
        { name: 'All Products', icon: Leaf, path: '/admin/products' },
        { name: 'Add Product', icon: PlusCircle, path: '/admin/add-product' },
        { name: 'Categories', icon: Layers, path: '/admin/categories' },
      ]
    },
    {
      group: "Sales & CRM",
      items: [
        { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { name: 'Customers', icon: Users, path: '/admin/customers' },
        { name: 'Transactions', icon: CreditCard, path: '/admin/transactions' },
      ]
    },
    {
      group: "System",
      items: [
        { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
      ]
    }
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="text-black" size={22} />
          </div>
          <div>
            <span className="text-white font-black tracking-tighter text-xl block leading-none">ESTATE</span>
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Command Center</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-grow px-4 pb-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <p className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-emerald-600 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)]' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon size={18} className="transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky bottom-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-4 px-4 py-2 text-gray-500 hover:text-emerald-400 transition-colors w-full group mb-4"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Exit Terminal</span>
        </button>
        
        <button 
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut size={16} />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;