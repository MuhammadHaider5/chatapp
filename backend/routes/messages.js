const { Message } = require('../models/Message');

async function getMessages(req, res) {
  try {
    const messages = await Message.find().populate('user', 'username');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getMessages };