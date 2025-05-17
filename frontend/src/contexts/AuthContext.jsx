import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext();
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    churchMember: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setState(prev => ({
          ...prev,
          user: response.data.user,
          churchMember: response.data.churchMember,
          isAuthenticated: true,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false
        }));
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setState(prev => ({
        ...prev,
        error: 'Authentication failed',
        loading: false
      }));
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setState(prev => ({
        ...prev,
        user: response.data.user,
        churchMember: response.data.churchMember,
        isAuthenticated: true,
        error: null
      }));
      return true;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Login failed'
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      churchMember: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      // Add your signup API call here
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        user: data.user,
        churchMember: data.churchMember,
        isAuthenticated: true,
        error: null
      }));
      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Signup failed'
      }));
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    checkAuth,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}