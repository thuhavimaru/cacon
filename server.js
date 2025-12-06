const aedes = require('aedes')();
const net = require('net');
const ws = require('ws');

// MQTT Broker (port 1883)
const server = net.createServer(aedes.handle);
server.listen(1883, () => {
  console.log('MQTT Broker chạy trên port 1883');
});

// WebSocket cho trình duyệt (port 8080)
const wss = new ws.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Web client kết nối');

  const aedesOnPublish = (packet, client) => {
    if (packet.topic.startsWith('fish/')) {
      ws.send(JSON.stringify({
        topic: packet.topic,
        payload: packet.payload.toString()
      }));
    }
  };

  aedes.on('publish', aedesOnPublish);

  ws.on('close', () => {
    aedes.removeListener('publish', aedesOnPublish);
  });
});

// In log khi có dữ liệu
aedes.on('publish', (packet, client) => {
  if (packet.topic === 'fish/data') {
    console.log('Dữ liệu từ hồ cá:', packet.payload.toString());
  }
});