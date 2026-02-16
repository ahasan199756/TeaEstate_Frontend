import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Truck, Check, Trash2, Eye, Search, Package,
  Box, BarChart3, Activity, XCircle, ChevronRight
} from "lucide-react";

/* --- LUXE DESIGN TOKENS --- */
const glassPanel = "bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 hover:border-emerald-500/20";
const labelText = "text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]";
const STORAGE_KEY = "customerOrders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ============================= */
  /* LOAD ORDERS (MAINTAINED LOGIC)*/
  /* ============================= */
  const loadOrders = useCallback(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const sorted = [...parsed].sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to parse orders", err);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    window.addEventListener("storage", loadOrders);
    window.addEventListener("orderUpdate", loadOrders);
    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("orderUpdate", loadOrders);
    };
  }, [loadOrders]);

  /* ============================= */
  /* UPDATE STATUS (MAINTAINED)    */
  /* ============================= */
  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOrders(updated);
    window.dispatchEvent(new Event("orderUpdate"));
  };

  /* ============================= */
  /* DELETE ORDER (MAINTAINED)    */
  /* ============================= */
  const deleteOrder = (orderId) => {
    if (!window.confirm("Archive this order?")) return;
    const updated = orders.filter((order) => order.id !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOrders(updated);
  };

  /* ============================= */
  /* FILTERING (MAINTAINED)       */
  /* ============================= */
  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === "All" || order.status === filter;
      const matchesSearch =
        order.customerName?.toLowerCase().includes(term) ||
        order.id?.toString().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchTerm]);

  /* ============================= */
  /* METRICS (MAINTAINED)         */
  /* ============================= */
  const metrics = useMemo(() => {
    const revenue = filteredOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );
    const active = orders.filter((o) => o.status !== "Delivered").length;
    return { totalOrders: filteredOrders.length, revenue, active };
  }, [filteredOrders, orders]);

  const formatCurrency = (val) => `৳${Number(val || 0).toLocaleString()}`;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedOrder(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="w-full space-y-10">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-light italic uppercase tracking-tighter text-white">
            ORDER <span className="text-emerald-500 font-bold not-italic">MANIFESTS</span>
          </h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.5em] mt-2">Logistics Control Center</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={14} />
            <input
              type="text"
              placeholder="SEARCH BY ID OR NAME..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-[0.2em] w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {["All", "Pending", "Shipped", "Delivered"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  filter === f ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Orders" value={metrics.totalOrders} icon={<Activity size={18} />} />
        <MetricCard label="Gross Revenue" value={formatCurrency(metrics.revenue)} icon={<BarChart3 size={18} />} />
        <MetricCard label="Active Manifests" value={metrics.active} icon={<Box size={18} />} />
      </div>

      {/* MOBILE CARDS (HIDDEN ON LG) */}
      <div className="space-y-4 lg:hidden">
        {filteredOrders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
            setSelectedOrder={setSelectedOrder}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className={`${glassPanel} hidden lg:block`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className={`p-6 ${labelText}`}>Tracking ID</th>
              <th className={`p-6 ${labelText}`}>Customer</th>
              <th className={`p-6 ${labelText} text-center`}>Status</th>
              <th className={`p-6 ${labelText} text-right`}>Valuation</th>
              <th className={`p-6 ${labelText} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-mono text-[11px] text-white/60">
                   #{(order.id || "").toString().slice(-8).toUpperCase()}
                </td>
                <td className="p-6 text-sm font-bold text-white/90">{order.customerName}</td>
                <td className="p-6 text-center"><StatusBadge status={order.status} /></td>
                <td className="p-6 text-right font-mono text-emerald-400 font-bold">{formatCurrency(order.total)}</td>
                <td className="p-6 flex justify-center gap-2">
                  <ActionButton icon={<Eye size={14} />} onClick={() => setSelectedOrder(order)} />
                  <ActionButton icon={<Truck size={14} />} onClick={() => updateStatus(order.id, "Shipped")} />
                  <ActionButton icon={<Check size={14} />} onClick={() => updateStatus(order.id, "Delivered")} variant="emerald" />
                  <ActionButton icon={<Trash2 size={14} />} onClick={() => deleteOrder(order.id)} variant="danger" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} formatCurrency={formatCurrency} />
      )}
    </div>
  );
};

/* --- SUB COMPONENTS --- */

const MetricCard = ({ label, value, icon }) => (
  <div className={`${glassPanel} p-8 group`}>
    <div className="flex justify-between items-start mb-4">
      <p className={labelText}>{label}</p>
      <div className="text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
    </div>
    <h2 className="text-3xl font-black tracking-tight text-white">{value}</h2>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-full ${styles[status] || styles.Pending}`}>
      {status || "Pending"}
    </span>
  );
};

const ActionButton = ({ icon, onClick, variant = "default" }) => {
  const styles = {
    default: "bg-white/5 text-white/40 hover:text-white hover:bg-white/10",
    emerald: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black",
    danger: "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${styles[variant]}`}>
      {icon}
    </button>
  );
};

const MobileOrderCard = ({ order, updateStatus, deleteOrder, setSelectedOrder, formatCurrency }) => (
  <div className={`${glassPanel} p-6`}>
    <div className="flex justify-between items-center mb-4">
      <span className="font-mono text-[10px] text-white/40">#{(order.id || "").slice(-8).toUpperCase()}</span>
      <StatusBadge status={order.status} />
    </div>
    <p className="font-bold text-white text-lg">{order.customerName}</p>
    <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest mt-1 mb-4">{order.date}</p>
    <p className="text-xl font-black text-white mb-6">{formatCurrency(order.total)}</p>
    <div className="flex gap-2">
      <ActionButton icon={<Eye size={16} />} onClick={() => setSelectedOrder(order)} />
      <ActionButton icon={<Truck size={16} />} onClick={() => updateStatus(order.id, "Shipped")} />
      <ActionButton icon={<Check size={16} />} onClick={() => updateStatus(order.id, "Delivered")} variant="emerald" />
      <ActionButton icon={<Trash2 size={16} />} onClick={() => deleteOrder(order.id)} variant="danger" />
    </div>
  </div>
);

const OrderModal = ({ order, onClose, formatCurrency }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[100]" onClick={onClose}>
    <div className={`${glassPanel} w-full max-w-2xl bg-[#010801]/90 p-10 relative`} onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><XCircle size={24} /></button>
      
      <div className="mb-10">
        <p className={labelText}>Shipment Manifest Details</p>
        <h2 className="text-3xl font-light italic text-white uppercase mt-2">
          Order <span className="text-emerald-500 font-bold not-italic">#{(order.id || "").slice(-8).toUpperCase()}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-white/5 py-8 mb-8">
        <div>
          <p className={labelText + " mb-2"}>Customer Entity</p>
          <p className="text-white font-bold">{order.customerName}</p>
          <p className="text-white/40 text-xs mt-1">{order.email}</p>
        </div>
        <div>
          <p className={labelText + " mb-2"}>Valuation</p>
          <p className="text-emerald-400 font-mono text-xl font-bold">{formatCurrency(order.total)}</p>
        </div>
        <div className="col-span-1 md:col-span-2">
          <p className={labelText + " mb-2"}>Destination</p>
          <p className="text-white/70 text-sm leading-relaxed italic">"{order.address || "No address provided"}"</p>
        </div>
      </div>

      <button onClick={onClose} className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
        Close Entry
      </button>
    </div>
  </div>
);

export default Orders;