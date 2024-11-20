const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Svelte frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  }
});

currentDiscussion = [
  'a',
  'b',
  'c'
];

// Handle client connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle a custom event from the client (Svelte app)
  socket.on('message', (msg) => {
    currentDiscussion = [msg, ...currentDiscussion];
    console.log('Message received:', msg);
    
    // Emit a message to all clients (Svelte clients)
    io.emit('response', currentDiscussion);  // Sends message to all clients connected to this instance
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
