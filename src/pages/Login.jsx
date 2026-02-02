import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, UserCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // States
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const users = JSON.parse(localStorage.getItem('teaUsers') || '[]');
    const encryptedInput = btoa(password);
    const user = users.find(u => u.email === email && u.password === encryptedInput);

    setTimeout(() => {
      if (!user) {
        setError("Invalid email or password.");
        setIsLoading(false);
      } else if (user.status === 'Blocked') {
        setError("Your account has been suspended. Please contact support.");
        setIsLoading(false);
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/'); 
      }
    }, 800);
  };

  // --- NEW: Guest Logic ---
  const handleGuestContinue = () => {
    const guestUser = {
      name: 'Guest Explorer',
      email: '',
      role: 'Guest',
      id: `GUEST-${Date.now()}`
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.setItem('isAuthenticated', 'false'); // Note: Not authenticated, but has a session
    navigate('/checkout'); // Redirect straight to checkout
  };

  return (
    <div className="min-h-screen bg-[#062016] flex items-center justify-center px-4">
      <div className={`max-w-md w-full p-10 bg-white shadow-2xl rounded-[40px] transition-all duration-500 ${isLoading ? 'opacity-50 scale-95 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-emerald-100 rounded-2xl text-emerald-700 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Estate Login</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Access your premium tea dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:border-emerald-500 text-gray-900 font-bold outline-none transition-all" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-emerald-600 hover:text-emerald-500 transition-colors">
                FORGOT?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:border-emerald-500 text-gray-900 font-bold outline-none transition-all" 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-[#062016] text-white py-5 rounded-2xl font-black text-xs tracking-[0.3em] hover:bg-emerald-800 transition-all shadow-xl mt-4">
            {isLoading ? 'VERIFYING...' : 'SIGN IN'}
          </button>
        </form>

        {/* --- OR DIVIDER --- */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300">
            <span className="bg-white px-4">OR</span>
          </div>
        </div>

        {/* GUEST OPTION */}
        <button 
          onClick={handleGuestContinue}
          className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold text-xs tracking-widest hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
        >
          <UserCircle size={18} className="text-emerald-600" />
          CONTINUE AS GUEST
        </button>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-500 text-sm font-medium">
            New member?{' '}
            <Link to="/register" className="text-emerald-700 font-black hover:underline underline-offset-4">
              REGISTER HERE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;