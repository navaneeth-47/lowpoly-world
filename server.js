const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const CLIENT_ID = '351398026729-vqd0mr61t7d3bsgu6dna25u0tgm1hj06.apps.googleusercontent.com';
const googleClient = new OAuth2Client(CLIENT_ID);

app.use(express.json());
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Verify Google token
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json({
      success: true,
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      }
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

const players = {};

io.on('connection', (socket) => {
  console.log('A player joined:', socket.id);

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 80 - 40,
    z: Math.random() * 80 - 40,
    color: Math.floor(Math.random() * 0xffffff),
    name: 'Guest',
    avatarType: 'explorer',
    googleId: null,
    picture: null,
  };

  socket.emit('init', players);
  socket.broadcast.emit('playerJoined', players[socket.id]);

  socket.on('setProfile', (data) => {
    if (players[socket.id]) {
      players[socket.id].name = (data.name || 'Guest').slice(0, 24);
      players[socket.id].googleId = data.googleId;
      players[socket.id].picture = data.picture;
      io.emit('playerNamed', { id: socket.id, name: players[socket.id].name });
    }
  });

  socket.on('setAvatarType', (type) => {
    if (players[socket.id]) {
      players[socket.id].avatarType = type;
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
    const PROXIMITY = 15;
    for (const id in players) {
      const other = players[id];
      const dx = sender.x - other.x;
      const dz = sender.z - other.z;
      if (Math.sqrt(dx * dx + dz * dz) <= PROXIMITY) {
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