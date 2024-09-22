const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const devices = {};
let monitorDeviceId = {};
let storedValues = []; 

app.post('/api/devices/register', (req, res) => {
  const { deviceId, deviceName, deviceType } = req.body;
  if (!deviceId || devices[deviceId]) {
    console.log(devices);
    return res.status(400).json({ error: 'Invalid or duplicate device ID' });
  }

  devices[deviceId] = { deviceName, deviceType, status:'offline' };
  console.log(devices);
  res.status(201).json({ message: 'Device registered successfully '});
  
});

app.post('/api/devices/:deviceId/control', (req, res) => {
  const {deviceId} = req.params;
  const {command} = req.body;

  if (!devices[deviceId]) {
    return res.status(404).json({ error: 'Device not found' });
  }

  console.log(`Executing command "${command}" on device ${deviceId}`)
  devices[deviceId].status = 'active';
  devices[deviceId].lastCommand = command;

  res.json({ message: `Command executed on device ${deviceId}`});
});

app.get('/api/devices/:deviceId/control', (req, res) => {
  const {deviceId} = req.params;

  if (!devices[deviceId]) {
    console.log('Device not found');
    return res.status(404).json({ error: 'Device not found' });
  }

  // console.log({deviceId, status: devices[deviceId].status, lastCommand: devices[deviceId].lastCommand})
  res.json({ deviceId, status: devices[deviceId].status, lastCommand: devices[deviceId].lastCommand });
});

app.post('/api/devices/:monitorDeviceId/monitor', (req, res) => {
  monitorDeviceId = req.params;
  const {values} = req.body;

  storedValues = values;

  console.log(`Values: ${values}`);
  res.status(201).json({ message: 'Value from Raspi send to server' });
  
});

app.get('/api/devices/:deviceId/monitor', (req, res) => {
  const {deviceId} = req.params;

  res.status(200).json({ deviceId, values: storedValues });
  
});


app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
})

