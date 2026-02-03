import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';

// --- SHOP IMPORTS ---
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/footer';
import Home from './pages/Home';
import Products from './pages/products';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/Cart/CartDrawer';
import Checkout from './components/Cart/Checkout';
import OrderSuccess from './components/Cart/OrderSuccess'; // Fixed Import
import OrdersHistory from './components/Cart/OrderHistory'; // Fixed Import (Renamed for clarity)
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
import Settings, { 
  GeneralSettingsForm, 
  ShippingSettingsForm, 
  PaymentSettingsForm, 
  SecuritySettingsForm 
} from './pages/Admin/Settings';

// --- UTILITIES ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedAdmin = () => {
  const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

// --- LAYOUTS ---
const ShopLayout = () => (
  <>
    <Navbar />
    <CartDrawer />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const AdminLayout = () => (
  <div className="flex min-h-screen w-full bg-[#04160f] relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-800/10 rounded-full blur-[100px] pointer-events-none"></div>
    <AdminSidebar />
    <main className="flex-grow p-10 relative z-10">
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrdersHistory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 2. ADMIN LOGIN */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* 3. PROTECTED ADMIN ROUTES */}
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
                <Route index element={<Navigate to="general" replace />} />
                <Route path="general" element={<GeneralSettingsForm />} />
                <Route path="shipping" element={<ShippingSettingsForm />} />
                <Route path="payments" element={<PaymentSettingsForm />} />
                <Route path="security" element={<SecuritySettingsForm />} />
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