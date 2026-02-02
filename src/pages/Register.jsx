import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Chrome, Facebook, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('teaUsers') || '[]');
    if (existingUsers.find(u => u.email === formData.email)) {
      setError("Email already registered.");
      return;
    }

    const encryptedPassword = btoa(formData.password);

    const newUser = {
      id: Date.now(),
      ...formData,
      password: encryptedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('teaUsers', JSON.stringify([...existingUsers, newUser]));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#062016] flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full p-10 bg-white shadow-2xl rounded-[40px]">
        <header className="text-center mb-10">
          <div className="inline-block p-3 bg-emerald-100 rounded-2xl text-emerald-700 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Create Profile</h2>
          <p className="text-gray-500 font-medium text-sm">Join our premium tea estate.</p>
        </header>

        {error && <p className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Inputs with high-visibility text (text-gray-900) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" required placeholder="Full Name"
              className="md:col-span-2 p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400 transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" required placeholder="Email Address"
              className="p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="tel" required placeholder="Phone Number"
              className="p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400 transition-all"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <textarea 
            required placeholder="Full Delivery Address"
            className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400 h-24 resize-none transition-all"
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          <div className="space-y-4">
            {/* Password with Eye Option */}
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} required placeholder="Password"
                className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600">
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Retype Password - NO EYE OPTION */}
            <input 
              type="password" required placeholder="Retype Password"
              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 text-gray-900 font-semibold placeholder:text-gray-400"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button className="w-full bg-[#062016] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-800 transition-all shadow-xl mt-4">
            Register Account
          </button>
        </form>

        {/* Social Logins Logos Only */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Quick Connect</p>
          <div className="flex justify-center gap-6">
            <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
              <Chrome className="text-red-500" size={24} />
            </button>
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-all shadow-md">
              <Facebook size={24} />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm font-medium">
          Already a member? <Link to="/login" className="text-emerald-700 font-black hover:underline">LOG IN</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;