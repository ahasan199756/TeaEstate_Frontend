import {
  IoClose,
  IoTrashOutline,
  IoAdd,
  IoRemove,
  IoBagHandleOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "./useCart";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, subtotal } =
    useCart();

  const navigate = useNavigate();

  const config = JSON.parse(localStorage.getItem("siteConfig")) || {
    currency: "৳",
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.selectedSize);
    toast.error(`${item.name} removed from bag`);
  };

  const handleQtyChange = (item, type) => {
    const size = item.selectedSize || "default";
    const stockCap = Number(item.stockAtAdd ?? Infinity);

    if (type === "inc") {
      // Optional: prevent going over stock cap
      if (item.quantity >= stockCap) {
        toast.error("No more stock for this size", { duration: 1200 });
        return;
      }
      increaseQuantity(item.id, size);
      toast.success("Quantity increased", { duration: 900 });
    } else {
      decreaseQuantity(item.id, size);
      toast.success("Quantity decreased", { duration: 900 });
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity duration-700 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#040d0a] text-white z-[101] shadow-[0_0_100px_rgba(0,0,0,0.5)] border-l border-white/5 transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
              Your <span className="text-emerald-500">Bag</span>
            </h2>

            <button
              onClick={onClose}
              className="hover:rotate-90 transition-transform duration-300"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center mt-20 text-white/30">
                <IoBagHandleOutline size={40} className="mx-auto" />
                <p className="mt-4">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => {
                const size = item.selectedSize || "default";
                const stockCap = Number(item.stockAtAdd ?? Infinity);
                const disableInc = item.quantity >= stockCap;
                const disableDec = item.quantity <= 1;

                return (
                  <div
                    key={`${item.id}__${size}`} // ✅ key includes size
                    className="flex gap-6 bg-white/[0.03] p-5 rounded-[32px] border border-white/5"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        {item.name}
                      </h4>

                      {/* ✅ Show size */}
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mt-1">
                        Size: {size}
                      </p>

                      <p className="text-emerald-500 mt-2 font-mono">
                        {config.currency}
                        {Number(item.price || 0).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-4 bg-black/20 w-fit rounded-full border border-white/5">
                        <button
                          onClick={() => handleQtyChange(item, "dec")}
                          disabled={disableDec}
                          className="px-3 py-1 hover:text-emerald-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <IoRemove />
                        </button>

                        <span className="px-2 text-sm font-bold min-w-[24px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleQtyChange(item, "inc")}
                          disabled={disableInc}
                          className="px-3 py-1 hover:text-emerald-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={
                            stockCap !== Infinity && disableInc
                              ? "Reached stock limit"
                              : ""
                          }
                        >
                          <IoAdd />
                        </button>
                      </div>

                      {/* ✅ Optional little stock hint */}
                      {stockCap !== Infinity &&
                        stockCap > 0 &&
                        stockCap <= 3 && (
                          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300/80">
                            Only {stockCap} left for {size}
                          </p>
                        )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-500 transition-all duration-200 hover:text-red-500 hover:scale-125 active:scale-90 self-start mt-2"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="mt-8 border-t border-white/5 pt-8">
              <div className="flex justify-between mb-6 text-xl font-bold uppercase tracking-tighter">
                <span className="text-white/50">Subtotal</span>
                <span>
                  {config.currency}
                  {Number(subtotal).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase py-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
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
