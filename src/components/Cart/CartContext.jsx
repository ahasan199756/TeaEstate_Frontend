import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("tea_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("tea_cart", JSON.stringify(cart));
  }, [cart]);

  // --- FIXED LOGIC: Respects incoming quantity ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      
      // Determine how many we are adding (default to 1 if not specified)
      const amountToAdd = product.quantity || 1;

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + amountToAdd } 
            : item
        );
      }
      // If new, spread the product (which now includes the correct price and quantity)
      return [...prev, { ...product, quantity: amountToAdd }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("tea_cart");
  };

  // --- CALCULATIONS (Fixed to ensure numbers) ---
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price || item.basePrice || 0);
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart, 
        totalItems, 
        subtotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);