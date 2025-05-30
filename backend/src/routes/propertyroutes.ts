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

router.get('/', getProperties);    

router.get('/user', protect, getPropertiesByUser);

router.get('/:id', getPropertyById);

router.post('/', protect, createProperty);

router.put('/:id', protect, updateProperty);

router.delete('/:id', protect, deleteProperty);

export default router;
