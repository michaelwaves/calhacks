
import React, { useEffect, useRef, useState } from 'react';
import ReChart from './ReChart';
import { rechartdata } from '@/schema/rechartdata';

const WebcamStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [seconds, setSeconds] = useState<number>(0)
    const [emotions, setEmotions] = useState<any>()
    //const socket = new WebSocket('ws://localhost:8765');
    const apiKey = "3mz6tw5RyAwKATiHJDZlQQg9zT6jVv87vjdnNSUs257owiGY"
    const socket = new WebSocket(`wss://api.hume.ai/v0/stream/models?apiKey=${encodeURIComponent(apiKey)}`);
    //const socket = new WebSocket("ws://localhost:8765/")//for debug

    socket.onopen = () => {
        console.log('WebSocket connection established.');

    };

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

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        const processFrame = () => {
            if (canvas && context && videoRef.current) {
                context.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                // Perform image processing operations on the canvas
                const processedFrameData = canvas?.toDataURL('image/png');
                const encodedFrame = processedFrameData?.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                //Hume pub schema
                const payload = {
                    "data": encodedFrame,
                    "models": {
                        "face": {
                            "facs": {},
                            "descriptions": {},
                            "identify_faces": false
                        },
                    },
                    "stream_window_ms": 5000,
                    "reset_stream": false,
                    "raw_text": false,
                    "job_details": false,
                    "payload_id": "fcgdaeb"
                }
                const payloadString = JSON.stringify(payload);

                if (socket.readyState === WebSocket.OPEN) {

                    //production
                    socket.send(payloadString);
                    socket.onmessage = (event) => {
                        const socketdata = JSON.parse(event.data);
                        const d = socketdata.face.predictions[0].emotions
                        const emotionsObject = d.reduce((obj: any, { name, score }: { name: string, score: number }) => {
                            obj[name] = score.toFixed(3);
                            return obj;
                        }, {});

                        emotionsObject['name'] = seconds
                        console.log(emotionsObject)

                        //debug
                        /* socket.send("hi")
                        socket.onmessage = (event) => {
                            console.log(event.data)
                        } */
                    }


                }
                setTimeout(processFrame, 1000);


            }
        };

        processFrame();
    }, []);

    //timers
    const [time, setTime] = useState(0);


    useEffect(() => {
        // Start the timer when the component mounts
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        // Clean up the timer when the component unmounts
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <div>{time}</div>
            <video ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} />
            <button className="submit-button" onClick={startRecording}>Start Recording</button>
            <button className="submit-button" onClick={stopRecording}>Stop Recording</button>
            <button className="submit-button" onClick={saveVideo}>Save Video</button>
            <ReChart data={rechartdata} />
        </div>
    );
};

export default WebcamStream; 