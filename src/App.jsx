import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// --- SHOP COMPONENTS ---
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/footer';
import Home from './pages/Home';
import Products from './pages/products'; 
import ProductDetail from './pages/ProductDetail';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Checkout from './components/Cart/Checkout'; // NEW
import OrderSuccess from './pages/OrderSuccess'; // NEW

// Context
import { CartProvider } from './components/Cart/CartContext';

// --- ADMIN COMPONENTS ---
import AdminLogin from './pages/Admin/AdminLogin';
import AdminSidebar from './components/Admin/AdminSidebar';
import Dashboard from './pages/Admin/Dashboard';
import ManageProducts from './pages/Admin/ManageProducts';
import AddProduct from './pages/Admin/AddProduct';
import Categories from './pages/Admin/Categories';
import Analytics from './pages/Admin/Analytics';
import Orders from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';
import Transactions from './pages/Admin/Transactions';
import Settings from './pages/Admin/Settings';

// 1. Scroll to top logic
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 2. Security Guards
const ProtectedAdmin = () => {
  const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

const ProtectedCustomer = () => {
  const isAuth = localStorage.getItem('currentUser') !== null;
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

// 3. Layout logic
const ShopLayout = () => {
  const location = useLocation();
  // Added order-success and checkout to authPaths if you want a focused UI
  const authPaths = ['/login', '/register', '/admin-login', '/forgot-password', '/order-success'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="bg-[#062016] selection:bg-emerald-500 selection:text-white min-h-screen flex flex-col text-white">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const AdminLayout = () => (
  <div className="flex min-h-screen bg-[#062016] selection:bg-emerald-500 selection:text-white">
    <AdminSidebar />
    <main className="flex-grow p-10 overflow-y-auto max-h-screen">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* --- PUBLIC & CUSTOMER SHOP ROUTES --- */}
          <Route path="/" element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="admin-login" element={<AdminLogin />} />
            <Route path="checkout" element={<Checkout />} /> {/* NEW */}
            <Route path="order-success" element={<OrderSuccess />} /> {/* NEW */}

            {/* PROTECTED CUSTOMER ROUTES */}
            <Route element={<ProtectedCustomer />}>
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:id" element={<OrderDetail />} />
            </Route>
          </Route>

          {/* --- PROTECTED ADMIN ROUTES --- */}
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
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;