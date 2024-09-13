const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

let sensorData;

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

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up Socket.IO for real-time communication
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A client connected');
});
