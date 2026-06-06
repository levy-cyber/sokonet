const express = require('express');
const { getChatHistory, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:userId', protect, getChatHistory);
router.post('/', protect, sendMessage);

module.exports = router;
