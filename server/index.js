// server/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

// serve static files from ../assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets'), { maxAge: '30d' }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('join', (data) => {
    // for demo we join a 'demo' room
    socket.join(data.userId || 'demo');
  });
});

app.get('/trigger/:state', (req, res) => {
  const state = req.params.state;
  io.to('demo').emit('pet_update', { state, xp: Math.floor(Math.random()*500), level: Math.floor(Math.random()*10)+1 });
  res.json({ ok: true, state });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
