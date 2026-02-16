import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import { Toaster } from 'react-hot-toast';

// --- SHOP IMPORTS ---
import Navbar from './components/Navbar/Navbar';
import About from './pages/about';  
import Contact from './pages/contact';
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
import AdminLayout from './components/Admin/AdminLayout';

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





const App = () => {
  return (
    <CartProvider>
      {/* ✅ 2. Add Toaster here so it's accessible everywhere */}
      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{
          // Customizing to match your dark emerald/black theme
          style: {
            background: '#040d0a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // Emerald-500
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Red-500
              secondary: '#fff',
            },
          },
        }}
      />
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
