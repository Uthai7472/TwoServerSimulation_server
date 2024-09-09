// server1.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
}));
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });



let latestRandomValue = null;

io.on('connection', (socket) => {
    console.log('Server1: A client connected');

    socket.on('randomValue', (value) => {
        console.log(`Server1 received random value: ${value}`);
        latestRandomValue = value;
        io.emit('randomValue', value); // Forward to React1
    });

    socket.on('disconnect', () => {
        console.log('Server1: A client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send({ randomValue: latestRandomValue });
})

server.listen(3001, () => {
    console.log('Server1 is running on port 3001');
});
