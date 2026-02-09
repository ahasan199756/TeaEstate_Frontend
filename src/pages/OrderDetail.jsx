import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  IoArrowBack, 
  IoPrintOutline, 
  IoLocationOutline, 
  IoTimeOutline, 
  IoWalletOutline, 
  IoBagHandleOutline,
  IoCloseOutline,
  IoCardOutline,
  IoPhonePortraitOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  
  // UI States
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);

  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  useEffect(() => {
    const fetchOrderDetails = () => {
      const allOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
      const foundOrder = allOrders.find(o => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        console.error("Manifest not found.");
      }
    };
    fetchOrderDetails();
  }, [id]);

  /**
   * ACTUAL REDIRECTION LOGIC
   * This sends the order ID to your server to get a secure payment URL
   */
  const handleFinalPayment = async () => {
    if (!selectedGateway) return;
    
    setIsProcessing(true);

    try {
      // Replace this URL with your actual Backend API endpoint
      const response = await fetch('https://your-backend-api.com/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          gatewayType: selectedGateway, // e.g., 'bkash' or 'sslcommerz'
          totalAmount: order.total
        }),
      });

      const data = await response.json();

      if (data.url) {
        // ACTUAL REDIRECTION to bKash/SSLCommerz/Stripe
        window.location.href = data.url; 
      } else {
        throw new Error("Gateway URL not found");
      }
    } catch (error) {
      console.error("Payment Handshake Failed:", error);
      alert("System Link Failure: Could not connect to the payment gateway.");
      setIsProcessing(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
        <div className="text-emerald-500 font-black uppercase tracking-[0.5em] animate-pulse">
          Accessing Ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040d0a] pt-32 pb-20 px-6 lg:px-16 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* TOP NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <button onClick={() => navigate('/orders')} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
            <IoArrowBack className="text-lg group-hover:-translate-x-1 transition-transform" /> 
            Back to Manifests
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 px-6 py-3 rounded-full hover:bg-white/5">
            <IoPrintOutline size={18} /> Print Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: ORDER ITEMS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md">
              <div className="p-10 border-b border-white/5 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Order Manifest</p>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic">Items <span className="text-white/40">Secured</span></h2>
                </div>
                <span className="font-mono text-sm text-white/20 font-bold">{order.id}</span>
              </div>
              
              <div className="p-10 space-y-8">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-8 group">
                    <div className="w-24 h-24 rounded-[24px] overflow-hidden border border-white/10 bg-white/5">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-black uppercase text-sm tracking-widest text-white/80">{item.name}</h3>
                      <p className="text-white/20 text-[10px] font-black uppercase mt-2 tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-500">
                        {config.currency}{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-black/40 space-y-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Subtotal</span>
                  <span className="font-mono">{config.currency}{order.subtotal?.toLocaleString() || (order.total - (order.shipping || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Logistics Fee</span>
                  <span className="font-mono">+{config.currency}{order.shipping?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-white/10">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500">Total Investment</span>
                  <span className="text-5xl font-black font-mono tracking-tighter text-white">
                    {config.currency}{order.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LOGISTICS & PAYMENT ACTION */}
          <div className="space-y-6">
            <div className="bg-emerald-500 text-black p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <IoTimeOutline size={24} />
                  <span className="font-black uppercase text-[10px] tracking-[0.3em]">Harvest Status</span>
                </div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{order.status}</h3>
                <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em]">{order.date}</p>
              </div>
              <IoBagHandleOutline size={120} className="absolute -bottom-4 -right-4 text-black/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] space-y-10 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-3 text-emerald-500 mb-4">
                  <IoLocationOutline size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Delivery Estate</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-bold uppercase tracking-tighter">
                  {order.customerName}<br />{order.address}
                </p>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-emerald-500 mb-4">
                  <IoWalletOutline size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Payment Method</span>
                </div>
                
                {order.paymentMethod !== 'cod' ? (
                  <button 
                    onClick={() => setShowPaymentOptions(true)}
                    className="w-full text-left group p-5 border border-emerald-500/30 rounded-3xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
                  >
                    <p className="text-xs text-emerald-400 font-black uppercase tracking-widest group-hover:text-white transition-colors italic underline underline-offset-4">
                      Complete Online Payment
                    </p>
                    <p className="text-[9px] text-white/30 uppercase mt-2 tracking-widest font-bold">Encrypted Gateway Ready</p>
                  </button>
                ) : (
                  <p className="text-xs text-white/60 font-black uppercase tracking-widest italic">Cash on Delivery</p>
                )}
              </div>

              <button onClick={() => navigate('/products')} className="w-full bg-white text-black py-6 rounded-[24px] font-black text-[10px] tracking-[0.3em] uppercase hover:bg-emerald-500 transition-all active:scale-95">
                Reorder Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT GATEWAY MODAL --- */}
      {showPaymentOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
          {/* Close modal by clicking outside, unless processing */}
          <div className="absolute inset-0" onClick={() => !isProcessing && setShowPaymentOptions(false)} />
          
          <div className="relative w-full max-w-lg bg-[#0a1411] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-emerald-500/5">
              <div className="flex items-center gap-3 text-emerald-500">
                <IoShieldCheckmarkOutline size={24} />
                <h3 className="font-black uppercase tracking-tighter text-xl italic">Secure Handshake</h3>
              </div>
              {!isProcessing && (
                <button onClick={() => setShowPaymentOptions(false)} className="text-white/40 hover:text-white transition-colors">
                  <IoCloseOutline size={28} />
                </button>
              )}
            </div>

            {/* Gateway Selection */}
            <div className="p-8 space-y-4">
              <button 
                onClick={() => setSelectedGateway('mobile')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${selectedGateway === 'mobile' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
              >
                <div className="flex items-center gap-5 text-left">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${selectedGateway === 'mobile' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40'}`}>
                    <IoPhonePortraitOutline size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">Mobile Wallets</p>
                    <p className="text-[9px] text-white/20 uppercase mt-1">bKash, Nagad, Rocket</p>
                  </div>
                </div>
                {selectedGateway === 'mobile' && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />}
              </button>

              <button 
                onClick={() => setSelectedGateway('card')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${selectedGateway === 'card' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
              >
                <div className="flex items-center gap-5 text-left">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${selectedGateway === 'card' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40'}`}>
                    <IoCardOutline size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">Credit / Debit Card</p>
                    <p className="text-[9px] text-white/20 uppercase mt-1">Visa, Mastercard, Amex</p>
                  </div>
                </div>
                {selectedGateway === 'card' && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />}
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
              <div>
                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Authorized Amount</p>
                <p className="text-3xl font-black font-mono text-emerald-500">{config.currency}{order.total?.toLocaleString()}</p>
              </div>
              <button 
                disabled={isProcessing || !selectedGateway}
                onClick={handleFinalPayment}
                className="w-full md:w-auto px-12 py-5 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    Connecting...
                  </span>
                ) : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;