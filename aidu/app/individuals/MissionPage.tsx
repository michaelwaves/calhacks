import { motion } from "framer-motion"
import { buttonVariants } from "../utils/FramerMotion"
import Accordion2 from "../components/accordion/Accordion2"

export default function MissionPage(): JSX.Element {
    return (
        <div className="p-5 flex flex-row space-x-5 w-full h-full bg-gradient-to-r from-[#99FDFF] to-[#D1B3FF]">
            <div className="w-1/4 bg-[#181a20] rounded-xl flex flex-col">
                <div className="w-full items-center flex flex-col justify-center rounded-t-xl bg-[#1f222a]">
                    <h2>WorkSpace</h2>
                </div>
                <Accordion2 />
            </div>
            <div className="w-3/4 h-full bg-[#364154] rounded-xl flex flex-col relative">
                <div className="w-full h-auto flex flex-row space-x-2 p-2 justify-start items-center text-white">
                    <img src="/pfp_square_1.png" alt="" className="w-8 h-8 rounded-full" />
                    <p className="">Ava Turner</p>
                </div>
                <div className="h-[500px] w-full bg-[#20293a] rounded-b-lg">

                </div>
                <div id="reply" className="w-full flex-col flex justify-center absolute bottom-0 p-4 ">
                    <div className="w-auto h-auto shadow-[2px_2px_3px_#6335F8] rounded-b-lg ">
                        <input type="text" placeholder="Reply..." className="w-full p-2 bg-[#262a35] caret-white text-white focus:outline-none shadow-md rounded-t-xl" />
                        <div className="flex flex-row bg-[#35383f] rounded-b-lg ">
                            <div className="flex-row flex justify-center space-x-2 m-4 text-3xl ">
                                <button className="text-white text-xl border-gray-500 mx-2">➕</button>
                                <div className="w-[1px] h-full bg-gray-600"></div>
                                <button className="text-white text-xl border-gray-500">🎙️</button>
                                <button className="text-white text-xl border-gray-500">🎥</button>
                                <div className="w-[1px] h-full bg-gray-600"></div>
                            </div>
                            <div className="flex-row flex justify-center w-full space-x-2 m-2">
                                <motion.button
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariants}
                                    className="button inset">🤔Request a hint</motion.button>
                                <motion.button
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariants}
                                    className="button inset">📃Request a solution</motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}