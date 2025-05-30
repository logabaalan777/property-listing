import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';
import Recommendation from '../models/Recommendation';
import { AuthRequest } from '../middleware/authmiddleware';
import redisClient from '../config/redis'; 

const getRecommendationsCacheKey = (userId: string) => `recommendations:${userId}`;

export const recommendProperty = async (req: AuthRequest, res: Response) => {
  const { toEmail, propertyId, message } = req.body;

  try {
    const toUser = await User.findOne({ email: toEmail });
    if (!toUser) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    const property = await Property.findOne({ id: propertyId }); // 👈 using custom ID here
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const recommendation = new Recommendation({
      fromUserId: req.user?.userId,
      toUserId: toUser._id,
      propertyId: property._id, 
      message, 
    });

    await recommendation.save();

    await redisClient.del(getRecommendationsCacheKey(toUser._id.toString()));

    res.status(201).json({ message: 'Property recommended successfully', recommendation });
  } catch (error) {
    res.status(500).json({ message: 'Error recommending property', error });
  }
};

export const getReceivedRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const cacheKey = getRecommendationsCacheKey(userId);

    // Try to get cached recommendations
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const recommendations = await Recommendation.find({ toUserId: userId })
      .populate('propertyId')
      .populate('fromUserId', 'email');

    // Cache for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(recommendations));

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
};

export const deleteRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const recommendationId = req.params.id;
    const userId = req.user?.userId;

    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    if (recommendation.toUserId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recommendation' });
    }

    await Recommendation.findByIdAndDelete(recommendationId);

    // Invalidate cache
    await redisClient.del(getRecommendationsCacheKey(userId!));

    res.status(200).json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({ message: 'Error deleting recommendation' });
  }
};
