import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { registerRider, getRiders, assignRider, updateRiderLocation } from '../controllers/riderController.js';

const router = express.Router();
router.route('/').get(protect, getRiders).post(protect, registerRider);
router.route('/:id/assign').patch(protect, assignRider);
router.route('/location').patch(protect, updateRiderLocation);

export default router;
