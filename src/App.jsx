import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Products from './pages/products';
import About from './pages/about';
import Contact from './pages/contact';
import Footer from './components/Footer/footer'; 
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail'; // 1. IMPORT THIS
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
            
            {/* 2. ADD THIS DYNAMIC ROUTE */}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer/>
      </Router>
    </CartProvider>
  );
};

export default App;