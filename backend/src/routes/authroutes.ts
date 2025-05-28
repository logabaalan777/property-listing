import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authcontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
