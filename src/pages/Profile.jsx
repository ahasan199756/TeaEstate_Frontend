import React, { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#062016] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:bg-white/5'}`}
          >
            <User size={20} /> My Profile
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Package size={20} /> Order History
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all mt-10"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12">
          
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Account Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Editable Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* READ ONLY FIELD (Admin Only) */}
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
                  <span className="hidden group-hover:block absolute top-full mt-2 text-[10px] text-emerald-300">Contact admin to change email.</span>
                </div>

                {/* Editable Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Shipping Address</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                    placeholder="Enter your primary address"
                  />
                </div>
              </div>

              <button className="mt-10 bg-emerald-500 text-[#062016] px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-white transition-all">
                SAVE CHANGES
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in text-center py-20">
              <Package size={48} className="mx-auto text-emerald-500/30 mb-4" />
              <h3 className="text-xl font-bold uppercase">No orders yet</h3>
              <p className="text-white/40 text-sm mt-2">Your tea journey begins when you place your first order.</p>
              <button onClick={() => navigate('/products')} className="mt-8 text-emerald-400 border-b border-emerald-400 pb-1 font-bold text-xs uppercase tracking-widest">Start Shopping</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;