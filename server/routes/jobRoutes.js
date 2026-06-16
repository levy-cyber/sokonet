const express = require('express');
const router = express.Router();
const {
  getJobs, getJobById, getMyJobs,
  createJob, updateJob, pauseJob, closeJob, deleteJob,
  applyForJob, updateApplicationStatus,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/mine', protect, getMyJobs);
router.get('/:id', protect, getJobById);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.put('/:id/pause', protect, pauseJob);
router.put('/:id/close', protect, closeJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyForJob);
router.put('/:id/applications/:appId', protect, updateApplicationStatus);

module.exports = router;
