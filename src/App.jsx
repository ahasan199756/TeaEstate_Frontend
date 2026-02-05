import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';

// --- SHOP IMPORTS ---
import Navbar from './components/Navbar/Navbar';
import About from './pages/About';  
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

// Import Settings Layout and its sub-views
import Settings from './components/Admin/Settings/Settings';
import { 
  ProfileView, 
  ShippingView, 
  PaymentsView, 
  SecurityView 
} from './components/Admin/Settings/SettingsTabs';

// --- UTILITIES ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedAdmin = () => {
  const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
  // If not auth, go to login. 
  // 'replace' is important so they can't click "back" into the protected zone.
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

// --- LAYOUTS ---
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

const AdminLayout = () => (
  /* 1. Changed min-h-screen to h-screen and added overflow-hidden */
  <div className="flex h-screen w-full bg-[#04160f] relative overflow-hidden">
    
    {/* Decorative Background Elements */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-800/10 rounded-full blur-[100px] pointer-events-none"></div>
    
    <AdminSidebar />

    {/* 2. Added overflow-y-auto to allow only the content area to scroll */}
    <main className="flex-grow p-10 relative z-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          
          {/* 1. PUBLIC SHOP ROUTES */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrdersHistory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 2. ADMIN LOGIN */}
          <Route 
            path="/admin-login" 
            element={
              localStorage.getItem('adminAuthenticated') === 'true' 
              ? <Navigate to="/admin" replace /> 
              : <AdminLogin />
            } 
          />

          {/* 3. PROTECTED ADMIN ROUTES */}
          <Route element={<ProtectedAdmin />}>
          <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
            
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="transactions" element={<Transactions />} />
              
              {/* Settings Nested Routes */}
              <Route path="settings" element={<Settings />}>
                <Route index element={<ProfileView />} />
                <Route path="profile" element={<ProfileView />} />
                <Route path="shipping" element={<ShippingView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="security" element={<SecurityView />} />
              </Route>
            </Route>
          </Route>

          {/* 4. FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;