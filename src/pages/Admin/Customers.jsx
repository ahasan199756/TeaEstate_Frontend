import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Mail, Phone, MapPin, Search, 
  User, Trash2, Edit3, UserPlus, 
  Ban, X, ShoppingBag, DollarSign, Clock,
  ChevronRight, Calendar, ShieldCheck, ShieldAlert
} from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', status: 'Active'
  });

  // LIGHT GLASSMORPHISM STYLE TOKENS
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]";
  const glassInput = "bg-white/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all outline-none shadow-inner";

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('teaUsers') || '[]');
    setCustomers(savedUsers);
  }, []);

  const saveToStorage = (updatedList) => {
    setCustomers(updatedList);
    localStorage.setItem('teaUsers', JSON.stringify(updatedList));
  };

  const openDetail = (customer) => {
    const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const filtered = allOrders.filter(order => 
      order.customerEmail === customer.email || order.customerName === customer.name
    ); 
    setCustomerOrders(filtered);
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      const updated = customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c);
      saveToStorage(updated);
    } else {
      const newUser = { 
        ...formData, 
        id: Date.now(), 
        createdAt: new Date().toISOString(), 
        role: 'customer' 
      };
      saveToStorage([...customers, newUser]);
    }
    closeModal();
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Permanently remove this customer record?")) {
      saveToStorage(customers.filter(c => c.id !== id));
    }
  };

  const toggleBlock = (id) => {
    const updated = customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'Blocked' ? 'Active' : 'Blocked' } : c
    );
    saveToStorage(updated);
  };

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ 
        name: customer.name, 
        email: customer.email, 
        phone: customer.phone, 
        address: customer.address, 
        status: customer.status || 'Active' 
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
    setIsDetailOpen(false); 
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative pb-20">
      
      {/* HEADER - Updated to Black Text */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Client Database</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
            CRM <span className="text-emerald-500 font-light italic lowercase tracking-normal">Terminal</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ACCOUNTS..."
              className={`${glassInput} w-full rounded-2xl py-4 pl-12 pr-4 text-slate-900 text-[11px] font-black tracking-widest uppercase placeholder:text-slate-300`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-600/20"
          >
            <UserPlus size={18} /> New Account
          </button>
        </div>
      </header>

      {/* CUSTOMER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className={`${glassCard} rounded-[40px] p-8 hover:bg-white/90 transition-all relative group cursor-pointer`}
            onClick={() => openDetail(customer)}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-[24px] ${customer.status === 'Blocked' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'} flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}>
                  <User size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{customer.name}</h3>
                  <div className="flex items-center gap-2">
                    {customer.status === 'Blocked' ? <ShieldAlert size={12} className="text-rose-500"/> : <ShieldCheck size={12} className="text-emerald-600"/>}
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${customer.status === 'Blocked' ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {customer.status || 'Verified Account'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS - Dark Icons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleBlock(customer.id)} className="p-3 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 rounded-xl transition-all"><Ban size={16} /></button>
                <button onClick={() => openModal(customer)} className="p-3 bg-slate-100 hover:bg-blue-500 hover:text-white text-slate-500 rounded-xl transition-all"><Edit3 size={16} /></button>
                <button onClick={() => deleteCustomer(customer.id)} className="p-3 bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-500 rounded-xl transition-all"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest"><Mail size={12}/> Primary Contact</p>
                <p className="text-slate-800 text-xs font-bold font-mono tracking-tight lowercase">{customer.email}</p>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="flex items-center sm:justify-end gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest"><Phone size={12}/> Secure Line</p>
                <p className="text-slate-800 text-xs font-bold tracking-widest">{customer.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL SIDE-OVER (Light Theme) */}
      {isDetailOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border-l border-white h-screen shadow-2xl overflow-y-auto">
            <button onClick={closeModal} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-all">
              <X size={24}/>
            </button>
            
            <div className="p-10 lg:p-14 space-y-12">
              <header className="flex items-center gap-8">
                <div className="w-24 h-24 bg-emerald-600 rounded-[35px] flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                  <User size={48} strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedCustomer.name}</h2>
                  <p className="bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">Authorized Account</p>
                </div>
              </header>

              <div className="grid grid-cols-3 gap-5">
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-center">
                  <ShoppingBag className="text-emerald-600 mx-auto mb-3" size={20} />
                  <p className="text-2xl font-black text-slate-900 italic">{customerOrders.length}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Orders</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-center">
                  <DollarSign className="text-emerald-600 mx-auto mb-3" size={20} />
                  <p className="text-2xl font-black text-slate-900 italic">৳{customerOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0).toLocaleString()}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Spent</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-center">
                  <Clock className="text-blue-600 mx-auto mb-3" size={20} />
                  <p className="text-2xl font-black text-slate-900 italic">{selectedCustomer.status || 'Active'}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase">State</p>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-4">Logistics <div className="h-[1px] flex-grow bg-slate-100" /></h4>
                <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 flex gap-4">
                  <MapPin className="text-emerald-600" size={18}/>
                  <p className="text-slate-700 text-sm italic font-medium">{selectedCustomer.address}</p>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-4">Activity Stream <div className="h-[1px] flex-grow bg-slate-100" /></h4>
                <div className="space-y-3">
                  {customerOrders.map(order => (
                    <div key={order.id} className="bg-white border border-slate-100 p-5 rounded-3xl flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Order Ref: {order.id.toString().slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.date}</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-emerald-600 italic tracking-tighter">৳{Number(order.total).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (Light Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-white border border-white w-full max-w-xl rounded-[50px] p-12 relative shadow-2xl scale-in-center">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"><X size={32}/></button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                {editingCustomer ? 'Update Profile' : 'New Account'} <span className="text-emerald-600 lowercase tracking-normal">manifest</span>
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input required className={`${glassInput} w-full p-5 rounded-[24px] text-slate-900 text-sm font-bold`} placeholder="FULL NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="email" className={`${glassInput} w-full p-5 rounded-[24px] text-slate-900 text-sm font-bold`} placeholder="EMAIL AXIS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required className={`${glassInput} w-full p-5 rounded-[24px] text-slate-900 text-sm font-bold`} placeholder="PHONE LINE" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <textarea required className={`${glassInput} w-full p-5 rounded-[24px] text-slate-900 text-sm font-bold h-32 resize-none`} placeholder="LOGISTICS ADDRESS" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <button className="w-full bg-slate-900 py-6 rounded-[28px] font-black uppercase text-[11px] tracking-[0.3em] text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-200">
                {editingCustomer ? 'Commit Changes' : 'Initialize Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;