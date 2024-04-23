const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

async function loginRoute(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username: user.username }, 'secretkey');
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { loginRoute };