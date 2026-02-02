import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Tea', icon: Leaf, path: '/admin/products' },
    { name: 'Add Variety', icon: PlusCircle, path: '/admin/add-product' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#04160f] border-r border-white/5 flex flex-col">
      {/* Branding */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Leaf className="text-white" size={20} />
          </div>
          <span className="text-white font-black tracking-tighter text-xl">ESTATE<span className="text-emerald-500">.</span></span>
        </div>
        <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-[0.3em] mt-2 ml-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-4 px-4 text-white/40 hover:text-emerald-400 transition-colors w-full"
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Shop</span>
        </button>
        
        <button className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all w-full">
          <LogOut size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;