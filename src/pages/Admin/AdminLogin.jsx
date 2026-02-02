import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    // The "Secret" Password
    if (password === 'Admin') {
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#062016] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className={`bg-[#0a0a0a] border ${error ? 'border-red-500' : 'border-white/10'} p-10 rounded-[40px] shadow-2xl transition-all duration-300`}>
          
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Restricted Access</h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-2">Enter Admin Password</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-center text-xl tracking-widest focus:outline-none focus:border-green-500 transition-all placeholder:text-white/10"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest animate-pulse">
                Access Denied • Invalid Password
              </p>
            )}

            <button 
              type="submit" 
              className="group w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 rounded-2xl uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-2"
            >
              Verify Identity
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <button 
            onClick={() => navigate('/')}
            className="w-full mt-6 text-gray-600 hover:text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Cancel and Return to Estate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;