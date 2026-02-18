import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("tea_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Cart parse error:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tea_cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ helper: unique key per variant
  const getKey = (item) => `${item.id}__${item.selectedSize || "default"}`;

  // ✅ add to cart (merge by id + selectedSize)
  const addToCart = (product) => {
    const qtyToAdd = Math.max(1, Number(product.quantity || 1));
    const size = product.selectedSize || "default";

    setCart((prev) => {
      const key = `${product.id}__${size}`;
      const exists = prev.find((i) => getKey(i) === key);

      if (exists) {
        return prev.map((i) => {
          if (getKey(i) !== key) return i;

          // Optional: cap by stockAtAdd if provided
          const stockCap = Number(
            product.stockAtAdd ?? i.stockAtAdd ?? Infinity,
          );
          const nextQty = i.quantity + qtyToAdd;

          return {
            ...i,
            ...product, // keep latest price/name/img if updated
            selectedSize: size,
            quantity: Math.min(nextQty, stockCap),
            stockAtAdd: stockCap === Infinity ? undefined : stockCap,
          };
        });
      }

      const stockCap = Number(product.stockAtAdd ?? Infinity);
      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          quantity: Math.min(qtyToAdd, stockCap),
          stockAtAdd: stockCap === Infinity ? undefined : stockCap,
        },
      ];
    });
  };

  // ✅ "+" button (by id + selectedSize)
  const increaseQuantity = (id, selectedSize = "default") => {
    const key = `${id}__${selectedSize}`;
    setCart((prev) =>
      prev.map((i) => {
        if (getKey(i) !== key) return i;

        const stockCap = Number(i.stockAtAdd ?? Infinity);
        const nextQty = i.quantity + 1;

        return { ...i, quantity: Math.min(nextQty, stockCap) };
      }),
    );
  };

  // ✅ "-" button (min 1) (by id + selectedSize)
  const decreaseQuantity = (id, selectedSize = "default") => {
    const key = `${id}__${selectedSize}`;
    setCart((prev) =>
      prev.map((i) => {
        if (getKey(i) !== key) return i;
        return { ...i, quantity: Math.max(1, i.quantity - 1) };
      }),
    );
  };

  // ✅ remove one item (by id + selectedSize)
  const removeFromCart = (id, selectedSize = "default") => {
    const key = `${id}__${selectedSize}`;
    setCart((prev) => prev.filter((i) => getKey(i) !== key));
  };

  // ✅ clear all
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("tea_cart");
  };

  const totalItems = useMemo(
    () => cart.reduce((t, i) => t + Number(i.quantity || 0), 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (t, i) => t + Number(i.price || 0) * Number(i.quantity || 0),
        0,
      ),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
