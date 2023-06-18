"use client"

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { useState, useReducer, useEffect } from "react";
const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


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

export default function Openai(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log(state);
        const apiCall = async () => {
            try {
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: state.messages,
                    max_tokens: 400,
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
                apiCall();
            }
        }
    }, [state.messages]);


    const handleSubmitInput = async () => {
        console.log("handleSubmitInput");
        console.log(state.messages);
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "ADD_MESSAGE", payload: { role: "user", content: state.input } });

    }

    const messages = state.messages.map((message, index) => {
        return (
            <div
                key={index}
                className={`flex flex-row items-center justify-between p-4 ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                    }`}
            >
                <p className="text-sm font-bold">{message.role}</p>
                <p className="text-sm">{message.content}</p>
                <div className="flex flex-row space-x-2">
                    <button
                        className="px-4 py-2 text-white bg-red-500 rounded-lg"
                        onClick={() => dispatch({ type: "REMOVE_MESSAGE", payload: index })}
                    >
                        Remove
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-green-500 rounded-lg"
                        onClick={() => {
                            dispatch({ type: "SET_INPUT", payload: state.messages[index].content }),
                                dispatch({
                                    type: "EDIT_MESSAGE",
                                    payload: { index: index, content: state.input },
                                })
                        }}
                    >
                        Edit
                    </button>
                </div>
            </div>
        );
    });
    return (
        <div className="w-clamp(400px,50vw,800px) bg-white h-screen">
            <div className="flex flex-col h-full">
                {messages}
                <div id="input-box">
                    <div className="flex flex-row items-center justify-between p-4">
                        <input
                            className="w-full mr-4 p-4 border border-gray-300 rounded-lg"
                            type="text"
                            placeholder="Type something..."
                            value={state.input}
                            onChange={(e) =>
                                dispatch({ type: "SET_INPUT", payload: e.target.value })
                            }
                        />
                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                            onClick={() => handleSubmitInput()}
                        >
                            Send
                        </button>
                    </div>
                </div>
                <span className="text-sm text-red-500">
                    {state.error ? "Error: " + state.messages : ""}
                </span>
            </div >
        </div >
    )
}