import { IoClose, IoTrashOutline, IoAdd, IoRemove } from "react-icons/io5";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom"; // Import for navigation

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  // Pull dynamic currency from your Admin Settings
  const config = JSON.parse(localStorage.getItem('siteConfig')) || { currency: '$' };

  const handleCheckout = () => {
    onClose(); // Close the drawer first for a smooth transition
    navigate("/checkout");
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={onClose} 
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-green-950 text-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Your Bag</h2>
            <button onClick={onClose} className="text-white hover:rotate-90 transition-transform">
              <IoClose size={32} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-white/40 italic">Your bag is empty...</p>
                <button 
                  onClick={onClose}
                  className="text-xs font-bold uppercase tracking-widest text-green-400 border-b border-green-400 pb-1"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 group">
                  <img src={item.img} className="w-20 h-20 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-green-400 font-bold">{config.currency}{item.price}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:text-green-400 transition-colors">
                          <IoRemove size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-green-400 transition-colors">
                          <IoAdd size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
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
            <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-end mb-6">
                <span className="text-white/50 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                <span className="text-4xl font-black text-green-400">{config.currency}{subtotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-5 bg-white text-green-950 rounded-full font-black uppercase tracking-widest hover:bg-green-400 hover:text-green-950 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
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