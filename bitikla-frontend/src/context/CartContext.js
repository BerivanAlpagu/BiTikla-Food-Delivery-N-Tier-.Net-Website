import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, restId) => {
    if (restaurantId && restaurantId !== restId) {
      if (!window.confirm('Farklı restorandan ürün eklemek sepeti temizler. Devam?')) return;
      setCart([]);
    }
    setRestaurantId(restId);
    setCart(prev => {
      const existing = prev.find(x => x.id === item.id);
      if (existing) {
        return prev.map(x => x.id === item.id
          ? { ...x, quantity: x.quantity + 1 }
          : x
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const updated = prev.map(x => x.id === itemId
        ? { ...x, quantity: x.quantity - 1 }
        : x
      ).filter(x => x.quantity > 0);
      if (updated.length === 0) setRestaurantId(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
  };

  const totalItems = cart.reduce((sum, x) => sum + x.quantity, 0);
  const totalPrice = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, restaurantId,
      addToCart, removeFromCart, clearCart,
      totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}