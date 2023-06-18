
'use client'

import React, { useEffect, useRef } from 'react';

const WebcamStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    //const socket = new WebSocket('ws://localhost:8765');
    const apiKey = "3mz6tw5RyAwKATiHJDZlQQg9zT6jVv87vjdnNSUs257owiGY"
    const socket = new WebSocket(`wss://api.hume.ai/v0/stream/models?apiKey=${encodeURIComponent(apiKey)}`);

    socket.onopen = () => {
        console.log('WebSocket connection established.');

    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                // ...
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });
    }, []);

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

                console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                const payloadString = JSON.stringify(payload);
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(payloadString);
                    socket.onmessage = (event) => {
                        console.log(event.data);
                    }
                }

                setTimeout(processFrame, 1000);
            }
        };

        processFrame();
    }, []);



    return (
        <div>
            <video ref={videoRef} autoPlay playsInline className='' />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default WebcamStream; 