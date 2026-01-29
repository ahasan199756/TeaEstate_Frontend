import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to call your backend API would go here
    console.log("Reset link sent to:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl">
        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-green-900 mb-2 text-center">Reset Password</h2>
            <p className="text-gray-600 text-center mb-8 text-sm">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md"
              >
                SEND RESET LINK
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              <p className="font-semibold">Check your email!</p>
              <p className="text-sm">We've sent password reset instructions to <strong>{email}</strong>.</p>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-green-700 font-bold hover:underline"
            >
              Didn't get the email? Try again.
            </button>
          </div>
        )}

        <div className="mt-8 text-center border-t pt-6">
          <Link to="/login" className="text-sm text-green-700 font-bold hover:underline flex items-center justify-center gap-2">
            ← BACK TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;