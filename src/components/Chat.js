import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Import socket.io-client library
import axios from 'axios';

function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/messages', {
          headers: { Authorization: token }
        });
        setMessages(res.data);
      } catch (error) {
        console.error('Fetch Messages Error:', error.message);
      }
    };

    fetchMessages();
  }, [token]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('new-message', (message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const handleMessageSend = () => {
    const socket = io('http://localhost:5000');
    socket.emit('send-message', { token, message: messageInput });
    setMessageInput('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>{message.user.username}: {message.text}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
