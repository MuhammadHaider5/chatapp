import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState('');

  return (
    <div>
      <h1>Real-time Chat App</h1>
      {token ? (
        <Chat token={token} />
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;