const mqtt = require('mqtt');

// MQTT broker details
const MQTT_BROKER = "test.mosquitto.org";
const MQTT_TOPIC = "my/random/topic";

// MQTT client setup
const client = mqtt.connect(`mqtt://${MQTT_BROKER}`);

// React.js client connection
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let randomValue;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Random value : ${randomValue}`);
});

// Handle MQTT messages
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(MQTT_TOPIC);
});

client.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()}`);
  randomValue = message.toString();
  io.emit('mqtt-data', message.toString());
});

// Set up Socket.IO for real-time communication with React.js client
io.on('connection', (socket) => {
  console.log('React.js client connected');
});

http.listen(3000, () => {
  console.log('Node.js server listening on port 3000');
});
