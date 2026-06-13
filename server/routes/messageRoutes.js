const express = require('express');
const {
  getChatHistory,
  sendMessage,
  getPublicMessages,
  searchUsers,
  getConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:userId', protect, getChatHistory);
router.post('/', protect, sendMessage);
router.get('/public/:room', protect, getPublicMessages);
router.get('/search-users', protect, searchUsers);
router.get('/conversations', protect, getConversations);

module.exports = router;
