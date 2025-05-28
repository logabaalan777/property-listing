import { Request, Response } from 'express';
import Property from '../models/Property';
import { AuthRequest } from '../middleware/authmiddleware';
import redisClient from '../config/redis'; 

const getPropertyCacheKey = (id: string) => `property:${id}`;

import { getPropertiesCacheKey } from '../utils/cacheKeys'; 

export const getProperties = async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    // Pagination defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (req.query.type) filters.type = req.query.type;
    if (req.query.state) filters.state = req.query.state;
    if (req.query.city) filters.city = req.query.city;
    if (req.query.listingType) filters.listingType = req.query.listingType;
    if (req.query.listedBy) filters.listedBy = req.query.listedBy;

    if (req.query.priceMin || req.query.priceMax) {
      filters.price = {};
      if (req.query.priceMin) filters.price.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) filters.price.$lte = Number(req.query.priceMax);
    }

    if (req.query.bedrooms) filters.bedrooms = Number(req.query.bedrooms);
    if (req.query.bathrooms) filters.bathrooms = Number(req.query.bathrooms);
    if (req.query.areaMin || req.query.areaMax) {
      filters.areaSqFt = {};
      if (req.query.areaMin) filters.areaSqFt.$gte = Number(req.query.areaMin);
      if (req.query.areaMax) filters.areaSqFt.$lte = Number(req.query.areaMax);
    }

    if (req.query.amenities) {
      const ams = (req.query.amenities as string).split(',');
      filters.amenities = { $all: ams };
    }

    if (req.query.tags) {
      const tgs = (req.query.tags as string).split(',');
      filters.tags = { $all: tgs };
    }

    if (req.query.isVerified !== undefined) {
      filters.isVerified = req.query.isVerified === 'true';
    }

    // Generate cache key
    const cacheKey = getPropertiesCacheKey({ ...filters, page, limit });
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const total = await Property.countDocuments(filters);
    const properties = await Property.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    const responseData = { properties, total };

    await redisClient.setEx(cacheKey, 600, JSON.stringify(responseData)); // 10 mins

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;
    const cacheKey = getPropertyCacheKey(propertyId);

    // Try Redis cache
    const cachedProperty = await redisClient.get(cacheKey);
    if (cachedProperty) {
      return res.status(200).json(JSON.parse(cachedProperty));
    }

    // Query by `id` field (not _id)
    const property = await Property.findOne({ id: propertyId });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Cache for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(property));

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by custom ID:', error);
    res.status(500).json({ message: 'Error fetching property', error });
  }
};


export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const createdBy = req.user!.userId;
    const newProperty = new Property({ ...req.body, createdBy });
    const saved = await newProperty.save();

    // Invalidate all properties cache because data changed
    await redisClient.flushAll();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error });
  }
};


export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updated = await Property.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });

    await redisClient.del(getPropertyCacheKey(req.params.id));
    await redisClient.flushAll();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
};


// Delete Property 
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await Property.deleteOne({ id: req.params.id });

    // Invalidate cache
    await redisClient.del(getPropertyCacheKey(req.params.id));
    await redisClient.flushAll();

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error });
  }
};


export const getPropertiesByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const userProperties = await Property.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(userProperties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user properties', error });
  }
};