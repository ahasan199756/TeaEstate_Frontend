import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage so items persist on refresh
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("tea_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tea_cart", JSON.stringify(cart));
  }, [cart]);

  // --- LOGIC: Add to Cart ---
  const addToCart = (product) => {
    setCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // --- LOGIC: Decrease Quantity ---
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
          : item
      )
    );
  };

  // --- LOGIC: Remove Item ---
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- LOGIC: Clear Cart (Call this after successful checkout) ---
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("tea_cart");
  };

  // --- CALCULATIONS ---
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart, // NEW
        totalItems, 
        subtotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);