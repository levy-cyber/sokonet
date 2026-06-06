const express = require('express');
const { getDashboardMetrics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getDashboardMetrics);

module.exports = router;
