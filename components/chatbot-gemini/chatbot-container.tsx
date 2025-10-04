"use client"

import React, { useState, useRef, useEffect } from 'react'
import { companyInfo, constants } from "@/data/chatbot-text";
import { ChevronDown, MessagesSquare, BotIcon, X } from "lucide-react";
import ChatForm from './chatbot-form';
import ChatUserMessage from './chat-message-user';
import ChatBotMessage from './chat-message-bot';
import { GoogleGenAI, Content, Part } from "@google/genai";
import "@/styles/chatbot.css"
import Image from 'next/image';

// npm i @google/genai

export interface ChatMessageType {
    id: string;
    role: string;
    content: string;
    isError: boolean;
    hideInChat: boolean;
    file?: {
        mimeType: string;
        data: string | ArrayBuffer | null;
    } | null;
}

const ChatbotContainer = () => {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [isBusy, setIsBusy] = useState(false);
    // the initial timestamp of the chatbot only once when the chatbot is opened
    const [initialTimestamp, setInitialTimestamp] = useState<string | null>(null);
    // the company's brief that will be hidden from the user and used in our AI conversation
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([
        {
            id: new Date().toLocaleString(), // the message id as a timestamp in the format of YYYY-MM-DD HH:MM:SS
            role: "model", // the message role, "model" is the AI
            content: companyInfo, // the message content, the company's brief
            isError: false, // if the AI encounters an error, this will be set to true to make the message red
            hideInChat: true, // this will hide the message from the user, only used for the company info
            file: null
        }
    ]);
    // makes the chatbot window open or closed
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    // update the initial timestamp when the chatbot is opened only once
    useEffect(() => {
        if (isChatbotOpen && initialTimestamp === null) {
            setInitialTimestamp(new Date().toLocaleString());
        }
    }, [isChatbotOpen]);



    // Allow the user to scroll the chat body using the mouse wheel
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (chatBodyRef.current) {
                // Use requestAnimationFrame for smoother scrolling
                requestAnimationFrame(() => {
                    if (chatBodyRef.current) {
                        chatBodyRef.current.scrollTop += e.deltaY * 0.5; // Reduce sensitivity
                    }
                });
                e.preventDefault();
            }
        };

        const chatBody = chatBodyRef.current;
        if (chatBody) {
            // Use passive: true for better performance when possible
            chatBody.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (chatBody) {
                chatBody.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    // Auto-scroll to the bottom of the chat when the chat history changes
    useEffect(() => {
        // with smooth transition
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; 
            chatBodyRef.current.style.transition = "scroll-behavior: smooth";
        }
    }, [chatHistory]);

    // updates the chat history with the bot's response
    // adds the response to the chat history inplace of the thinking message
    const updateChatHistory = (text: string, isError: boolean = false) => {
        setChatHistory(prevHistory => [...prevHistory.filter(message => message.content !== "Thinking..."), {
            id: new Date().toLocaleString(),
            role: "model",
            content: text,
            isError: isError,
            hideInChat: false,
            file: null
        }]);
    }



    const generateBotResponse = async (chatHistory: ChatMessageType[]) => {
        console.log("Generating bot response...");
        setIsBusy(true);
        try {
            // Format chat history for Gemini API
            const formattedHistory = chatHistory.map(({role, content, file}) => {
                let messageContent = content;
                
                // Add file type context to the message content
                if (file && file.data && typeof file.data === 'string') {
                    if (file.mimeType.startsWith('image/')) {
                        messageContent = `[User uploaded an image] ${content}`;
                    } else if (file.mimeType === 'application/pdf') {
                        messageContent = `[User uploaded a PDF document] ${content}`;
                    } else if (file.mimeType === 'text/plain') {
                        messageContent = `[User uploaded a text file] ${content}`;
                    }
                }
                
                const parts: Part[] = [{text: messageContent}];
                
                // Handle different file types
                if (file && file.data && typeof file.data === 'string') {
                    // For images, PDFs, and text files
                    if (file.mimeType.startsWith('image/') || 
                        file.mimeType === 'application/pdf' ||
                        file.mimeType === 'text/plain') {
                        parts.push({
                            inlineData: {
                                mimeType: file.mimeType,
                                data: file.data
                            }
                        });
                    }
                }
                
                return {
                    role: role === "user" ? "user" : "model",
                    parts: parts
                };
            });
            
            // console.log("Formatted history:", formattedHistory);
            
            // Initialize the Gemini API client
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });
            
            // Send the chat history to Gemini
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: formattedHistory,
            });
            
            // console.log("Gemini response:", response);
            // Extract the response text and clean it as Gemini often returns text with Markdown formatting, asterisk and bold
            const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            // console.log("Gemini response text:", responseText);

            // Update the chat history with the bot's response replacing the thinking message
            if (responseText) {
                updateChatHistory(responseText, false);
            } else {
                updateChatHistory("Sorry, I couldn't generate a response.", true);
            }


        } catch (error) {
            console.error("Error generating response:", error);
            updateChatHistory("Sorry, I encountered an error. Please try again.", true);
        } finally {
            setIsBusy(false);
        }
    }


  return (
    <div className={`container z-[100] chatbot-wrapper ${isChatbotOpen ? "show-chatbot" : ""}`}>

        {/* Chatbot toggler - placed in the bottom right corner of the page with fixed position */}
        <button id="chatbot-toggler" onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
            <span>{constants.chatbot_button}</span>
            {isChatbotOpen ? <span><X className="chatbot-toggler-icon toggle-opened-icon pb-[1px]" /></span> : <span><MessagesSquare className="chatbot-toggler-icon toggle-closed-icon" /></span>}
        </button>

        {/* Chatbot popup - the chatbot window */}  
        <div className="chatbot-popup">

            {/* Chatbot header */}
            <div className="chat-header">
                <div className="header-info">
                    <div className="header-icon">
                        <MessagesSquare className="icon" />
                    </div>
                    <h2 className="logo-text">{constants.header}</h2>
                </div>
                <button className="chat-header-button toggle-opened-icon" onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
                    <ChevronDown className="chat-header-chevron" />
                </button>
            </div>

            {/* Chatbot body */}
            <div className="chat-body" ref={chatBodyRef}>

                {/* Initial static bot message */}
                <div className="message bot-message">
                    <div className="bot-icon-container">
                        <Image src="/Logo/Logo_white.png" alt="MIS chat logo" width={32} height={32} />
                    </div>
                    <p className="message-text bot-text">
                        {constants.welcomeMessage.split("<br />").map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                    <span className="message-timestamp">{initialTimestamp}</span>
                </div>

                {/* map through the chat history and render the messages depending on the role for styling */}
                {chatHistory.map((message, index) => (
                    message.role === "user" ? (
                        <ChatUserMessage message={message} key={message.id} />
                    ) : (
                        <ChatBotMessage message={message} key={message.id} />
                    )
                ))}

            </div>

            {/* Chatbot footer - the chat input form */}
            <div className="chat-footer" onClick={() => console.log(chatHistory)}>
                <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} isBusy={isBusy}/>
            </div>

        </div>
    </div>
  )
}

export default ChatbotContainer
