import api from './api';
import { Favorite } from '../types';

export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToFavorites = async (propertyId: string): Promise<Favorite> => {
  try {
    const response = await api.post('/favorites', { propertyId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromFavorites = async (propertyId: string): Promise<void> => {
  try {
    await api.delete(`/favorites/${propertyId}`);
  } catch (error) {
    throw error;
  }
};

export const checkIsFavorite = async (propertyId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/favorites/check/${propertyId}`);
    return response.data.isFavorite;
  } catch (error) {
    throw error;
  }
};