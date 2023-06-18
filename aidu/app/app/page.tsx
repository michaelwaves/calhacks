import Chat from "@/components/Chat"
import Header from "@/components/Header2"
import VideoDisplay from "@/components/VideoDisplay"

let cloudsBig = '/assets/images/clouds-big.jpg'

export default function App () {

    return (
        <>
        
        <Header/>
        
        <main>
            <div className="relative isolate overflow-hidden bg-gray-800 pb-16 pt-14 sm:pb-20 h-screen">
                <img
                    src={cloudsBig}
                    alt="Clouds"
                    className="absolute inset-0 -z-10 h-full w-full object-cover mix-blend-overlay"
                />

                <div className="flex items-center gap-10 justify-center space-x-2">
                    <VideoDisplay/>
                    <VideoDisplay/>
                </div>

                <div className="mx-auto max-w-7xl text-center mt-10">
                    <Chat/>
                </div>
            </div>
        </main>

        
        </>
    )
}