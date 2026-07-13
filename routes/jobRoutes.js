const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  updateApplicationStatus,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', protect, getJobById);
router.post('/', protect, createJob);
router.post('/:id/apply', protect, applyForJob);
router.put('/:id/applications/:appId', protect, updateApplicationStatus);

module.exports = router;
