const express = require('express');
const router = express.Router();
const {
  createTicket, getUserTickets, getAllTickets, getTicket, replyToTicket, updateTicketStatus,
} = require('../controllers/supportController');
const { protect, supportOnly } = require('../middleware/authMiddleware');

// User routes
router.post('/ticket', protect, createTicket);
router.get('/tickets', protect, getUserTickets);
router.get('/ticket/:id', protect, getTicket);
router.post('/ticket/:id/reply', protect, replyToTicket);

// Admin/Support routes
router.get('/admin/tickets', protect, supportOnly, getAllTickets);
router.put('/ticket/:id/status', protect, supportOnly, updateTicketStatus);

module.exports = router;
