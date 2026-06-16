const SupportTicket = require('../models/SupportTicket');
const ActivityLog = require('../models/ActivityLog');
const notificationService = require('../services/notificationService');

// @desc    Create a support ticket
// @route   POST /api/support/ticket
// @access  Private
const createTicket = async (req, res) => {
  const { subject, message, category, priority } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ success: false, message: 'Subject and message are required' });
  }
  try {
    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      category: category || 'Other',
      priority: priority || 'medium',
      messages: [{
        sender: req.user._id,
        content: message,
        isSupport: false,
      }],
    });

    const populated = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's own tickets
// @route   GET /api/support/tickets
// @access  Private
const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar isSupport')
      .sort({ updatedAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all tickets (admin/support)
// @route   GET /api/support/admin/tickets
// @access  Support/Admin
const getAllTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 30 } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email avatar phone')
      .populate('messages.sender', 'name avatar')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);
    res.json({ success: true, count: tickets.length, total, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/support/ticket/:id
// @access  Private
const getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar isSupport isSuperAdmin');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    // Only the ticket owner or support/admin can view
    const isOwner = ticket.user._id.toString() === req.user._id.toString();
    const isStaff = req.user.isSupport || req.user.isSuperAdmin || req.user.role === 'admin' || req.user.role === 'support';
    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reply to a ticket
// @route   POST /api/support/ticket/:id/reply
// @access  Private
const replyToTicket = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isStaff = req.user.isSupport || req.user.isSuperAdmin || req.user.role === 'admin' || req.user.role === 'support';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    ticket.messages.push({
      sender: req.user._id,
      content: message,
      isSupport: isStaff,
    });

    // Update ticket status
    if (isStaff && ticket.status === 'open') {
      ticket.status = 'in_progress';
      ticket.assignedTo = req.user._id;
    }

    await ticket.save();

    // Notify the other party
    if (isStaff) {
      // Notify the user
      await notificationService.createNotification(
        ticket.user,
        'Support Reply Received',
        `Support has replied to your ticket: "${ticket.subject}"`,
        'General',
        `/support/${ticket._id}`
      );
    } else {
      // Notify assigned support or all support staff
      if (ticket.assignedTo) {
        await notificationService.createNotification(
          ticket.assignedTo,
          'User Replied to Ticket',
          `${req.user.name} replied to: "${ticket.subject}"`,
          'General',
          `/support/admin/tickets/${ticket._id}`
        );
      }
    }

    const updated = await SupportTicket.findById(ticket._id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar isSupport isSuperAdmin');

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update ticket status (admin/support)
// @route   PUT /api/support/ticket/:id/status
// @access  Support/Admin
const updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'resolved' ? { resolvedAt: new Date() } : {}) },
      { new: true }
    ).populate('user', 'name email');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    if (status === 'resolved') {
      await notificationService.createNotification(
        ticket.user._id,
        'Support Ticket Resolved',
        `Your ticket "${ticket.subject}" has been resolved.`,
        'General',
        `/support/${ticket._id}`
      );
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTicket, getUserTickets, getAllTickets, getTicket, replyToTicket, updateTicketStatus,
};
