"use client"

import { motion } from 'framer-motion'
import WebcamStream from '@/components/WebcamStream'

const metadata = {
    title: "AIDU"
}

const carouselVariants = {
    initial: {
        opacity: 1,
        y: -100
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.5,
            duration: 1,
            ease: "easeInOut"
        }
    }
}

export default function About(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col justify-between items-center p-24">
            <div className="w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col text-sm">
                <h1 className="title flex flex-col md:flex-row">It all starts with&nbsp;

                    <span className="overflow-hidden h-[1em]">
                        <motion.span className='flex flex-col' initial="initial" animate="animate" variants={carouselVariants}>
                            <span>AI</span>
                            <span>爱</span>
                        </motion.span>
                    </span>
                </h1>
                <div>
                    <h2>
                        In Chinese, AI means love. We believe in using the power of AI to better understand ourselves and our relationships, for a happier and more connected world.
                    </h2>
                </div>
            </div>
            <WebcamStream></WebcamStream>
        </div >
    )
}