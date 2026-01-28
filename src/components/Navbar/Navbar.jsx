import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoBagOutline } from "react-icons/io5";
import { useCart } from "../Cart/CartContext"; 
import CartDrawer from "../Cart/CartDrawer"; // Import your Drawer component

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Controls the Cart Side-Panel
  const { totalItems } = useCart(); 
  const [isOpen, setIsOpen] = useState(false); // Controls Mobile Menu
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          scrolled 
            ? "bg-green-950/90 backdrop-blur-md py-3 shadow-2xl" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold tracking-tighter text-white uppercase">
            Tea<span className="text-green-400 font-light">Estate</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className="text-white/90 text-sm font-medium uppercase tracking-widest hover:text-green-400 transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Action Icons */}
          <div className="flex items-center gap-6">
            {/* CART ICON WITH CLICK HANDLER */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-green-400 transition-colors relative group"
            >
              <IoBagOutline className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
            
            <Link to="/products" className="hidden md:block bg-green-600 hover:bg-green-500 text-white px-7 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-lg">
              SHOP NOW
            </Link>

            <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
              <GiHamburgerMenu className="text-3xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 h-screen w-full bg-green-950 transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] z-[60] flex flex-col items-center justify-center ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}>
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform duration-300"
          >
            <IoClose className="text-5xl" />
          </button>

          <ul className="text-center space-y-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black text-white hover:text-green-400 transition-colors uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* RENDER THE CART DRAWER COMPONENT */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;