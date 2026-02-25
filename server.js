const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  console.log('A player joined:', socket.id);

  // Assign random avatar color and starting position
  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 80 - 40,
    z: Math.random() * 80 - 40,
    color: Math.floor(Math.random() * 0xffffff),
    name: 'Guest'
  };

  // Send current players to the new player
  socket.emit('init', players);

  // Tell everyone else about the new player
  socket.broadcast.emit('playerJoined', players[socket.id]);

  // When a player moves
socket.on('setName', (name) => {
    if (players[socket.id]) {
      players[socket.id].name = name.slice(0, 16);
      io.emit('playerNamed', { id: socket.id, name: players[socket.id].name });
    }
  });

  socket.on('move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].z = data.z;
      socket.broadcast.emit('playerMoved', { id: socket.id, x: data.x, z: data.z });
    }
  });

  // When a player sends a chat message
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', { id: socket.id, msg: msg });
  });

  // When a player disconnects
  socket.on('disconnect', () => {
    console.log('Player left:', socket.id);
    delete players[socket.id];
    io.emit('playerLeft', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});