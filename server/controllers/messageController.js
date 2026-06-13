const Message = require('../models/Message');
const User = require('../models/User');

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
  const { receiverId, content, isPublic, room } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }

  if (!isPublic && !receiverId) {
    return res.status(400).json({ success: false, message: 'Receiver ID is required for private messages' });
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      receiver: isPublic ? null : receiverId,
      content,
      isPublic: isPublic || false,
      room: room || 'general',
    });

    const populated = await Message.findById(message._id).populate('sender receiver', 'name avatar');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get public chatroom messages
// @route   GET /api/messages/public/:room
// @access  Private
const getPublicMessages = async (req, res) => {
  const { room } = req.params;
  const roomName = room || 'general';

  try {
    const messages = await Message.find({ isPublic: true, room: roomName })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Search users by name or email
// @route   GET /api/messages/search-users
// @access  Private
const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    })
      .select('name email avatar role')
      .limit(20);

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all unique users the current user has conversations with
    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
      isPublic: false,
    })
      .populate('sender receiver', 'name avatar')
      .sort({ createdAt: -1 });

    // Get unique conversation partners
    const conversations = new Map();

    messages.forEach((msg) => {
      const partnerId = msg.sender._id.toString() === currentUserId.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      if (!conversations.has(partnerId)) {
        const partner = msg.sender._id.toString() === currentUserId.toString()
          ? msg.receiver
          : msg.sender;

        conversations.set(partnerId, {
          user: partner,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.sender._id.toString() !== currentUserId.toString() && !msg.isRead ? 1 : 0,
        });
      }
    });

    const conversationsArray = Array.from(conversations.values()).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.json({ success: true, count: conversationsArray.length, data: conversationsArray });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  getPublicMessages,
  searchUsers,
  getConversations,
};
