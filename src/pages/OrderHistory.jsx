import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, ExternalLink, Coffee } from 'lucide-react';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from a database/localStorage
    const fetchOrders = () => {
      const mockOrders = [
        {
          id: "ORD-9921",
          date: "Oct 24, 2025",
          total: 84.00,
          status: "Delivered",
          items: ["Misty Mountain Green", "Silver Needle White"]
        },
        {
          id: "ORD-8842",
          date: "Jan 12, 2026",
          total: 32.50,
          status: "In Transit",
          items: ["Golden Oolong"]
        }
      ];
      
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 800);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#062016] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#062016] pt-32 pb-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs mb-2">Account Dashboard</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
              Order <span className="text-emerald-500/50">History</span>
            </h1>
          </div>
          <Link to="/products" className="bg-white/5 hover:bg-emerald-500 hover:text-black transition-all px-8 py-3 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-20 text-center">
            <Package size={60} className="mx-auto text-emerald-500/20 mb-6" />
            <h3 className="text-2xl font-bold uppercase text-white">No collections found</h3>
            <p className="text-white/40 mt-2 mb-8">You haven't placed any orders yet.</p>
            <Link to="/products" className="text-emerald-400 border-b border-emerald-400 pb-1 font-bold">Browse our Estates</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-8 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Total</th>
                    <th className="px-8 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 font-mono text-sm font-bold text-white/90">{order.id}</td>
                      <td className="px-8 py-6 text-sm text-white/60">{order.date}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-white">${order.total.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right">
                        {/* CONNECTED LINK TO DETAIL PAGE */}
                        <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors group/btn">
                          <span className="text-[10px] font-black tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">VIEW DETAIL</span>
                          <ExternalLink size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <Link 
                  to={`/orders/${order.id}`} 
                  key={order.id} 
                  className="block bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 active:scale-95 transition-transform"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-emerald-400">{order.id}</span>
                    <span className="text-[10px] font-black uppercase text-white/40">{order.date}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-[10px] text-white/40 uppercase mt-1">{order.items.join(", ")}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* HELP SECTION */}
        <div className="mt-16 flex flex-col md:flex-row items-center gap-8 p-10 rounded-[40px] bg-gradient-to-br from-emerald-900/20 to-transparent border border-white/5">
          <div className="bg-emerald-500/10 p-4 rounded-2xl">
            <Coffee className="text-emerald-400" size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold uppercase tracking-wide">Need help with an order?</h4>
            <p className="text-white/40 text-sm mt-1">Our tea sommeliers are available 24/7 to assist with your delivery or steep questions.</p>
          </div>
          <Link to="/contact" className="md:ml-auto text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-400/30 hover:border-emerald-400 pb-1">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;