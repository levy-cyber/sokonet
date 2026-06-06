const Message = require('../models/Message');

// @desc    Get chat message history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  const currentUserId = req.user._id;
  const chatPartnerId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: chatPartnerId },
        { sender: chatPartnerId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender receiver', 'name avatar');

    // Mark partner's messages as read
    await Message.updateMany(
      { sender: chatPartnerId, receiver: currentUserId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ success: false, message: 'Receiver ID and content are required' });
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    const populated = await Message.findById(message._id).populate('sender receiver', 'name avatar');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
};
