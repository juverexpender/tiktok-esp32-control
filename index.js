const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const TikTokClient = require('./tiktok/tiktokClient');
const BluetoothManager = require('./bluetooth/bluetoothManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Configuración
const ESP32_BLUETOOTH_ADDRESS = '8C:4F:00:AC:90:BA';
const TIKTOK_USERNAME = 'tu_usuario_tiktok'; // Cambiar por tu usuario

// Inicializar managers
const bluetoothManager = new BluetoothManager(ESP32_BLUETOOTH_ADDRESS);
const tiktokClient = new TikTokClient(TIKTOK_USERNAME, bluetoothManager);

// Rutas de API
app.get('/api/status', (req, res) => {
  res.json({
    bluetooth: bluetoothManager.isConnected(),
    tiktok: tiktokClient.isConnected(),
    username: TIKTOK_USERNAME
  });
});

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Comando requerido' });
  }

  try {
    const success = await bluetoothManager.sendCommand(command);
    res.json({ success, command });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket para updates en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado vía WebSocket');

  socket.on('send_command', async (data) => {
    try {
      const success = await bluetoothManager.sendCommand(data.command);
      socket.emit('command_result', { success, command: data.command });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar servicios
async function startServices() {
  try {
    console.log('Conectando a Bluetooth...');
    await bluetoothManager.connect();
    
    console.log('Conectando a TikTok Live...');
    await tiktokClient.connect();
    
    console.log('Servicios iniciados correctamente');
  } catch (error) {
    console.error('Error iniciando servicios:', error);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  startServices();
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando servicios...');
  await bluetoothManager.disconnect();
  tiktokClient.disconnect();
  process.exit(0);
});

module.exports = app;
