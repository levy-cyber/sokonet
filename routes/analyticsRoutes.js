const express = require('express');
const { getDashboardMetrics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'seller', 'service_provider'), getDashboardMetrics);

module.exports = router;
