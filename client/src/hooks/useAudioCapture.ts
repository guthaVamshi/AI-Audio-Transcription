import { useRef, useState } from "react";

interface AudioCaptureState {
  isCapturing: boolean;
  isPaused: boolean;
  startTime: Date | null;
  totalDuration: number;
}

function useAudioCapture(
  AudioCaptureInvervalMS: number,
  setIsCapturing: (state: AudioCaptureState) => void,
  onDataAvailable: (audioBlob: Blob) => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const [captureState, setCaptureState] = useState<AudioCaptureState>({
    isCapturing: false,
    isPaused: false,
    startTime: null,
    totalDuration: 0
  });

  const setupMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        onDataAvailable(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    };

    mediaRecorder.start(AudioCaptureInvervalMS);
  };

  const startCapture = async () => {
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      if (chrome.runtime.lastError || !stream) {
        console.error("Error capturing audio:", chrome.runtime.lastError);
        return;
      }

      audioStreamRef.current = stream;

      try {
        const output = new AudioContext();
        const source = output.createMediaStreamSource(stream);
        source.connect(output.destination);
      } catch (error) {
        console.error("Error creating audio context:", error);
      }

      setupMediaRecorder(stream);
      
      const newState: AudioCaptureState = {
        isCapturing: true,
        isPaused: false,
        startTime: new Date(),
        totalDuration: 0
      };
      setCaptureState(newState);
      setIsCapturing(newState);
    });
  };

  const pauseCapture = () => {
    if (mediaRecorderRef.current && captureState.isCapturing && !captureState.isPaused) {
      mediaRecorderRef.current.pause();
      const newState: AudioCaptureState = {
        ...captureState,
        isPaused: true
      };
      setCaptureState(newState);
      setIsCapturing(newState);
    }
  };

  const resumeCapture = () => {
    if (mediaRecorderRef.current && captureState.isCapturing && captureState.isPaused) {
      mediaRecorderRef.current.resume();
      const newState: AudioCaptureState = {
        ...captureState,
        isPaused: false
      };
      setCaptureState(newState);
      setIsCapturing(newState);
    }
  };

  const stopCapture = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    const newState: AudioCaptureState = {
      isCapturing: false,
      isPaused: false,
      startTime: null,
      totalDuration: 0
    };
    setCaptureState(newState);
    setIsCapturing(newState);
  };

  return { 
    startCapture, 
    pauseCapture, 
    resumeCapture, 
    stopCapture, 
    captureState 
  };
}

export default useAudioCapture;
