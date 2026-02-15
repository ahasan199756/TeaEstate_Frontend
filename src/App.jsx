import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';

// --- SHOP IMPORTS ---
import Navbar from './components/Navbar/Navbar';
import About from './pages/about';  
import Contact from './pages/Contact';
import Footer from './components/Footer/footer';
import Home from './pages/Home';
import Products from './pages/products';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/Cart/CartDrawer';
import Checkout from './components/Cart/Checkout';
import OrderSuccess from './components/Cart/OrderSuccess';
import OrdersHistory from './components/Cart/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/Admin/AdminLogin';

// --- USER PROFILE SYSTEM ---
import UserLayout from './pages/User'; // Your Sidebar Layout
import ProfileSettings from './pages/ProfileSettings'; // Your Account Settings Form

// --- ADMIN IMPORTS ---
import AdminSidebar from './components/Admin/AdminSidebar';
import Dashboard from './pages/Admin/Dashboard';
import ManageProducts from './pages/Admin/ManageProducts';
import AddProduct from './pages/Admin/AddProduct';
import Categories from './pages/Admin/Categories';
import Analytics from './pages/Admin/Analytics';
import Orders from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';
import Transactions from './pages/Admin/Transactions';

import Settings from './components/Admin/Settings/Settings';
import { ProfileView, ShippingView, PaymentsView, SecurityView } from './components/Admin/Settings/SettingsTabs';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedAdmin = () => {
  const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

const ShopLayout = () => (
  <>
    <Navbar />
    <CartDrawer />
    <main className="min-h-screen"> 
      <Outlet />
    </main>
    <Footer />
  </>
);

;


const AdminLayout = () => {
  return (
    /* Deep "British Racing Green" (#020a02) fading to black for premium backdrop */
    <div className="flex h-screen w-full relative bg-gradient-to-b from-green-900 via-green-950 to-black text-white overflow-hidden  relative">

      {/* Subtle Burnham glows for "subsurface scattering" effect */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#013221]/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[#014634]/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Sidebar using Burnham green */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-grow overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1600px] mx-auto p-8 md:p-12 lg:p-16">
          
          {/* Page content */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>

        {/* Decorative scanline: subtle Burnham-tinted line for premium vibe */}
        <div className="fixed top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#26a17f]/20 to-transparent pointer-events-none" />
      </main>
    </div>
  );
};


const App = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          
          {/* PUBLIC SHOP ROUTES */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* CONNECTED USER PROFILE ROUTES */}
            <Route path="/profile" element={<UserLayout />}>
              <Route index element={<ProfileSettings />} /> 
              <Route path="orders" element={<OrdersHistory />} />
              <Route path="wishlist" element={<div>Wishlist Coming Soon</div>} />
              <Route path="addresses" element={<div>Address Management Coming Soon</div>} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* ADMIN LOGIN */}
          <Route 
            path="/admin-login" 
            element={localStorage.getItem('adminAuthenticated') === 'true' ? <Navigate to="/admin" replace /> : <AdminLogin />} 
          />

          <Route element={<ProtectedAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<Settings />}>
                <Route index element={<ProfileView />} />
                <Route path="profile" element={<ProfileView />} />
                <Route path="shipping" element={<ShippingView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="security" element={<SecurityView />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
