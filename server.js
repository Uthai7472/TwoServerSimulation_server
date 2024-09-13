const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['https://two-server-simulation-client.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type']
  }
});
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

io.on('connection', (socket) => {
  console.log('A Raspberry Pi connected');

  socket.on('raspberry-pi-data', (data) => {
    console.log('Received sensor data:', data);
    // Process the sensor data and store it, if needed
    io.emit('sensor-data', data);
  });

  setInterval(() => {
    socket.emit('server-command', { action: 'update_led', state: 'on' });
  }, 5000);
});

http.listen(port, () => {
  console.log('Server listening on port 3000');
});
