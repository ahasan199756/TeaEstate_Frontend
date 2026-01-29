import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Products from './pages/products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './pages/Login';      // 1. IMPORT LOGIN
import Register from './pages/Register'; // 2. IMPORT REGISTER
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer/footer'; 
import { CartProvider } from './components/Cart/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="bg-white selection:bg-green-500 selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* 3. ADD THESE ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
        <Footer/>
      </Router>
    </CartProvider>
  );
};

export default App;