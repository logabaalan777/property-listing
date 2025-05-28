import api from './api';
import { Recommendation } from '../types';

export const getUserRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const response = await api.get('/recommendations/received');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const recommendPropertyToUser = async (
  toEmail: string, 
  propertyId: string,
  message?: string
): Promise<Recommendation> => {
  try {
    const response = await api.post('/recommendations', { 
      toEmail, 
      propertyId,
      message 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRecommendation = async (id: string): Promise<void> => {
  try {
    await api.delete(`/recommendations/${id}`);
  } catch (error) {
    throw error;
  }
};