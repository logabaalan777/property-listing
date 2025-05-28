import api from './api';
import { Property, FilterOptions } from '../types';

export const getProperties = async (filters: FilterOptions = {}): Promise<{ properties: Property[], total: number }> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Map frontend filters to backend query parameters
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.listingType) queryParams.append('listingType', filters.listingType);
    if (filters.listedBy) queryParams.append('listedBy', filters.listedBy);
    if (filters.minPrice) queryParams.append('priceMin', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('priceMax', filters.maxPrice.toString());
    if (filters.minBedrooms) queryParams.append('bedrooms', filters.minBedrooms.toString());
    if (filters.minBathrooms) queryParams.append('bathrooms', filters.minBathrooms.toString());
    if (filters.amenities?.length) queryParams.append('amenities', filters.amenities.join(','));
    if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const response = await api.get(`/properties?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProperties = async (): Promise<Property[]> => {
  try {
    const response = await api.get('/properties/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await api.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    throw error;
  }
};

export const getPropertyTypes = async (): Promise<string[]> => {
  try {
    const response = await api.get('/property/types');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyStates = async (): Promise<string[]> => {
  try {
    const response = await api.get('/property/states');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyCities = async (state?: string): Promise<string[]> => {
  try {
    const url = state ? `/property/cities?state=${state}` : '/property/cities';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};