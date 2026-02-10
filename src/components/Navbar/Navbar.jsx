import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoBagOutline, IoPersonOutline, IoLogOutOutline, IoSettingsOutline } from "react-icons/io5"; 
import { useCart } from "../Cart/CartContext"; 
import CartDrawer from "../Cart/CartDrawer"; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize location
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart(); 
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // --- NEW LOGIC: Force solid navbar on specific pages ---
  const isSolidPage = location.pathname === '/order-success';

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(savedUser);
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          // If the user scrolled OR we are on the Success page, show solid green
          (scrolled || isSolidPage) 
            ? "bg-[#f4faf4]/95 backdrop-blur-md py-3 shadow-lg border-b border-[#d7e6dc]" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          <Link to="/" className="text-3xl font-extrabold tracking-tighter text-[#1f3a2f] uppercase" aria-label="TeaEstate home">
            Tea<span className="text-[#5f9a74] font-light">Estate</span>
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={`text-sm font-medium uppercase tracking-widest transition-all duration-300 relative group ${location.pathname === link.path ? 'text-[#4f8d67]' : 'text-[#2b4a3a] hover:text-[#4f8d67]'}`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <div 
              className="relative group"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button 
                className={`text-[#2b4a3a] hover:text-[#4f8d67] transition-colors flex items-center gap-2 pb-2 ${user ? 'text-[#4f8d67]' : ''}`}
              >
                <IoPersonOutline className="text-2xl" />
                {user && <span className="text-[10px] font-bold uppercase tracking-tighter hidden lg:block">Hi, {user.name.split(' ')[0]}</span>}
              </button>

              <div 
                className={`absolute right-0 w-56 bg-white rounded-2xl shadow-2xl py-4 transition-all duration-300 transform origin-top ${
                  isUserMenuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"
                }`}
              >
                {!user ? (
                  <>
                    <Link to="/login" className="block px-6 py-2 text-sm font-bold text-green-950 hover:bg-green-50 transition-colors">LOG IN</Link>
                    <Link to="/register" className="block px-6 py-2 text-sm font-medium text-gray-500 hover:bg-green-50 transition-colors">CREATE ACCOUNT</Link>
                  </>
                ) : (
                  <>
                    <div className="px-6 py-2 border-b border-gray-100 mb-2">
                      <p className="text-[10px] font-black text-green-600 uppercase">Customer</p>
                      <p className="text-sm font-bold text-green-950 truncate">{user.name}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors">
                      <IoSettingsOutline /> MY PROFILE
                    </Link>
                    <Link to="/profile/orders" className="flex items-center justify-between px-6 py-2 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center gap-3"><IoBagOutline /> ORDER HISTORY</div>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-6 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                        <IoLogOutOutline className="text-lg" /> LOGOUT
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="text-[#2b4a3a] hover:text-[#4f8d67] transition-colors relative">
              <IoBagOutline className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#6fa884] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
            
            <Link to="/products" className="hidden md:block bg-[#6fa884] hover:bg-[#5f9a74] text-white px-7 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all transform hover:scale-105 shadow-lg">
              SHOP NOW
            </Link>

            <button className="md:hidden text-[#2b4a3a]" onClick={() => setIsOpen(true)}>
              <GiHamburgerMenu className="text-3xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 h-screen w-full bg-[#eef6ef] transition-all duration-700 z-[60] flex flex-col items-center justify-center ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}>
          <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-[#2b4a3a]"><IoClose className="text-5xl" /></button>
          <ul className="text-center space-y-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} onClick={() => setIsOpen(false)} className="text-4xl font-black text-[#1f3a2f] hover:text-[#4f8d67] transition-colors uppercase">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;