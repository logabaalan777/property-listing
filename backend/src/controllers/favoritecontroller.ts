import { Request, Response } from 'express';
import Favorite from '../models/Favorite';
import { AuthRequest } from '../middleware/authmiddleware';
import redisClient from '../config/redis';
import { getPropertiesCacheKey } from '../utils/cacheKeys';
import Property from '../models/Property';

const CACHE_EXPIRY = 300;

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { propertyId } = req.body; // propertyId is like "PROP1037"

    // 🔍 Find the property by custom ID
    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existing = await Favorite.findOne({ userId, propertyId: property._id });
    if (existing) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = new Favorite({ userId, propertyId: property._id });
    await favorite.save();

    // 🚫 Invalidate cache
    await redisClient.del(`favorites:${userId}`);

    res.status(201).json({ message: 'Property added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { propertyId } = req.params; // propertyId is like "PROP1037"

    const property = await Property.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const deleted = await Favorite.findOneAndDelete({ userId, propertyId: property._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await redisClient.del(`favorites:${userId}`);

    res.status(200).json({ message: 'Property removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite', error });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const cacheKey = `favorites:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const favorites = await Favorite.find({ userId }).populate('propertyId');

    await redisClient.setEx(cacheKey, 300, JSON.stringify(favorites)); // TTL 5 mins

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorites', error });
  }
};

export const checkIsFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { propertyId } = req.params;

    // Check Redis cache first
    const cacheKey = getPropertiesCacheKey({ id: propertyId });
    const cachedProperty = await redisClient.get(cacheKey);

    let property;

    if (cachedProperty) {
      property = JSON.parse(cachedProperty);
    } else {
      // Fallback to DB
      property = await Property.findOne({ id: propertyId });
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      await redisClient.setEx(cacheKey, 600, JSON.stringify(property));
    }

    const exists = await Favorite.exists({ userId, propertyId: property._id });

    res.status(200).json({ isFavorite: !!exists });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorite status', error });
  }
};
