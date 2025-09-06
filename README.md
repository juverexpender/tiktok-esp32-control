# TikTok Live ESP32 Control

Controla tu ESP32 mediante regalos de TikTok Live usando Node.js desplegado en Render.

## Configuración

1. **Clona este repositorio**
2. **Configura el ESP32** con el código proporcionado
3. **Configura las variables** en `index.js`:
   - `ESP32_BLUETOOTH_ADDRESS`: Dirección Bluetooth de tu ESP32
   - `TIKTOK_USERNAME`: Tu usuario de TikTok

4. **Despliega en Render**:
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el `render.yaml`

## API Endpoints

- `GET /api/status` - Estado de las conexiones
- `POST /api/command` - Enviar comando manual
  - Body: `{"command": "LIKE"}`

## Comandos Disponibles

- `LIKE` - Parpadeo rápido del LED
- `ROSE` - Parpadeo prolongado del LED
- `SERVO` - Mueve el servo
- `COMBO` - Secuencia especial

## Estructura Bluetooth ESP32
