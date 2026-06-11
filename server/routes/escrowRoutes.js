const express = require('express');
const { getEscrows, raiseDispute, resolveDispute } = require('../controllers/escrowController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, getEscrows);
router.post('/:id/dispute', protect, raiseDispute);
router.post('/:id/resolve', protect, authorize('admin'), resolveDispute);

module.exports = router;
