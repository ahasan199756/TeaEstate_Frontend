import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center bg-[#f8f9f8] px-4 pt-20">
      <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-green-950 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
        </div>

        <form className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="hello@teaestate.com" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-green-700 hover:text-green-500 transition-colors">
                FORGOT PASSWORD?
              </Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
            />
          </div>

          {/* Login Button */}
          <button className="w-full bg-green-900 text-white py-4 rounded-xl font-bold text-sm tracking-widest hover:bg-green-800 transform transition-all active:scale-[0.98] shadow-lg shadow-green-900/20">
            LOG IN
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-700 font-bold hover:underline underline-offset-4">
              CREATE A NEW ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;