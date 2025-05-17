import axios from 'axios';
import { config } from '../config/config';

const BASE_URL = `${config.apiUrl}/auth`;

// Token management
const setToken = (token) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeToken = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    removeToken();
    throw new Error(error.response?.data?.error || 'Authentication failed');
  }
};

export const logoutUser = () => {
  removeToken();
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Password reset failed');
  }
};