import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const KEY = 'carrito';
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(KEY) || '[]'));

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  // add by id (id, name, price)
  const add = (id, name, price) => {
    setItems(prev => {
      const i = prev.findIndex(it => it.id === id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
  };

  const inc = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, qty: it.qty + 1 } : it));
  const dec = (id) => setItems(prev => {
    const i = prev.findIndex(it => it.id === id);
    if (i === -1) return prev;
    const copy = [...prev];
    if (copy[i].qty <= 1) {
      // remove item
      copy.splice(i, 1);
      return copy;
    }
    copy[i] = { ...copy[i], qty: copy[i].qty - 1 };
    return copy;
  });

  const remove = (id) => setItems(prev => prev.filter(it => it.id !== id));
  // keep removeAt for compatibility (index-based)
  const removeAt = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, inc, dec, remove, removeAt, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
