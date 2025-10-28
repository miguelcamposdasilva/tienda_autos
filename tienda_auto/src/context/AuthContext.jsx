import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const KEY = 'usuario';
  const [email, setEmail] = useState(() => localStorage.getItem(KEY));

  useEffect(() => {
    if (email) localStorage.setItem(KEY, email); else localStorage.removeItem(KEY);
  }, [email]);

  const login = (e) => setEmail(e);
  const logout = () => setEmail(null);

  return <AuthContext.Provider value={{ email, login, logout }}>{children}</AuthContext.Provider>;
}
