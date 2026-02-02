import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Users, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import StatCard from '../../components/Admin/StatCard';

const Dashboard = () => {
  const [data, setData] = useState({
    products: [],
    orders: []
  });

  useEffect(() => {
    // Fetch actual data from the source of truth
    const savedProducts = JSON.parse(localStorage.getItem('teaProducts') || '[]');
    const savedOrders = JSON.parse(localStorage.getItem('teaOrders') || '[]');
    
    setData({
      products: savedProducts,
      orders: savedOrders
    });
  }, []);

  // REAL CALCULATIONS
  const totalRevenue = data.orders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
  const totalOrders = data.orders.length;
  const activeInventory = data.products.length;
  
  // Inventory Health: Items with no description or no image
  const incompleteItems = data.products.filter(p => !p.description || !p.img).length;
  
  // Total Asset Value (Potential Revenue)
  const inventoryValue = data.products.reduce((acc, p) => acc + Number(p.price), 0);

  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Estate <span className="text-emerald-500">Command</span>
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium tracking-wide">
            System Operational • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Primary Metrics - All calculated from localStorage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-emerald-400"
        />
        <StatCard 
          title="Active Varieties" 
          value={activeInventory} 
          icon={Leaf} 
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${avgOrderValue}`} 
          icon={TrendingUp} 
          color="text-blue-400"
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={ShoppingBag} 
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Analysis */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[30px] p-8">
          <h3 className="text-white font-bold text-xl mb-6">Asset Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Potential Value</p>
              <p className="text-2xl text-white font-mono">${inventoryValue.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Listing Health</p>
              <p className={`text-2xl font-mono ${incompleteItems > 0 ? 'text-orange-400' : 'text-emerald-500'}`}>
                {incompleteItems === 0 ? "100%" : `${incompleteItems} Issues`}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Warning Card */}
        {incompleteItems > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-[30px] p-8 flex flex-col justify-between">
            <AlertTriangle className="text-orange-500" size={32} />
            <div>
              <h3 className="text-white font-black text-xl leading-tight uppercase">Optimization<br/>Required</h3>
              <p className="text-white/60 text-xs mt-2">{incompleteItems} products are missing details or images.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;