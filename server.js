// server1.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('Server1: A client connected');

    socket.on('randomValue', (value) => {
        console.log(`Server1 received random value: ${value}`);
        io.emit('randomValue', value); // Forward to React1
    });

    socket.on('disconnect', () => {
        console.log('Server1: A client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server1 is running on port 3001');
});
