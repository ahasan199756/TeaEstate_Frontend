import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './pages/products';
import About from './pages/about';
import Contact from './pages/contact';
import Footer from './components/Footer/footer'; // Bonus: Adds a professional finish
import Home from './pages/Home';
import { CartProvider } from './components/Cart/CartContext';

const App = () => {
  return (
    <CartProvider>
    <Router>
      <div className="bg-white selection:bg-green-500 selection:text-white">
        <Navbar />
        <Routes>
          {/* Home Page consists of the Hero + other sections */}
          <Route path="/" element={<Home />} />
          
          
          {/* Sub Pages */}
          <Route path="/products" element={<Products />} />
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