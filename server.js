const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// MQTT broker details
const MQTT_BROKER = "mqtt://test.mosquitto.org"; // Replace with your broker URL
const MQTT_TOPIC = "my/random/topic";

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variable to store the latest message
let latestMessage = "";

// Connect to the MQTT broker
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(MQTT_TOPIC);
});

client.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()}`);
  latestMessage = message.toString(); // Store the latest message
  io.emit('mqtt-data', latestMessage); // Emit to Socket.IO clients
});

// Set up Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected');
});

// HTTP endpoint to send the latest message
app.get('/latest-message', (req, res) => {
  res.send({ message: latestMessage }); // Send the latest message as a JSON response
});

// Start the server
server.listen(3000, () => {
  console.log('Node.js server listening on port 3000');
});
