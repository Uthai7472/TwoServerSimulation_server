const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Replace with your client's URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Message received: ' + msg);
        // Broadcast the message to all connected clients
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Public server is running on port 3000');
});
