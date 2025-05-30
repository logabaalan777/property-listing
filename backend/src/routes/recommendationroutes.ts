import express from 'express';
import { recommendProperty, getReceivedRecommendations, deleteRecommendation } from '../controllers/recommendationcontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

router.post('/', protect, recommendProperty);

router.get('/received', protect, getReceivedRecommendations);

router.delete('/:id', protect, deleteRecommendation);

export default router;
