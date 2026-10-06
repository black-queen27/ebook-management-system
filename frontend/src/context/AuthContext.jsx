import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ebook_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default seed user matching Figma UI
    return {
      id: 1,
      name: 'Sharini',
      email: 'sharini@student.edu',
      role: 'Student',
      phone: '+91 98765 43210',
      college: 'Loyola ICAM College',
      course: 'B.Tech Information Technology',
      year_of_study: '2nd Year',
      department: 'Information Technology',
      date_of_birth: '14 August 2006',
      reading_preferences: 'Fiction,Technology,Self Development,Science,Business',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };
  });

  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    // Check backend health and DB status on mount
    api.checkHealth()
      .then(res => setDbStatus(res.database))
      .catch(() => setDbStatus({ mode: 'OFFLINE', host: 'Server Offline' }));
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('ebook_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('ebook_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('ebook_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUser, dbStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
