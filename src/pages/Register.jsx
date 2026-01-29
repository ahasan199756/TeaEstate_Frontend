import React from 'react';
import { Link } from 'react-router-dom'; // Added this import

const Register = () => {
  return (
    // Cleaned up conflicting background classes and centered the content vertically
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">Create Account</h2>
        
        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          />
          
          <button 
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors duration-200 mt-2"
          >
            SIGN UP
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-600 text-sm">
            Have an account?{' '}
            <Link to="/login" className="text-green-700 font-bold hover:underline underline-offset-4">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;