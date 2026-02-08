import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { User as UserIcon, ShoppingBag, Heart, MapPin, LogOut, Settings as SettingsIcon } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  // Get real user data from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser')) || { name: "Guest", email: "guest@estate-tea.com" };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const menuItems = [
    { name: 'My Profile', path: '/profile', icon: <UserIcon size={18} />, end: true },
    { name: 'Order History', path: '/profile/order', icon: <ShoppingBag size={18} /> },
    { name: 'Wishlist', path: '/profile/wishlist', icon: <Heart size={18} /> },
    { name: 'Addresses', path: '/profile/addresses', icon: <MapPin size={18} /> },
    { name: 'Settings', path: '/profile/settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#04160f] text-white pt-32 pb-20 px-6 lg:px-16 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-80 space-y-8">
            <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl mb-6 flex items-center justify-center text-3xl font-black shadow-2xl shadow-emerald-500/20 text-[#04160f]">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-white/40 text-sm font-medium">{user.email}</p>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest
                    ${isActive 
                      ? 'bg-emerald-500 text-[#04160f] shadow-lg shadow-emerald-500/20' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest mt-4">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          <main className="flex-grow min-h-[600px] p-8 lg:p-12 rounded-[50px] bg-white/5 border border-white/10 backdrop-blur-xl animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;