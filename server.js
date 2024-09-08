// server1/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

// Store commands in memory for simplicity
let commandToSend;

// Endpoint to receive commands
app.post('/command', (req, res) => {
    const { command } = req.body;
    // commands.push(command);
    commandToSend = command
    console.log(command, commandToSend);
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
    console.log('Received random value from server2:', receivedRandomValue);
    res.status(200).send('Random value received');
});

app.get('/random', (req, res) => {
    console.log(receivedRandomValue);
    res.status(200).json(receivedRandomValue);
})

app.listen(PORT, () => {
    console.log(`Server1 running on http://localhost:${PORT}`);
});
