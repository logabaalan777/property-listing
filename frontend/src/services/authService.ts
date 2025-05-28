import api from './api';
import { AuthResponse, User } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', {name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};