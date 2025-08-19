import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface TranscriptionMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: 'transcription' | 'system';
}

interface WebSocketConnectionProps {
  messageHistory: TranscriptionMessage[];
  connectionStatus: string;
  sendAudioChunk: (audioBlob: Blob) => void;
  addSystemMessage: (message: string) => void;
}

function useWebSocketConnection(
  socketUrl: string,
  autoScroll: boolean,
  transcriptRef: React.RefObject<HTMLDivElement>,
  transcriptionAreaRef: React.RefObject<HTMLDivElement>
): WebSocketConnectionProps {
  const [messageHistory, setMessageHistory] = useState<TranscriptionMessage[]>([]);
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log('🔌 WebSocket: Connection opened successfully');
    },
    onClose: (event) => {
      console.log('🔌 WebSocket: Connection closed:', event.code, event.reason);
    },
    onError: (error) => {
      console.error('🔌 WebSocket: Connection error:', error);
    },
    onMessage: (message) => {
      console.log('🔌 WebSocket: Message received:', message);
    },
    shouldReconnect: (closeEvent) => {
      console.log('🔌 WebSocket: Should reconnect?', closeEvent.code !== 1000);
      return closeEvent.code !== 1000;
    },
    reconnectAttempts: 5,
    reconnectInterval: 2000,
  });

  const appendToMessageHistory = useCallback(
    (message: MessageEvent) => {
      const newMessage: TranscriptionMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: message.data,
        timestamp: new Date(),
        type: 'transcription'
      };
      setMessageHistory((prev) => [...prev, newMessage]);
    },
    []
  );

  const addSystemMessage = useCallback(
    (message: string) => {
      const systemMessage: TranscriptionMessage = {
        id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: message,
        timestamp: new Date(),
        type: 'system'
      };
      setMessageHistory((prev) => [...prev, systemMessage]);
    },
    []
  );

  useEffect(() => {
    if (lastMessage !== null) {
      appendToMessageHistory(lastMessage);

      if (autoScroll && transcriptionAreaRef.current && transcriptRef.current) {
        // Use requestAnimationFrame to ensure scrolling after the DOM update
        requestAnimationFrame(() => {
          transcriptionAreaRef.current!.scrollTo({
            top: transcriptionAreaRef.current!.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }
  }, [
    lastMessage,
    autoScroll,
    transcriptRef,
    transcriptionAreaRef,
    appendToMessageHistory,
  ]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const sendAudioChunk = (audioBlob: Blob) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(audioBlob);
    } else {
      console.error("WebSocket is not open. Cannot send audio chunk.");
    }
  };

  return { messageHistory, connectionStatus, sendAudioChunk, addSystemMessage };
}

export default useWebSocketConnection;
