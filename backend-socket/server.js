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
  {game: 'testGame', player: 'testplayer', score: 10000},
  {game: 'testGame', player: 'testplayer', score: 10000},
  {game: 'testGame', player: 'testplayer', score: 10000}
];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send currentDiscussion only to the newly connected client
  socket.emit('response', currentDiscussion);

  // Listen for incoming messages from this client
  socket.on('message', (msg) => {
    currentDiscussion = [{game: msg, player: 'justetest', score:5000}, ...currentDiscussion];
    console.log('Message received:', msg);

    // Broadcast updated discussion to all clients
    io.emit('response', currentDiscussion);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
