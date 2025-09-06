const { WebcastPushConnection } = require('tiktok-live-connector');

class TikTokClient {
  constructor(username, bluetoothManager) {
    this.username = username;
    this.bluetoothManager = bluetoothManager;
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    this.connection = new WebcastPushConnection(this.username, {
      enableExtendedGiftInfo: true
    });

    try {
      await this.connection.connect();
      this.isConnected = true;
      console.log(`Conectado a TikTok Live de @${this.username}`);

      this.setupEventHandlers();
    } catch (error) {
      console.error('Error conectando a TikTok:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.connection.on('gift', (data) => {
      console.log(`${data.uniqueId} envió ${data.giftId}`);
      this.handleGift(data);
    });

    this.connection.on('like', (data) => {
      console.log(`${data.uniqueId} dio like`);
      this.bluetoothManager.sendCommand('LIKE').catch(console.error);
    });

    this.connection.on('chat', (data) => {
      console.log(`${data.uniqueId}: ${data.comment}`);
    });

    this.connection.on('error', (error) => {
      console.error('Error TikTok connection:', error);
    });

    this.connection.on('disconnected', () => {
      console.log('Desconectado de TikTok Live');
      this.isConnected = false;
    });
  }

  handleGift(giftData) {
    const giftMap = {
      'rose': 'ROSE',
      'tiktok': 'SERVO',
      'icecream': 'SERVO',
      'diamond': 'COMBO',
      'plane': 'COMBO',
      'coin': 'LIKE'
    };

    const command = giftMap[giftData.giftId.toLowerCase()] || 'LIKE';
    this.bluetoothManager.sendCommand(command).catch(console.error);
  }

  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.isConnected = false;
    }
  }

  isConnected() {
    return this.isConnected;
  }
}

module.exports = TikTokClient;
