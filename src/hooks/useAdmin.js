import { useState, useEffect } from 'react';

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    // Verify against VITE_ADMIN_PASSWORD in environment
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (password === correctPassword) {
      const secret = import.meta.env.VITE_ADMIN_SECRET;
      sessionStorage.setItem('adminToken', secret);
      setIsAuthenticated(true);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid password' };
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
