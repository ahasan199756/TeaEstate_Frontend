// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import CartProvider from "./components/Cart/CartProvider";
import { Toaster } from "react-hot-toast";

// --- SHOP IMPORTS ---
import Navbar from "./components/Navbar/Navbar";
import About from "./pages/about";
import Contact from "./pages/contact";
import Footer from "./components/Footer/footer";
import Home from "./pages/Home";
import Products from "./pages/products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./components/Cart/Checkout";
import OrderSuccess from "./components/Cart/OrderSuccess";
import OrdersHistory from "./components/Cart/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";

// --- USER PROFILE ---
import UserLayout from "./pages/User";
import ProfileSettings from "./pages/ProfileSettings";

// --- ADMIN ---
import Dashboard from "./pages/Admin/Dashboard";
import ManageProducts from "./pages/Admin/ManageProducts";
import AddProduct from "./pages/Admin/AddProduct";
import Categories from "./pages/Admin/Categories";
import Analytics from "./pages/Admin/Analytics";
import Orders from "./pages/Admin/Orders";
import Customers from "./pages/Admin/Customers";
import Transactions from "./pages/Admin/Transactions";

// --- SETTINGS ---
import Settings from "./components/Admin/Settings/Settings";
import {
  ProfileView,
  UsersView,
  ShippingView,
  PaymentsView,
  SecurityView,
} from "./components/Admin/Settings/views";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedAdmin = () => {
  const isAuth = localStorage.getItem("adminAuthenticated") === "true";
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

const ShopLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => {
  return (
    <CartProvider>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#040d0a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      <Router>
        <ScrollToTop />

        <Routes>
          {/* PUBLIC SHOP */}
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

            {/* USER PROFILE */}
            <Route path="/profile" element={<UserLayout />}>
              <Route index element={<ProfileSettings />} />
              <Route path="orders" element={<OrdersHistory />} />
              <Route
                path="wishlist"
                element={<div>Wishlist Coming Soon</div>}
              />
              <Route
                path="addresses"
                element={<div>Address Management Coming Soon</div>}
              />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* ADMIN LOGIN */}
          <Route
            path="/admin-login"
            element={
              localStorage.getItem("adminAuthenticated") === "true" ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLogin />
              )
            }
          />

          {/* PROTECTED ADMIN */}
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
                <Route path="users" element={<UsersView />} />
                <Route path="shipping" element={<ShippingView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="security" element={<SecurityView />} />
              </Route>
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
