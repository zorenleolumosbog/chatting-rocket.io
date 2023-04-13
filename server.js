const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (userId) => {
    console.log(`user joined: ${userId}`);
    socket.join(userId);
  })

  socket.on('message', (state) => {
    console.log(`message: ${state.message}`);

    if(state.recipientId) {
      io.to(state.senderId).emit('message', state)
      io.to(state.recipientId).emit('message', state)
    } else {
      io.emit('message', state.message);
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

server.listen(3000, () => {
    console.log('Server running on port 3000');
});