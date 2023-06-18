import { useState, useRef } from "react";

const mimeType = "audio/webm";

import {PaperAirplaneIcon, MicrophoneIcon} from '@heroicons/react/24/solid'

import {toast} from 'react-hot-toast'

import {CircularProgress} from '@mui/material'

import {Configuration, OpenAIApi } from 'openai'

import {convertToMP3} from '@/utils/audioConvertor'

const AudioRecorder = ({dispatch}) => {

    const [loading, setLoading] = useState(false)
	const [permission, setPermission] = useState(false);
	const mediaRecorder = useRef(null);
	const [recordingStatus, setRecordingStatus] = useState("inactive");
	const [stream, setStream] = useState(null);
	const [audio, setAudio] = useState(null);
	const [audioChunks, setAudioChunks] = useState([]);
    const [recordingInProgress, setRecordingInProgress] = useState(false)

	const getMicrophonePermission = async () => {
		
        if ("MediaRecorder" in window) {
			try {
		
				setPermission(true);
				//setStream(mediaStream);

                return true;

			} catch (err) {
                toast.custom((t) => (
                    <div
                        className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                    >
                    
                        <p className='text-center text-gray-300 p-1 text-sm'>Please Enable The Audio Permission</p>
                    </div>
                ))

                return false
			}
		
        } else {

            toast.custom((t) => (
                <div
                    className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                >
                    <p className='text-center text-gray-300 p-1 text-sm'>The MediaRecorder API is not supported in your browser.</p>
                </div>
            ))
			return false
		}
	};

	const startRecording = async () => {

        let permissionEnabled = await getMicrophonePermission()
        
        if (!permissionEnabled) {
            return;
        }

        setRecordingInProgress(true)
	
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        setStream(mediaStream)

		const media = new MediaRecorder(mediaStream, { type: mimeType });

		mediaRecorder.current = media;

		mediaRecorder.current.start();

        toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
            >
            <div className='bg-red-800 h-2 w-2 rounded-full mr-2' />  
              <p className='text-center text-gray-300 p-1 text-sm'>Audio recording in progress</p>
            </div>
        ))

		let localAudioChunks = [];

		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};

	const stopRecording = () => {
	
        setRecordingInProgress(false)
		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
        
            const myFile = new File([audioBlob], 'audio.mp3', {
                type: audioBlob.type,
            });

            let audioUrl = URL.createObjectURL(audioBlob);
            setLoading(true)

            let formData = new FormData();
            formData.append('file', myFile);  
            formData.append("model", "whisper-1")

            fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
              
            }).then((res) => {
                return res.json()
            }).then((data) => {
                dispatch({ type: "SET_INPUT", payload: data.text})
                setLoading(false)
                return data
            })
            .catch((e) => {
                console.log(e)
                setLoading(false)
            })


            return;
            fetch('/api/whisper-transcript', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                body: formData
            })
            .then((res) =>{
                console.log(res)
                return res.json()
            })
            .then((data) => {
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })
        
			//const audioUrl = URL.createObjectURL(audioBlob);


			setAudio(audioUrl);

			setAudioChunks([]);
		};
	};

	return (

        <>
        
            {
                loading ? (
                    <div className='mr-3 rounded-full p-2 bg-white'>
                        <div className='p-2 flex items-center justify-center rounded-full border-2 border-white' >
                            <CircularProgress
                                size={20}
                                className="text-black"
                            />
                        </div>
                    </div>
                ): (
                    <>

                        {
                            !recordingInProgress ? (
                                <button onClick={startRecording} className='mr-3 rounded-full p-2 bg-white'>
                                    <div className='p-2 rounded-full border-2 border-white' >
                                        <MicrophoneIcon
                                            className="object-contain h-5 w-5 text-black"
                                        />
                                    </div>
                                </button>
                            ): (
                                <button onClick={stopRecording} className='mr-3 rounded-full p-2 bg-white'>
                                    <div className='p-2 rounded-full border-2 border-red-700' >
                                        <MicrophoneIcon
                                            className="object-contain h-5 w-5 text-red-700"
                                        />
                                    </div>
                                </button>
                            )
                        }
                    </>
                )
            }
        </>
		
		/* 
            <h2>Audio Recorder</h2>
			<main>
				<div className="audio-controls">
					{!permission ? (
						<button onClick={getMicrophonePermission} type="button">
							Get Microphone
						</button>
					) : null}
					{permission && recordingStatus === "inactive" ? (
						<button onClick={startRecording} type="button">
							Start Recording
						</button>
					) : null}
					{recordingStatus === "recording" ? (
						<button onClick={stopRecording} type="button">
							Stop Recording
						</button>
					) : null}
				</div>
				{audio ? (
					<div className="audio-player">
						<audio src={audio} controls></audio>
						<a download href={audio}>
							Download Recording
						</a>
					</div>
				) : null}
			</main>
		</div> */
        

    )

};

export default AudioRecorder;