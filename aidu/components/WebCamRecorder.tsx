
'use client'
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const WebcamRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      };

      recorder.start();
      setMediaRecorder(recorder);

    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const saveVideo = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded-video.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted></video>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={saveVideo}>Save Video</button>
    </div>
  );
};

export default WebcamRecorder;