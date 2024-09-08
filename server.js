// server1/index.js
const express = require('express');
const app = express();
const PORT = 5001;

const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const io = socketIO(server);

// Allow requests from your Netlify frontend URL
const allowedOrigins = ['https://io-learning-client.netlify.app/', 'https://two-server-simulation-client.vercel.app'];  // Add your Netlify URL here

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl requests or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.json());

// Store commands in memory for simplicity
let commandToSend;

// Endpoint to receive commands
app.post('/command', (req, res) => {
    const { command } = req.body;
    // commands.push(command);
    commandToSend = command
    console.log(command, commandToSend);

    // Socket io implement
    io.emit('command', command); // Emit command to all connected clients
    res.status(200).send('Command received');
});
// Endpoint to serve commands
app.get('/commands', (req, res) => {
    res.status(200).json(commandToSend);
});

// Store the latest random value received
let receivedRandomValue = null;

// Endpoint to receive random values from server2
app.post('/random', (req, res) => {
    const { randomValue } = req.body;
    receivedRandomValue = randomValue;
    // Socket io implement
    io.emit('randomValue', receivedRandomValue); // Emit random value to all connected clients
    console.log('Received random value from server2:', receivedRandomValue);
    res.status(200).send('Random value received');
});

app.get('/random', (req, res) => {
    console.log(receivedRandomValue);
    res.status(200).json(receivedRandomValue);
})

server.listen(PORT, () => {
    console.log(`Server1 running on http://localhost:${PORT}`);
});
