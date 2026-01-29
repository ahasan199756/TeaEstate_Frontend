import React from 'react';

const Register = () => {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center bg-gray-50 pt-20">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-green-900 mb-6">Create Account</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" />
          <button className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;