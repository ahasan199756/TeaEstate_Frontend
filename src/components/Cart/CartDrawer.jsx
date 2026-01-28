import { IoClose, IoTrashOutline, IoAdd, IoRemove } from "react-icons/io5";
import { useCart } from "./CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, subtotal } = useCart();

  return (
    <>
      {/* Background Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose} />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-green-950 text-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Your Bag</h2>
            <button onClick={onClose} className="text-white hover:rotate-90 transition-transform"><IoClose size={32} /></button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {cart.length === 0 ? (
              <p className="text-white/40 italic">Your bag is empty...</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                  <img src={item.img} className="w-20 h-20 object-cover rounded-2xl" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-green-400 font-bold">${item.price}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-white/10 rounded-full px-2">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:text-green-400"><IoRemove /></button>
                        <span className="px-2 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-green-400"><IoAdd /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 transition-colors"><IoTrashOutline size={18}/></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Total */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-white/50 uppercase tracking-widest text-xs font-bold">Subtotal</span>
              <span className="text-4xl font-black text-green-400">${subtotal}</span>
            </div>
            <button className="w-full py-5 bg-white text-green-950 rounded-full font-black uppercase tracking-widest hover:bg-green-400 transition-colors active:scale-95">
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;