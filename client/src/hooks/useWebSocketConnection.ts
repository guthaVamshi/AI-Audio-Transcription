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
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

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
