# Architecture Diagram

## System Overview
The Chrome AI Audio Transcription system follows a client-server architecture with real-time audio processing and WebSocket communication.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHROME EXTENSION (CLIENT)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐   │
│  │   Content Script │    │   React App      │    │   Audio Capture     │   │
│  │   (manifest.json)│    │   (App.tsx)      │    │   (useAudioCapture)│   │
│  └─────────────────┘    └──────────────────┘    └─────────────────────┘   │
│           │                       │                       │               │
│           │                       │                       │               │
│           └───────────────────────┼───────────────────────┘               │
│                                   │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │                    WebSocket Connection                              │ │
│  │                    (useWebSocketConnection)                          │ │
│  └─────────────────────────────────┼─────────────────────────────────────┘ │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      │ WebSocket (Port 8080)
                                      │
┌─────────────────────────────────────┼───────────────────────────────────────┐
│                           NODE.JS SERVER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐   │
│  │   Express App   │    │  WebSocket       │    │   Deepgram          │   │
│  │   (app.ts)      │    │  Service         │    │   Service           │   │
│  │   Port: 3000    │    │  (websocketService)│  │   (deepgramService) │   │
│  └─────────────────┘    └──────────────────┘    └─────────────────────┘   │
│           │                       │                       │               │
│           │                       │                       │               │
│           └───────────────────────┼───────────────────────┘               │
│                                   │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │                    Configuration & Constants                          │ │
│  │                    (config.ts, constants.ts)                          │ │
│  └─────────────────────────────────┼─────────────────────────────────────┘ │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      │ Deepgram API
                                      │
┌─────────────────────────────────────┼───────────────────────────────────────┐
│                           DEEPGRAM CLOUD                                  │
│                    Real-time Speech Recognition                           │
│                    Model: 2-general-nova                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Audio Capture Flow
```
Chrome Tab → Content Script → React App → useAudioCapture Hook → MediaRecorder → WebSocket
```

### 2. Transcription Flow
```
WebSocket → Server → DeepgramService → Deepgram API → Real-time Transcript → Client
```

### 3. Connection Management
```
Client ↔ WebSocket (Port 8080) ↔ Server
Server ↔ Deepgram API (Keep-alive every 10s)
```

## Key Components

### Client Side
- **Content Script**: Chrome extension entry point
- **React App**: Main UI with transcription display
- **useAudioCapture**: Manages audio recording and streaming
- **useWebSocketConnection**: Handles WebSocket communication

### Server Side
- **Express App**: HTTP server with health endpoints
- **WebSocket Service**: Manages real-time client connections
- **Deepgram Service**: Handles AI transcription via Deepgram API
- **Configuration**: Environment and constant management

## Communication Protocols

- **WebSocket**: Real-time bidirectional communication (Port 8080)
- **HTTP**: Health checks and status endpoints (Port 3000)
- **Deepgram WebSocket**: AI transcription streaming
- **Chrome Extension APIs**: Tab capture and audio access

## Security & Configuration

- Environment-based API key management
- WebSocket connection validation
- Chrome extension permissions for audio capture
- Keep-alive mechanisms for stable connections
