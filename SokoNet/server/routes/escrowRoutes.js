import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createEscrow, releaseEscrow, refundEscrow, getEscrows } from '../controllers/escrowController.js';

const router = express.Router();
router.route('/').get(protect, getEscrows).post(protect, createEscrow);
router.route('/:id/release').patch(protect, releaseEscrow);
router.route('/:id/refund').patch(protect, refundEscrow);

export default router;
