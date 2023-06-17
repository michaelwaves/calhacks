export default function Home() {
    return (
        <div className="min-h-screen h-auto flex flex-col justify-between items-center">
            <div className="w-full h-screen items-center justify-center flex flex-col">
                <h1 className="title">We Help You</h1>
                <h2>Foster Your Relationships and Mental Health</h2>
            </div>
            <div className="w-full h-screen items-center flex flex-col">
                <h2 className="text-4xl">Introducing Aidu, your custom AI</h2>
                <h1 className="title">Therapist</h1>
                {/* <h2>
                    Aidu has been fine tuned on over 1000 anonymized therapy transcripts and runs on the latest language and sentiment
                    analysis models for a seamless therapy experience.
                </h2> */}
            </div>
            <div className="w-full h-screen items-center justify-center flex flex-col">
                <h1 className="title">Try Aidu now</h1>
                <button className="submit-button">Begin Session</button>
            </div>
        </div>
    )
}
