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

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 80 - 40,
    z: Math.random() * 80 - 40,
    color: Math.floor(Math.random() * 0xffffff),
    name: 'Guest'
  };

  socket.emit('init', players);
  socket.broadcast.emit('playerJoined', players[socket.id]);

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

  socket.on('chatMessage', (msg) => {
    const sender = players[socket.id];
    if (!sender) return;

    // Only send to nearby players
    const PROXIMITY = 15;
    for (const id in players) {
      const other = players[id];
      const dx = sender.x - other.x;
      const dz = sender.z - other.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= PROXIMITY) {
        io.to(id).emit('chatMessage', { id: socket.id, name: sender.name, msg });
      }
    }
  });

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