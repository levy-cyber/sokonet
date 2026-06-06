import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  const { recipientId, text } = req.body;

  if (!recipientId || !text) {
    return res.status(400).json({ message: 'Recipient and message text are required.' });
  }

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    text,
  });

  res.status(201).json(message);
};

export const getMessages = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Conversation userId is required.' });
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: userId },
      { sender: userId, recipient: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name')
    .populate('recipient', 'name');

  res.json(messages);
};
