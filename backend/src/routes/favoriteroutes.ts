import express from 'express';
import { addFavorite, removeFavorite, getFavorites, checkIsFavorite } from '../controllers/favoritecontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

router.post('/', protect, addFavorite);               
router.get('/', protect, getFavorites);              
router.delete('/:propertyId', protect, removeFavorite); 
router.get('/check/:propertyId', protect, checkIsFavorite);

export default router;
