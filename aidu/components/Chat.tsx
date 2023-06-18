
'use client'

import { PineconeClient } from "@pinecone-database/pinecone";


import axios from "axios";
import { useState, useRef, useEffect, useReducer } from 'react'

import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/solid'

import { toast } from 'react-hot-toast'

//import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

import { CircularProgress } from '@mui/material'

import AudioRecorder from './AudioRecorder'

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { get } from 'http';

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const pinecone = new PineconeClient();
pinecone.init({
    environment: "us-west4-gcp-free",
    apiKey: "4a49489b-e4a9-4b70-a2c4-d326df8ebbea",
});

// Specify the type of your metadata
type Metadata = { text: string };


type State = {
    messages: ChatCompletionRequestMessage[];
    input: string;
    output: string;
    loading: boolean;
    error: boolean;
};

type Action = {
    type: string;
    payload: any;
}

const initialState = {
    messages: [],
    input: "",
    output: "",
    loading: false,
    error: false,
};


const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_INPUT":
            return {
                ...state,
                input: action.payload,
            };
        case "SET_OUTPUT":
            return {
                ...state,
                output: action.payload,
            };
        case "ADD_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case "EDIT_MESSAGE":
            return {
                ...state,
                messages: state.messages.map((message, index) => {
                    if (index === action.payload.index) {
                        return {
                            ...message,
                            content: action.payload.content,
                        };
                    }
                    return message;
                }
                ),
            }
        case "RESET_MESSAGES":
            return {
                ...state,
                messages: [],
            };
        case "REMOVE_MESSAGE":
            return {
                ...state,
                messages: state.messages.filter(
                    (_, index) => index !== action.payload
                ),
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

const Chat = () => {
    // Instantiate a client
    const createEmbeddings = async ({ token, model, input }: { token: string, model: string, input: string }) => {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            method: 'POST',
            body: JSON.stringify({ input, model }),
        });

        const { error, data, usage } = await response.json();

        return data;
    };
    /* const query = async ({ token, vector, namespace }) => {
        const response = await fetch('https://chathistory-0aa6622.svc.us-west4-gcp-free.pinecone.io', {
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': token,
            },
            method: 'POST',
            body: JSON.stringify({
                vector,
                namespace,
                topK: 5,
                includeMetadata: true,
            }),
        });

        const data = await response.json();
        return data.matches.map(match => match.metadata);
    };
    const pinecone = new PineconeClient<Metadata>({
        apiKey: "4a49489b-e4a9-4b70-a2c4-d326df8ebbea",
        baseUrl: 'https://chathistory-0aa6622.svc.us-west4-gcp-free.pinecone.io'
    });
 */
    const [state, dispatch] = useReducer(reducer, initialState);
    const [context, setContext] = useState();

    const bottomEl = useRef(null)

    const scrollToBottom = () => {

        if (bottomEl?.current) {
            bottomEl?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

    };

    useEffect(() => {
        console.log(state);
        console.log(state.messages.at(-2))
        const userMessage = state.messages.at(-2)
        console.log(userMessage?.content)
        const postData = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/get_similar_texts?text=${encodeURIComponent(userMessage?.content)}&k=${10}`);
                console.log(response.data);
                const therapistLines = response.data
                    .map(item => item.text)
                    .join(' ');
                //console.log(therapistLines)
                return therapistLines;
            } catch (error) {
                console.error(error);
            }
        };


        const apiCall = async (context: string) => {
            const prompt = `You, the assistant, are a therapist and the user is the client . Continue the conversation based on the context of similar therapy sessions and chat history below\n\nContext: ${context}`
            const p = [{ "role": "system", "content": prompt }, ...state.messages]
            try {
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: p,
                    max_tokens: 400,
                    temperature: 0,
                })
                dispatch({ type: "SET_OUTPUT", payload: completion.data.choices[0].message?.content });
                dispatch({ type: "ADD_MESSAGE", payload: { role: "assistant", content: completion.data.choices[0].message?.content } });

            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: true });
            }
            dispatch({ type: "SET_LOADING", payload: false });
        }
        if (state.messages.length > 0) {
            if (state.messages.at(-1).role === "user" && state.messages.at(-1).content !== "") {
                postData().then((context) => {
                    apiCall(context);
                });
            }
        }


        scrollToBottom()
    }, [state.messages]);



    const handleSubmitInput = async (e: any) => {

        e.preventDefault()
        console.log("handleSubmitInput");
        console.log(state.messages);

        if (state.input !== '') {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "ADD_MESSAGE", payload: { role: "user", content: state.input } });
            dispatch({ type: "SET_INPUT", payload: '' })
        }

    }

    return (

        <section className='text-gray-800 items-center justify-center flex'>
            <div className="flex flex-col flex-grow min-h-max w-full bg-opacity-50 bg-gray-800 shadow-xl overflow-hidden rounded-2xl p-5">
                <div id="box" className="h-48 flex flex-col flex-grow p-4 overflow-auto relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {
                        state.messages.map((message, index) => (
                            <div key={`link-${index}`}>

                                {
                                    message.role !== "user" ? (
                                        <div className="flex w-11/12 mt-2 space-x-3 max-w-3xl">
                                            <div className="bg-gray-500 bg-opacity-80 p-3 rounded-r-lg rounded-bl-lg">
                                                <p className="text-sm text-gray-300 text-left">{message.content}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex w-11/12 mt-2 space-x-3 max-w-3xl ml-auto justify-end">
                                            <div className="bg-blue-600 bg-opacity-60 text-white p-3 rounded-l-lg rounded-br-lg">
                                                <p className="text-sm text-left">{message.content}</p>
                                            </div>
                                        </div>
                                    )
                                }


                            </div>
                        ))
                    }
                    <div ref={bottomEl} className='h-1'></div>
                </div>
                <div className="bg-gray-600 p-2 flex items-center rounded-xl bg-opacity-30">

                    <AudioRecorder dispatch={dispatch} />

                    <form className="flex w-full">
                        <input
                            value={state.input}
                            onChange={(e) =>
                                dispatch({ type: "SET_INPUT", payload: e.target.value })
                            }
                            className="text-white flex items-center h-10 w-full rounded px-3 text-sm bg-gray-600"
                            type="text"
                            placeholder="Type your message…"
                        />
                        <button type="submit" onClick={handleSubmitInput} className="ml-2" disabled={state.loading}>

                            {

                                state.loading ? (
                                    <CircularProgress size={25} className='object-contain h-6 w-6 text-gray-100 mt-1' />
                                ) : (
                                    <PaperAirplaneIcon
                                        className="object-contain h-6 w-6 text-gray-100"
                                    />
                                )
                            }

                        </button>
                    </form>
                </div>

            </div>

        </section>

    )
}

export default Chat