import { IoClose, IoTrashOutline, IoAdd, IoRemove, IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  // Pull dynamic currency from Admin Settings
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '৳' };

  const handleCheckout = () => {
    onClose(); 
    navigate("/checkout");
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity duration-700 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={onClose} 
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#040d0a] text-white z-[101] shadow-[0_0_100px_rgba(0,0,0,0.5)] border-l border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-10">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Your <span className="text-emerald-500">Bag</span></h2>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">{cart.length} Items Selected</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
              <IoClose size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                  <IoBagHandleOutline size={40} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">The collection is empty</p>
                  <button onClick={onClose} className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 border-b border-emerald-500/30 pb-1 hover:border-emerald-500 transition-all">
                    Browse Estate
                  </button>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white/[0.03] p-5 rounded-[32px] border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-black uppercase text-xs tracking-wider text-white/90 leading-tight">{item.name}</h4>
                      <p className="text-emerald-500 font-mono text-sm font-bold mt-1">
                        {config.currency}{Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                        <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-500 hover:text-black transition-all">
                          <IoRemove size={12} />
                        </button>
                        <span className="px-3 text-xs font-black font-mono w-8 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-500 hover:text-black transition-all">
                          <IoAdd size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-white/10 hover:text-red-500 transition-colors p-2">
                        <IoTrashOutline size={18}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Total */}
          {cart.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">Subtotal</span>
                  <p className="text-[9px] text-white/40 uppercase mt-1">Excluding Shipping</p>
                </div>
                <span className="text-5xl font-black text-white tracking-tighter font-mono italic">
                  <span className="text-emerald-500 text-2xl not-italic mr-1">{config.currency}</span>
                  {Number(subtotal || 0).toLocaleString()}
                </span>
              </div>
              <button onClick={handleCheckout} className="w-full py-7 bg-emerald-500 text-black rounded-[24px] font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(16,185,129,0.2)]">
                Checkout Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;