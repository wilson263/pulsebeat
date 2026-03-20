import { useState, useRef, useCallback, useEffect } from 'react';

function getBestMimeType(): string {
  const candidates = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return 'video/webm';
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, min: 20 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  const stopStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const recordVideo = useCallback((durationMs: number = 15000): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !videoRef.current.srcObject) {
        return reject(new Error("No active stream"));
      }

      const stream = videoRef.current.srcObject as MediaStream;
      const mimeType = getBestMimeType();

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_000_000 });
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
        resolve(blob);
      };

      mediaRecorder.start(500);
      setIsRecording(true);
      setProgress(0);

      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        setProgress(Math.min((elapsed / durationMs) * 100, 100));
      }, 100);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        setIsRecording(false);
        clearInterval(interval);
        setProgress(100);
      }, durationMs);
    });
  }, []);

  return {
    videoRef,
    isStreaming,
    isRecording,
    progress,
    error,
    startStream,
    stopStream,
    recordVideo,
  };
}
