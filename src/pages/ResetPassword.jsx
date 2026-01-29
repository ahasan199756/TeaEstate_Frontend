import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, CheckCircle2 } from 'lucide-react'; // Optional: Install lucide-react for icons

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showToast, setShowToast] = useState({ show: false, type: '', message: '' });

  // Validation States
  const rules = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password.length > 0 && password === confirmPassword
  };

  // Auto-hide toast
  useEffect(() => {
    if (showToast.show) {
      const timer = setTimeout(() => setShowToast({ ...showToast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast.show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allValid = Object.values(rules).every(Boolean);

    if (!allValid) {
      setShowToast({
        show: true,
        type: 'error',
        message: 'Please meet all security requirements before proceeding.'
      });
      return;
    }

    // Success Logic
    setShowToast({
      show: true,
      type: 'success',
      message: 'Password updated! Redirecting to login...'
    });
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4 font-sans relative">
      
      {/* ADVANCED TRANSPARENT TOAST (Glassmorphism) */}
      {showToast.show && (
        <div className={`fixed top-10 right-10 z-50 flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-top-5 ${
          showToast.type === 'error' 
            ? 'bg-red-500/20 border-red-500/50 text-red-100' 
            : 'bg-green-500/20 border-green-500/50 text-green-100'
        }`}>
          {showToast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-medium">{showToast.message}</span>
        </div>
      )}

      <div className="max-w-md w-full p-8 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20">
        <h2 className="text-3xl font-black text-green-900 mb-2 text-center">New Password</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Create a strong password to secure your account.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <input 
              type="password" 
              placeholder="New Password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* LIVE RULES CHECKLIST */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
              <RuleItem label="8+ Characters" valid={rules.length} />
              <RuleItem label="1 Capital Letter" valid={rules.capital} />
              <RuleItem label="1 Number" valid={rules.number} />
              <RuleItem label="1 Special Char" valid={rules.special} />
            </div>
          </div>

          <div className="space-y-2">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {password && (
              <p className={`text-xs font-bold px-1 ${rules.match ? 'text-green-600' : 'text-red-500'}`}>
                {rules.match ? '✓ Passwords match' : '× Passwords do not match'}
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
          >
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper component for the rules
const RuleItem = ({ label, valid }) => (
  <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${valid ? 'text-green-600' : 'text-gray-400'}`}>
    {valid ? <Check size={12} strokeWidth={4} /> : <X size={12} strokeWidth={4} />}
    {label}
  </div>
);

export default ResetPassword;