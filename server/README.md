# Backend Transcription Service

Node.js server that processes audio streams and provides real-time transcription using Deepgram's AI speech recognition API.

## 🎯 Overview

This server handles:
- **WebSocket connections** from Chrome extension clients
- **Audio stream processing** and forwarding to Deepgram
- **Real-time transcription** streaming back to clients
- **Connection management** and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Deepgram API key
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "DEEPGRAM_API_KEY=your_api_key_here" > .env

# Start the server
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```bash
DEEPGRAM_API_KEY=your_deepgram_api_key_here
PORT=8080  # Optional, defaults to 8080
```

## 🏗️ Project Structure

```
server/
├── src/
│   ├── app.ts              # Express application setup
│   ├── server.ts           # HTTP server initialization
│   ├── config/
│   │   ├── config.ts       # Configuration management
│   │   └── constants.ts    # Application constants
│   └── services/
│       ├── deepgramService.ts  # Deepgram API integration
│       └── websocketService.ts # WebSocket connection handling
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Deepgram API Setup

1. Sign up at [Deepgram](https://deepgram.com/)
2. Create a new project
3. Generate an API key
4. Add to your `.env` file

### Server Settings

- **Port**: Default 8080 (configurable via PORT env var)
- **WebSocket**: Available at `ws://localhost:8080`
- **CORS**: Configured for Chrome extension access

## 🛠️ Development

### Commands

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Build TypeScript
npm run build

# Type checking
npm run type-check
```

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts during development.

## 🔌 API Endpoints

### WebSocket Connection

- **URL**: `ws://localhost:8080`
- **Protocol**: WebSocket for real-time audio streaming
- **Data Format**: Audio blob data from Chrome extension

### HTTP Endpoints

- **Health Check**: `GET /health` - Server status
- **WebSocket Upgrade**: Automatic WebSocket handshake

## 🔄 Data Flow

1. **Client Connection**: Chrome extension connects via WebSocket
2. **Audio Streaming**: Extension sends audio chunks to server
3. **Deepgram Processing**: Server forwards audio to Deepgram API
4. **Transcription**: Deepgram returns real-time transcription
5. **Client Update**: Server streams transcription back to extension

## 📊 Monitoring

### Logging

The server provides detailed logging for:
- WebSocket connections/disconnections
- Audio processing status
- Deepgram API responses
- Error conditions

### Health Checks

Monitor server status via `/health` endpoint or WebSocket connection state.

## 🔍 Troubleshooting

### Common Issues

- **Connection Refused**: Ensure server is running on correct port
- **Deepgram Errors**: Verify API key and account status
- **Audio Issues**: Check WebSocket connection and audio format

### Debug Mode

Enable verbose logging by setting environment variable:
```bash
DEBUG=* npm start
```

## 📚 Dependencies

- **Express**: Web framework
- **ws**: WebSocket server
- **dotenv**: Environment configuration
- **TypeScript**: Type safety
- **Deepgram SDK**: Speech recognition API

## 🔒 Security

- **API Key Protection**: Store Deepgram API key in environment variables
- **CORS Configuration**: Limited to Chrome extension origins
- **Input Validation**: Audio data validation before processing

## 🚀 Production

### Deployment

- Use `npm start` for production
- Set `NODE_ENV=production`
- Ensure proper environment variables
- Consider using PM2 or similar process manager

### Scaling

- Multiple server instances behind load balancer
- Redis for WebSocket session management
- Monitor Deepgram API usage and limits

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include logging for debugging
4. Test WebSocket connections thoroughly
5. Verify Deepgram API integration
