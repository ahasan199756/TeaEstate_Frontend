import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, MapPin, Search, 
  User, Trash2, Edit3, UserPlus, 
  Ban, X, ShoppingBag, DollarSign, Clock
} from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', status: 'Active'
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('teaUsers') || '[]');
    setCustomers(savedUsers);
  }, []);

  const saveToStorage = (updatedList) => {
    setCustomers(updatedList);
    localStorage.setItem('teaUsers', JSON.stringify(updatedList));
  };

  // --- VIEW DETAILS LOGIC ---
  const openDetail = (customer) => {
    // Fetch orders from our global order storage
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    // In a real app, you'd filter by customer.id or email
    // For this demo, we'll show all orders or filter by user name
    const filtered = allOrders.filter(order => order.customerEmail === customer.email || order.id); 
    
    setCustomerOrders(filtered);
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  // CREATE / UPDATE / DELETE / BLOCK (Existing Logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      const updated = customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c);
      saveToStorage(updated);
    } else {
      const newUser = { ...formData, id: Date.now(), createdAt: new Date().toISOString(), role: 'customer' };
      saveToStorage([...customers, newUser]);
    }
    closeModal();
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Are you sure?")) saveToStorage(customers.filter(c => c.id !== id));
  };

  const toggleBlock = (id) => {
    const updated = customers.map(c => c.id === id ? { ...c, status: c.status === 'Blocked' ? 'Active' : 'Blocked' } : c);
    saveToStorage(updated);
  };

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, status: customer.status || 'Active' });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setIsDetailOpen(false); };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
          <Users className="text-emerald-500" size={36} /> CRM Terminal
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => openModal()} className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all">
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className={`bg-white/5 border ${customer.status === 'Blocked' ? 'border-red-500/30' : 'border-white/10'} rounded-[35px] p-8 hover:bg-white/[0.08] transition-all relative group cursor-pointer`} onClick={() => openDetail(customer)}>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${customer.status === 'Blocked' ? 'bg-red-500' : 'bg-emerald-500'} flex items-center justify-center text-black shrink-0`}>
                  <User size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{customer.name}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${customer.status === 'Blocked' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {customer.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleBlock(customer.id)} className="p-3 bg-white/10 hover:bg-orange-500/20 text-orange-400 rounded-xl"><Ban size={16} /></button>
                <button onClick={() => openModal(customer)} className="p-3 bg-white/10 hover:bg-blue-500/20 text-blue-400 rounded-xl"><Edit3 size={16} /></button>
                <button onClick={() => deleteCustomer(customer.id)} className="p-3 bg-white/10 hover:bg-red-500/20 text-red-500 rounded-xl"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest"><Mail size={12}/> Email</p>
                <p className="text-white text-xs truncate">{customer.email}</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="flex items-center justify-end gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest"><Phone size={12}/> Phone</p>
                <p className="text-white text-xs">{customer.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CUSTOMER DETAIL SLIDE-OVER --- */}
{isDetailOpen && selectedCustomer && (
  <div className="fixed inset-0 z-[100] flex justify-end">
    {/* Backdrop - Clicks here close the panel */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={closeModal}
    />
    
    {/* Panel */}
    <div className="relative w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 h-screen shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar">
      
      {/* Close Button */}
      <button 
        onClick={closeModal} 
        className="absolute top-8 right-8 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all z-10"
      >
        <X size={24}/>
      </button>
      
      <div className="p-8 lg:p-12 space-y-10">
        {/* Header Profile */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <User size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              {selectedCustomer.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Customer Insight</p>
            </div>
          </div>
        </div>

        {/* Quick Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Email Address</p>
             <p className="text-white text-sm font-medium">{selectedCustomer.email}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Phone Number</p>
             <p className="text-white text-sm font-medium">{selectedCustomer.phone}</p>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl text-center">
            <ShoppingBag className="text-emerald-500 mx-auto mb-2" size={18} />
            <p className="text-xl font-black text-white">{customerOrders.length}</p>
            <p className="text-[8px] font-bold text-emerald-500/50 uppercase">Orders</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
            <DollarSign className="text-emerald-400 mx-auto mb-2" size={18} />
            <p className="text-xl font-black text-white">
              ${customerOrders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
            </p>
            <p className="text-[8px] font-bold text-white/20 uppercase">Spent</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-center">
            <Clock className="text-blue-400 mx-auto mb-2" size={18} />
            <p className="text-xl font-black text-white">Active</p>
            <p className="text-[8px] font-bold text-white/20 uppercase">Status</p>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            Recent Activity <div className="h-[1px] flex-grow bg-white/10" />
          </h4>
          <div className="space-y-3">
            {customerOrders.length > 0 ? customerOrders.map(order => (
              <div key={order.id} className="group bg-white/[0.02] hover:bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-emerald-500 transition-colors">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Order #{order.id.toString().slice(-6)}</p>
                    <p className="text-[10px] text-white/30 font-medium">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">${order.total?.toFixed(2)}</p>
                  <span className="text-[8px] font-bold uppercase text-white/40">{order.status}</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[30px]">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">History Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {/* ADD/EDIT MODAL (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative">
            <button onClick={closeModal} className="absolute top-6 right-6 text-white/20 hover:text-white"><X /></button>
            <h2 className="text-2xl font-black text-white uppercase mb-8">{editingCustomer ? 'Update Profile' : 'New Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="Phone" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <textarea required placeholder="Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 h-24 resize-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <button className="w-full bg-emerald-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-black">
                {editingCustomer ? 'Save Changes' : 'Create Customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;