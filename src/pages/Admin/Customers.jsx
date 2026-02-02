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

      {/* --- CUSTOMER DETAIL MODAL (THE CRM VIEW) --- */}
      {isDetailOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-[40px] max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-10">
            <button onClick={closeModal} className="absolute top-8 right-8 text-white/20 hover:text-white z-10"><X size={32}/></button>
            
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Profile Summary */}
                <div className="space-y-8">
                  <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-black">
                    <User size={48} strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{selectedCustomer.name}</h2>
                    <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mt-2">Verified Customer</p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <Mail className="text-emerald-500" size={18} /> {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <Phone className="text-emerald-500" size={18} /> {selectedCustomer.phone}
                    </div>
                    <div className="flex items-start gap-4 text-white/60 text-sm leading-relaxed">
                      <MapPin className="text-emerald-500 shrink-0" size={18} /> {selectedCustomer.address}
                    </div>
                  </div>
                </div>

                {/* Stats & Orders */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <ShoppingBag className="text-emerald-500 mb-4" size={20} />
                      <p className="text-2xl font-black text-white">{customerOrders.length}</p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Orders</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <DollarSign className="text-emerald-500 mb-4" size={20} />
                      <p className="text-2xl font-black text-white">
                        ${customerOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                      </p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Revenue</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <Clock className="text-emerald-500 mb-4" size={20} />
                      <p className="text-2xl font-black text-white">Active</p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Order History</h4>
                    <div className="space-y-2">
                      {customerOrders.length > 0 ? customerOrders.map(order => (
                        <div key={order.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-emerald-500/50 transition-colors">
                          <div>
                            <p className="text-xs font-mono font-bold text-white/80">{order.id}</p>
                            <p className="text-[10px] text-white/40 uppercase font-black">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-white">${order.total.toFixed(2)}</p>
                            <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{order.status}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl text-white/20 uppercase text-xs font-black tracking-widest">
                          No transaction history found
                        </div>
                      )}
                    </div>
                  </div>
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