const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://two-server-simulation-client.vercel.app'], // Allow both local and production React app
        methods: ['GET', 'POST'], // Specify allowed methods
        credentials: true // Allow credentials if needed
    }
});

// Use CORS middleware for Express routes
app.use(cors({
    origin: ['http://localhost:5173', 'https://two-server-simulation-client.vercel.app'], // Same origins as above
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true // Allow credentials if needed
}));

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('data', (data) => {
        console.log('Data received from Raspberry Pi:', data);
        // Emit data to all connected clients
        io.emit('update', data);
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

const PORT = process.env.PORT || 3000; // Corrected the way to set PORT
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
