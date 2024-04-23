const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { authenticateJWT } = require('./middleware/authenticate');
const { User } = require('./models/User');
const { Message } = require('./models/Message');
const { loginRoute, messagesRoute } = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/chat_app';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use(cors());
app.use(bodyParser.json());

app.post('/login', loginRoute);
app.use('/messages', authenticateJWT, messagesRoute);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('send-message', async (data) => {
    try {
      const decoded = jwt.verify(data.token, 'secretkey');
      const user = await User.findOne({ username: decoded.username });
      if (user) {
        const message = new Message({ text: data.message, user: user._id });
        await message.save();
        io.emit('new-message', message);
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});