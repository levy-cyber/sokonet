import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { postJob, getJobs, applyJob } from '../controllers/jobController.js';

const router = express.Router();
router.route('/').get(getJobs).post(protect, postJob);
router.route('/:id/apply').post(protect, applyJob);

export default router;
