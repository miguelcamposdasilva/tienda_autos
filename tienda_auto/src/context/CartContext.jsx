import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const KEY = 'carrito';
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(KEY) || '[]'));

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = (name, price) => {
    setItems(prev => {
      const i = prev.findIndex(it => it.name === name && it.price === price);
      if (i >= 0) { const copy = [...prev]; copy[i].qty += 1; return copy; }
      return [...prev, { name, price, qty: 1 }];
    });
  };
  const removeAt = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, removeAt, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
