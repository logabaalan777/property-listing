import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByUser
} from '../controllers/propertycontroller';
import { protect } from '../middleware/authmiddleware';

const router = express.Router();

// Public: get list of properties with filters
router.get('/', getProperties);    

router.get('/user', protect, getPropertiesByUser);

// Public: get one property by id
router.get('/:id', getPropertyById);

// Protected: create a property (user must be logged in)
router.post('/', protect, createProperty);

// Protected: update a property (only owner)
router.put('/:id', protect, updateProperty);

// Protected: delete a property (only owner)
router.delete('/:id', protect, deleteProperty);

export default router;
