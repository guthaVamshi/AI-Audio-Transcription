import { useMemo, useRef, useState, useEffect } from "react";
import useAudioCapture from "./hooks/useAudioCapture";
import useWebSocketConnection from "./hooks/useWebSocketConnection";
import { exportTranscription, downloadFile, ExportOptions } from "./utils/exportUtils";
import "./App.css";

function App(): JSX.Element {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'txt',
    includeTimestamps: true,
    includeSystemMessages: false
  });
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
  const { startCapture, pauseCapture, resumeCapture, stopCapture } = useAudioCapture(
    AUDIO_CAPTURE_INTERVAL_MS,
    (state) => {
      setIsCapturing(state.isCapturing);
      setIsPaused(state.isPaused);
    },
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
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeCapture();
      addSystemMessage("Transcription resumed");
    } else {
      pauseCapture();
      addSystemMessage("Transcription paused");
    }
  };

  const handleExport = () => {
    if (messageHistory.length === 0) {
      addSystemMessage("No transcription data to export");
      return;
    }

    const content = exportTranscription(messageHistory, exportOptions);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `transcription-${timestamp}.${exportOptions.format}`;
    
    const mimeTypes = {
      txt: 'text/plain',
      json: 'application/json',
      csv: 'text/csv',
      srt: 'text/plain'
    };
    
    downloadFile(content, filename, mimeTypes[exportOptions.format]);
    addSystemMessage(`Transcription exported as ${exportOptions.format.toUpperCase()}`);
    setShowExportModal(false);
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
        <div className="control-buttons">
          {!isCapturing ? (
            <button
              className="control-btn start-btn"
              onClick={handleCaptureToggle}
            >
              Start Transcribing
            </button>
          ) : (
            <>
              <button
                className="control-btn pause-btn"
                onClick={handlePauseResume}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                className="control-btn stop-btn"
                onClick={handleCaptureToggle}
              >
                Stop
              </button>
            </>
          )}
        </div>
        
        <div className="secondary-controls">
          <button
            className="export-btn"
            onClick={() => setShowExportModal(true)}
            disabled={messageHistory.length === 0}
          >
            Export
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
        </div>
      </footer>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Export Transcription</h3>
            
            <div className="export-options">
              <div className="option-group">
                <label>Format:</label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                >
                  <option value="txt">Plain Text (.txt)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="srt">SubRip (.srt)</option>
                </select>
              </div>
              
              <div className="option-group">
                <label>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTimestamps}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeTimestamps: e.target.checked }))}
                  />
                  Include timestamps
                </label>
              </div>
              
              <div className="option-group">
                <label>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeSystemMessages}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeSystemMessages: e.target.checked }))}
                  />
                  Include system messages
                </label>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleExport}>
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
