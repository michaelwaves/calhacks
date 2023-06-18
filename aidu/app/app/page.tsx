
'use client'

import WebcamStream from "@/components/WebcamStream"

//import WebcamStream from "@/WebcamStream"
import Chat from "@/components/Chat"
import Header from "@/components/Header2"
import VideoDisplay from "@/components/VideoDisplay"
import Dalle from "@/components/Dalle"
import { useEffect } from "react"
import { toast } from "react-hot-toast"
//import WebcamRecorder from "@/components/WebCamRecorder"

let cloudsBig = '/assets/images/clouds-big.jpg'


const metadata = {
    title: "AIDU"
}

export default function App() {

    useEffect(() => {

        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
            >
                <p className='text-center text-gray-300 p-1 text-md'>Welcome Dear User!</p>
            </div>
        ))

        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-xs px-5 bg-gray-800 opacity-70 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center `}
            >
                <p className='text-center text-gray-300 p-1 text-md'>Please press START RECORDING to get started</p>
            </div>
        ))

    }, [])

    return (
        <>

            <Header />

            <main>
                <div className="relative isolate bg-gray-800 pb-16 pt-14 sm:pb-20 min-h-screen">
                    <img
                        src={cloudsBig}
                        alt="Clouds"
                        className="absolute inset-0 -z-10 h-full w-full object-cover mix-blend-overlay"
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-10 justify-center space-x-2">
                        {/*                     <WebcamStream/> */}

                        <Dalle />
                    </div>

                    <div className="mx-auto max-w-7xl text-center mt-10">
                        <Chat />
                    </div>
                </div>
            </main>


        </>
    )
}