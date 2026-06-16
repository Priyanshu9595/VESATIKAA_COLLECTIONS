import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load from local storage on mount
    const savedUser = localStorage.getItem('boutique_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password, isAdmin = false) => {
    // Mock login
    const newUser = { email, isAdmin, id: Date.now().toString() };
    setUser(newUser);
    localStorage.setItem('boutique_user', JSON.stringify(newUser));
  };

  const register = (email, password) => {
    // Mock registration (same as login for now)
    login(email, password, false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('boutique_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
