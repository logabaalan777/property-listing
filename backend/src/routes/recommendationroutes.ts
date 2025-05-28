import express from 'express';
import { recommendProperty, getReceivedRecommendations, deleteRecommendation } from '../controllers/recommendationcontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

// Recommend property to another user (by email)
router.post('/', protect, recommendProperty);

// View all recommendations received by logged-in user
router.get('/received', protect, getReceivedRecommendations);

router.delete('/:id', protect, deleteRecommendation);

export default router;
