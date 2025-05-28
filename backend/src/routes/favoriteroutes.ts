import express from 'express';
import { addFavorite, removeFavorite, getFavorites, checkIsFavorite } from '../controllers/favoritecontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

router.post('/', protect, addFavorite);               // Add to favorites
router.get('/', protect, getFavorites);                // Get user's favorites
router.delete('/:propertyId', protect, removeFavorite); // Remove from favorites
router.get('/check/:propertyId', protect, checkIsFavorite);

export default router;
