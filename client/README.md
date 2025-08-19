# Chrome Extension UI

Modern React-based user interface for the AI Audio Transcription Chrome extension.

## 🎯 Overview

This client provides the Chrome extension interface built with:
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Modern CSS** with CSS variables and responsive design
- **Chrome Side Panel API** for persistent, non-intrusive access

## 🚀 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
client/
├── src/                    # Source code
│   ├── App.tsx           # Main application component
│   ├── hooks/            # Custom React hooks
│   │   ├── useAudioCapture.ts      # Audio capture logic
│   │   └── useWebSocketConnection.ts # WebSocket handling
│   ├── App.css           # Application styles
│   └── index.css         # Global styles
├── public/                # Extension assets
│   ├── manifest.json     # Extension manifest
│   ├── service-worker.js # Background service worker
│   └── content.js        # Content script (if needed)
└── dist/                  # Built extension (load this in Chrome)
```

## 🔧 Key Components

### App.tsx
Main UI component with:
- Audio capture controls (Start/Stop)
- Real-time transcription display
- Connection status indicator
- Auto-scroll toggle

### useAudioCapture Hook
Handles Chrome tab audio capture:
- Tab audio stream capture
- MediaRecorder setup
- Audio data streaming

### useWebSocketConnection Hook
Manages server communication:
- WebSocket connection state
- Real-time message handling
- Audio data transmission

## 🎨 UI Features

- **Dark Theme**: Modern dark interface with blue accents
- **Status Badges**: Visual connection status indicators
- **Responsive Layout**: Adapts to Side Panel dimensions
- **Smooth Animations**: Hover effects and transitions
- **Auto-scroll**: Optional transcript auto-scrolling

## 📱 Chrome Extension

### Loading the Extension

1. Build the project: `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `client/dist` folder

### Manifest Features

- **Side Panel**: Opens in Chrome's Side Panel for persistent access
- **Permissions**: Tab capture, scripting, and side panel access
- **Background**: Service worker for extension lifecycle management

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔍 Troubleshooting

### Common Issues

- **Extension not loading**: Ensure `client/dist` folder exists and contains built files
- **Audio not capturing**: Check Chrome permissions and tab audio availability
- **Connection errors**: Verify server is running on correct WebSocket URL

### Debug Mode

Enable Chrome DevTools for the extension:
1. Right-click extension icon
2. Select "Inspect popup" or "Inspect"
3. Check Console for errors

## 📚 Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **ESLint**: Code quality
- **Chrome APIs**: Extension functionality

## 🤝 Contributing

1. Follow the existing code style
2. Test changes in development mode
3. Ensure the extension builds successfully
4. Test in Chrome before submitting
