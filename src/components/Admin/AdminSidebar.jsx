import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  PlusCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ShoppingBag,
  ChevronDown,
  Globe,
  CreditCard,
  Users,
  BarChart3,
  Tag,
  User as UserIcon,
  Truck,
  Shield,
  Menu,
  X,
} from "lucide-react";

const MENU_GROUPS = [
  {
    label: "Main Operations",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
      { name: "Customers", icon: Users, path: "/admin/customers" },
      { name: "Transactions", icon: CreditCard, path: "/admin/transactions" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Manage Products", icon: Leaf, path: "/admin/products" },
      { name: "Add Products", icon: PlusCircle, path: "/admin/add-product" },
      { name: "Categories", icon: Tag, path: "/admin/categories" },
    ],
  },
  {
    label: "Data & Growth",
    items: [
      { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      { name: "Marketing", icon: Globe, path: "/admin/marketing" },
    ],
  },
];

const SETTINGS_ITEMS = [
  { label: "Profile", path: "profile", icon: UserIcon },
  { label: "Users", path: "users", icon: Users },
  { label: "Shipping", path: "shipping", icon: Truck },
  { label: "Payments", path: "payments", icon: CreditCard },
  { label: "Security", path: "security", icon: Shield },
];

/* ---------------- helpers ---------------- */

const safeJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

/* ---------------- component ---------------- */

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCount, setOrderCount] = useState(0);

  // ✅ settings accordion
  const isOnSettings = location.pathname.startsWith("/admin/settings");
  const [isSettingsOpen, setIsSettingsOpen] = useState(isOnSettings);

  // ✅ responsive drawer (mobile)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // auto open accordion on settings route
  useEffect(() => {
    if (isOnSettings) setIsSettingsOpen(true);
  }, [isOnSettings]);

  const updateOrderBadge = useCallback(() => {
    const savedOrders = safeJSON("customerOrders", []);
    setOrderCount(Array.isArray(savedOrders) ? savedOrders.length : 0);
  }, []);

  useEffect(() => {
    updateOrderBadge();
    window.addEventListener("storage", updateOrderBadge);
    window.addEventListener("orderUpdate", updateOrderBadge);
    return () => {
      window.removeEventListener("storage", updateOrderBadge);
      window.removeEventListener("orderUpdate", updateOrderBadge);
    };
  }, [updateOrderBadge]);

  // ✅ close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // ✅ ESC closes drawer
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    // if you store admin user info, clear it too:
    // localStorage.removeItem("adminUser");
    navigate("/"); // ✅ go home
  };

  const SidebarContent = (
    <aside className="flex flex-col h-full bg-transparent text-white font-sans">
      {/* BRAND HEADER */}
      <div className="p-8 border-b border-white/5">
        <div
          className="flex flex-col cursor-pointer group"
          onClick={() => navigate("/admin")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/admin")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500">
              <Leaf className="text-emerald-500" size={16} />
            </div>
            <span className="text-white font-light tracking-[0.2em] text-lg uppercase italic">
              Estate<span className="text-emerald-500">.</span>
            </span>
          </div>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-3 ml-1">
            Global Curators
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="grow px-4 py-6 overflow-y-auto no-scrollbar">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="mb-8">
            <p className="px-4 mb-4 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    cx(
                      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500 group",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.03]",
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      {item.name}
                    </span>
                  </div>

                  {item.name === "Orders" && orderCount > 0 && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                      {orderCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* SETTINGS ACCORDION */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => setIsSettingsOpen((v) => !v)}
            className={cx(
              "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500",
              isOnSettings || isSettingsOpen
                ? "bg-white/[0.03] text-white"
                : "text-white/50 hover:text-white hover:bg-white/[0.03]",
            )}
          >
            <div className="flex items-center gap-4">
              <SettingsIcon
                size={16}
                className={isOnSettings ? "text-emerald-400" : ""}
              />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                Settings
              </span>
            </div>

            <ChevronDown
              size={14}
              className={cx(
                "transition-transform duration-500",
                isSettingsOpen ? "rotate-180 text-emerald-500" : "",
              )}
            />
          </button>

          <div
            className={cx(
              "overflow-hidden transition-all duration-700",
              isSettingsOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="mt-2 space-y-1 ml-6 border-l border-white/5">
              {SETTINGS_ITEMS.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={`/admin/settings/${sub.path}`}
                  className={({ isActive }) =>
                    cx(
                      "flex items-center gap-3 px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300",
                      isActive
                        ? "text-emerald-400"
                        : "text-white/30 hover:text-white",
                    )
                  }
                >
                  <sub.icon size={14} className="opacity-80" />
                  {sub.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-emerald-400 transition-all w-full group"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">
            Back to Store
          </span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full mt-2"
        >
          <LogOut size={16} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ✅ Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#040d0a]/80 backdrop-blur border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/admin")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/admin")}
          >
            <Leaf className="text-emerald-500" size={16} />
            <span className="text-white text-[11px] font-black tracking-[0.25em] uppercase">
              Estate
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-red-300/80 hover:text-red-300 hover:bg-red-500/10 transition"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden lg:block h-full">{SidebarContent}</div>

      {/* ✅ Mobile Drawer + Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* overlay */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-black/60"
            aria-label="Close overlay"
          />

          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-[340px] bg-[#040d0a] border-r border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Leaf className="text-emerald-500" size={18} />
                <span className="text-white text-[11px] font-black tracking-[0.25em] uppercase">
                  Admin
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] transition"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* render same sidebar inside drawer */}
            <div className="h-[calc(100%-64px)]">{SidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
