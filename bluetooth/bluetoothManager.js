const BluetoothSerial = require('bluetooth-serial').BluetoothSerial;

class BluetoothManager {
  constructor(deviceAddress) {
    this.deviceAddress = deviceAddress;
    this.serial = new BluetoothSerial();
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.serial.connect(this.deviceAddress, (error) => {
        if (error) {
          console.error('Error conectando Bluetooth:', error);
          reject(error);
        } else {
          console.log('Conectado al ESP32 vía Bluetooth');
          this.isConnected = true;
          resolve();
        }
      });
    });
  }

  async sendCommand(command) {
    if (!this.isConnected) {
      throw new Error('Bluetooth no conectado');
    }

    return new Promise((resolve, reject) => {
      this.serial.write(command + '\n', (error) => {
        if (error) {
          console.error('Error enviando comando:', error);
          reject(error);
        } else {
          console.log(`Comando enviado: ${command}`);
          resolve(true);
        }
      });
    });
  }

  async disconnect() {
    return new Promise((resolve) => {
      this.serial.close(() => {
        this.isConnected = false;
        console.log('Conexión Bluetooth cerrada');
        resolve();
      });
    });
  }

  isConnected() {
    return this.isConnected;
  }
}

module.exports = BluetoothManager;
