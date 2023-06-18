
'use client'

import {useState, useRef, useEffect} from 'react'

import {PaperAirplaneIcon, MicrophoneIcon} from '@heroicons/react/24/solid'

import {toast} from 'react-hot-toast'

//import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

import {CircularProgress} from '@mui/material'

import AudioRecorder from './AudioRecorder'

const Chat = () => {

    const [recordingInProgress, setRecordingInProgress] = useState(false)

    //const [stream, setStream] = useState(null);
    const [blob, setBlob] = useState(null);
    const refVideo = useRef(null);
    const recorderRef = useRef(null);

    const [loading, setLoading] = useState(false)

    const mimeType = "audio/webm";

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);

/*

    const handleRecording = async () => {
        // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        navigator.mediaDevices.getUserMedia({
          audio: true
        }).then((streamProvided) => {
            setStream(streamProvided);

        

            toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                >
                <div className='bg-red-800 h-2 w-2 rounded-full mr-2' />  
                  <p className='text-center text-gray-300 p-1 text-sm'>Recording in progress</p>
                </div>
            ))

            //setStream(mediaStream);
            
            recorderRef.current = new RecordRTC(mediaStream, { type: 'audio' });
            recorderRef.current.startRecording();
            setRecordingInProgress(true)

        }).catch((err) => {

            console.log(err)
            toast.custom((t) => (
                <div
                    className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
                >
                
                    <p className='text-center text-gray-300 p-1 text-sm'>Please Enable The Audio Permission</p>
                </div>
            ))

        })

    };
    
    const handleStop = () => {
        recorderRef.current.stopRecording(() => {
            setBlob(recorderRef.current.getBlob());
            setRecordingInProgress(false)

            let formData = new FormData();

   
            formData.append('file', recorderRef.current.getBlob());

            fetch('/api/whisper-transcript',{
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                body: formData
            })
            .then((res) =>{
                return res.json()
            })
            .then((data) => {
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })
        
        });
    };


    */

    return (

        <section className='text-gray-800 items-center justify-center flex'>
            <div className="flex flex-col flex-grow min-h-max w-full bg-opacity-50 bg-gray-800 shadow-xl overflow-hidden rounded-2xl p-5">
                <div className="h-48 flex flex-col flex-grow p-4 overflow-auto relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {
                        [1, 2, 3, 4, 5].map((el, i) => (
                            <>
                                <div className="flex w-11/12 mt-2 space-x-3 max-w-3xl">
                                    <div className="bg-gray-500 bg-opacity-80 p-3 rounded-r-lg rounded-bl-lg">
                                        <p className="text-sm text-gray-300 text-left">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus ipsum delectus nisi eaque sit, nam aspernatur omnis sint quidem necessitatibus excepturi ut non maxime, consectetur asperiores cum eveniet ullam! Similique?</p>
                                    </div>
                                </div>
                                
                                <div className="flex w-11/12 mt-2 space-x-3 max-w-3xl ml-auto justify-end">
                                    <div className="bg-blue-600 bg-opacity-60 text-white p-3 rounded-l-lg rounded-br-lg">
                                        <p className="text-sm text-left">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad incidunt aspernatur porro numquam ea. Natus, quisquam expedita dolores inventore dolorem consequatur est autem? Earum explicabo tenetur temporibus ad doloremque dolorem!</p>
                                    </div>
                                </div>
                            </>
                        ))
                    }
                </div>
            <div className="bg-gray-600 p-2 flex items-center rounded-xl bg-opacity-30">

                <AudioRecorder/>

                <form className="flex w-full">
                    <input className="text-white flex items-center h-10 w-full rounded px-3 text-sm bg-gray-600" type="text" placeholder="Type your message…"/>
                    <button type="submit" className="ml-2">
                        <PaperAirplaneIcon
                            className="object-contain h-6 w-6 text-gray-100"
                        />
                    </button>
                </form>
            </div>
            
            </div>

        </section>
                        
    )
}

export default Chat