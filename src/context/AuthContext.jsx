import { createContext, useContext, useState, useEffect } from 'react';
import { farmers, merchants, transporters } from '../data/mockData';

const AuthContext = createContext(null);

const ALL_USERS = [...farmers, ...merchants, ...transporters];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('miabe_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const current = ALL_USERS.find(u => u.id === parsed.id);
        if (current) return { ...parsed, avatar: current.avatar };
        return parsed;
      }
      return null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('miabe_user', JSON.stringify(user));
    else localStorage.removeItem('miabe_user');
  }, [user]);

  const login = (email, password) => {
    const found = ALL_USERS.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { success: true }; }
    return { success: false, error: 'Identifiants incorrects.' };
  };

  const register = (data) => {
    const newUser = {
      id: `${data.role[0]}${Date.now()}`,
      ...data,
      rating: 0, reviews: 0, verified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=2a7a45&color=fff&size=100`,
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
