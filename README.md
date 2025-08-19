# AI Audio Transcription Chrome Extension

A Chrome browser extension that provides real-time audio transcription from any active browser tab using AI-powered speech recognition.

## ✨ Features

- **Real-Time Transcription**: Capture and transcribe audio from any active browser tab
- **AI-Powered**: Utilizes Deepgram's live transcription API for accurate results
- **Side Panel Interface**: Modern Chrome Side Panel for persistent, non-intrusive access
- **WebSocket Communication**: Real-time data streaming between extension and server
- **Cross-Tab Support**: Works with any tab that plays audio content

## 🏗️ Architecture

The project consists of two main components:

- **Chrome Extension (Client)**: React-based UI that captures tab audio and displays transcriptions
- **Backend Server**: Node.js server that processes audio through Deepgram's API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Chrome browser with Side Panel support
- Deepgram API key

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd chrome-ai-audio-transcription
```

### 2. Backend Server

```bash
cd server
npm install

# Create .env file with your Deepgram API key
echo "DEEPGRAM_API_KEY=your_api_key_here" > .env

npm start
```

### 3. Chrome Extension

```bash
cd client
npm install
npm run build
```

### 4. Load Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `client/dist` folder

## 🎯 Usage

1. Navigate to any webpage with audio content
2. Click the extension icon in your toolbar
3. The Side Panel will open automatically
4. Click "Start Transcribing" to begin audio capture
5. View real-time transcriptions in the panel

## 🔧 Configuration

### Deepgram API

The extension requires a Deepgram API key for transcription services:

1. Sign up at [Deepgram](https://deepgram.com/)
2. Generate an API key
3. Add to `server/.env` file

### Server Settings

Default server runs on `localhost:8080`. Update WebSocket URL in `client/src/App.tsx` if needed.

## 🛠️ Development

### Client Development

```bash
cd client
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Server Development

```bash
cd server
npm run dev        # Development with auto-reload
npm start          # Production start
```

## 📁 Project Structure

```
chrome-ai-audio-transcription/
├── client/                 # Chrome extension UI
│   ├── src/               # React source code
│   ├── public/            # Extension assets
│   └── dist/              # Built extension (load this)
├── server/                 # Backend transcription service
│   ├── src/               # Server source code
│   └── config/            # Configuration files
└── README.md              # This file
```

## 🔒 Permissions

The extension requires these Chrome permissions:

- `tabs`: Access to browser tabs
- `tabCapture`: Capture audio from tabs
- `sidePanel`: Display in Chrome Side Panel
- `scripting`: Execute content scripts
- `activeTab`: Access to currently active tab

## 🌐 Browser Support

- Chrome 114+ (Side Panel API support)
- Chromium-based browsers with Side Panel support

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include browser version and error logs
