
'use client'
import React, { useEffect, useRef, useState } from 'react';
import ReChart from './ReChart';
import { rechartdata } from '@/schema/rechartdata';
import { toast } from 'react-hot-toast';

const WebcamStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [seconds, setSeconds] = useState<number>(0)
    //const [emotions, setEmotions] = useState<any>()
    //const socket = new WebSocket('ws://localhost:8765');
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY
    const socket = new WebSocket(`wss://api.hume.ai/v0/stream/models?apiKey=${encodeURIComponent(apiKey)}`);
    //const socket = new WebSocket("ws://localhost:8765/")//for debug

    let [emotions, setEmotions] = useState(
        [
            {
                emotion: "Joy",
                amount: 0.0003
            },
            {
                emotion: "Calmness",
                amount: 0.0002
            },
            {
                emotion: "Interest",
                amount: 0.0001
            }
        ])

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


            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                >
                    <div className='bg-red-800 h-2 w-2 rounded-full mr-2' />
                    <p className='text-center text-gray-300 p-1 text-sm'>Video recording in progress</p>
                </div>
            ))

        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                >
                    <div className='bg-black h-2 w-2 rounded-full mr-2' />
                    <p className='text-center text-gray-300 p-1 text-sm'>Video recording ended</p>
                </div>
            ))
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


    const returnTop3Emotions = (emotionsObject) => {

        let objects = [
            {
                emotion: "one",
                amount: 0.0003
            },
            {
                emotion: "two",
                amount: 0.0002
            },
            {
                emotion: "three",
                amount: 0.0001
            }
        ]

        for (const [key, value] of Object.entries(emotionsObject)) {

            if (key !== 'name') {

                let num = parseFloat(value)

                if (num > objects[0].amount) {

                    objects[0] = {
                        emotion: key,
                        amount: num
                    }
                    continue;
                }

                if (num > objects[1].amount) {

                    objects[1] = {
                        emotion: key,
                        amount: num
                    }

                    continue;
                }

                if (num > objects[2].amount) {

                    objects[2] = {
                        emotion: key,
                        amount: num
                    }

                    continue;
                }

            }

        }


        setEmotions(objects)

        return objects

    }

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

                        if (socketdata?.face?.predictions === undefined) {
                            return;
                        }
                        const d = socketdata?.face?.predictions[0]?.emotions

                        const emotionsObject = d.reduce((obj: any, { name, score }: { name: string, score: number }) => {
                            obj[name] = score.toFixed(3);
                            return obj;
                        }, {});

                        emotionsObject['name'] = seconds
                        console.log(emotionsObject)

                        returnTop3Emotions(emotionsObject)

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
        <div className='className="w-full max-w-xl rounded-lg flex flex-col items-center justify-center '>

            <video ref={videoRef} muted autoPlay playsInline className='w-full max-w-xs rounded-lg bg-black z-10 relative'>
                <canvas ref={canvasRef} className='w-1/5 max-w-xs rounded-lg bg-black absolute z-20 right-0 bottom-0' />
            </video>


            <div className='flex items-center gap-5 mt-2'>
                <div className='text-xs bg-gray-700 text-white bg-opacity-60'>Session: {time}</div>
                <button className="text-xs text-white bg-gray-800 p-2 shadow-lg  rounded-lg hover:bg-gray-700 opacity-75" onClick={startRecording}>Start Recording</button>
                <button className="text-xs text-white bg-gray-800 p-2 shadow-lg  rounded-lg hover:bg-gray-700 opacity-75" onClick={stopRecording}>Stop Recording</button>
                <button className="text-xs text-white bg-gray-800 p-2 shadow-lg  rounded-lg hover:bg-gray-700 opacity-75" onClick={saveVideo}>Save Video</button>
            </div>

            <div className='mt-3'>
                <div className='flex gap-2 justify-center items-center max-w-lg'>
                    <p className='text-center text-white text-xs '>Top Current Emotions: </p>
                    {
                        emotions.map((el, i) => (
                            <div key={`element-${i}`} className='p-1 bg-slate-400 bg-opacity-60 rounded-md'>
                                <p className='text-xs text-white'>{el.emotion}: <span>{Math.floor(el.amount * 100)}%</span></p>
                            </div>
                        ))
                    }

                </div>
            </div>

            {/* <ReChart data={rechartdata} /> */}
        </div>
    );
};

export default WebcamStream; 