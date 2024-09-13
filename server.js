const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

let sensorData;
let command1, command2;

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());

app.post('/api/data', (req, res) => {
  sensorData = req.body;
  console.log('Received data:', sensorData);

  res.json(sensorData);
});

app.get('/api/data', (req, res) => {

  res.json(sensorData);
});

// Get command from client
app.post('/api/command', (req, res) => {
  command1 = req.body.command[0];
  command2 = req.body.command[1];

  console.log('Received command from client:', command1);
  console.log('Received command from client:', command2);

  const response = {message: 'Command from client received'};
  res.json(response);
});
app.get('/api/command', (req, res) => {
  res.json({command1: command1, command2: command2});
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up Socket.IO for real-time communication
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A client connected');
});
