// hooks/useAuth.js - Custom hook for authentication
import { useState, useEffect } from 'react';
import { auth } from '../lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Validate token if user exists
    if (currentUser?.token) {
      auth.validateToken(currentUser.token).then(isValid => {
        if (!isValid) {
          auth.logout();
          setUser(null);
        }
      });
    }
  }, []);

  const login = async (username, password) => {
    const result = await auth.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};