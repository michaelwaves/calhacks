import Header from "@/components/Header2"
import Link from "next/link"
let cloudsBig = '/assets/images/clouds-big.jpg'

export default function Home() {
    return (
        <>
        
        <div className="bg-white">
        <Header/>
        <main>
            <div className="relative isolate overflow-hidden bg-gray-800 pb-16 pt-14 sm:pb-20">
            <img
                src={cloudsBig}
                alt="Clouds"
                className="absolute inset-0 -z-10 h-full w-full object-cover mix-blend-overlay"
            />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl leading-7">
                    Introducing AIDU, your custom AI Therapist
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        We help you foster your relationships and mental health
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href='/app'>
                        <button
                        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                        >
                        Get started
                        </button>
                    </Link>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
        </div>

        </>
    )
}
