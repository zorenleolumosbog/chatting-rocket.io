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
  console.log('a user connected')

  socket.on('message', (message) => {
    console.log(`message: ${message}`)
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
    console.log('Server running on port 3000');
});