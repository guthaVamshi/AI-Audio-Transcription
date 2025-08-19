import { useMemo, useRef, useState, useEffect } from "react";
import useAudioCapture from "./hooks/useAudioCapture";
import useWebSocketConnection from "./hooks/useWebSocketConnection";
import "./App.css";

function App(): JSX.Element {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const transcriptionAreaRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const AUDIO_CAPTURE_INTERVAL_MS: number = 1000; // Collect audio data in 1-second chunks
  const WEB_SOCKET_URL: string = "ws://localhost:8080"; // WebSocket server URL

  // Custom hook for WebSocket connection
  const { messageHistory, connectionStatus, sendAudioChunk, addSystemMessage } =
    useWebSocketConnection(
      WEB_SOCKET_URL,
      autoScroll,
      transcriptRef,
      transcriptionAreaRef
    );

  // Custom hook for audio capture
  const { startCapture, stopCapture } = useAudioCapture(
    AUDIO_CAPTURE_INTERVAL_MS,
    setIsCapturing,
    sendAudioChunk
  );

  const handleCaptureToggle = async () => {
    if (isCapturing) {
      stopCapture();
      addSystemMessage("Transcription stopped");
    } else {
      startCapture();
      addSystemMessage("Transcription started");
    }
    setIsCapturing(!isCapturing);
  };

  const statusClassName = useMemo(() => {
    const normalized = connectionStatus.toLowerCase();
    if (normalized === "open") return "status-badge status-open";
    if (normalized === "connecting") return "status-badge status-connecting";
    return "status-badge status-closed";
  }, [connectionStatus]);

  // Format timestamp for display
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Add connection status messages
  useEffect(() => {
    if (connectionStatus === "Open") {
      addSystemMessage("Connected to transcription server");
    } else if (connectionStatus === "Closed") {
      addSystemMessage("Disconnected from transcription server");
    }
  }, [connectionStatus, addSystemMessage]);

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <span className="dot" />
          <span>AI Audio Transcription</span>
        </div>
        <div className={statusClassName} id="status">
          {connectionStatus}
        </div>
      </header>

      <main
        className="transcription-area"
        id="transcription-area"
        ref={transcriptionAreaRef}
      >
        <div id="transcript" className="transcript" ref={transcriptRef}>
          {messageHistory.map((message) => (
            <div key={message.id} className={`transcript-message ${message.type === 'system' ? 'system-message' : ''}`}>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </div>
              <div className="message-text">
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="controls">
        <button
          className="control-btn start-btn"
          onClick={handleCaptureToggle}
          disabled={isCapturing}
        >
          Start Transcribing
        </button>
        <button
          className="control-btn stop-btn"
          onClick={stopCapture}
          disabled={!isCapturing}
        >
          Stop
        </button>
        <label className="auto-scroll">
          <div className="switch">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            <span className="slider" />
          </div>
          <span>Auto-scroll</span>
        </label>
      </footer>
    </div>
  );
}

export default App;
