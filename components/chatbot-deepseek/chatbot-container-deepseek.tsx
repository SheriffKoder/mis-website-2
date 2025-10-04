"use client"

import React, { useState, useRef, useEffect } from 'react'
import { AIPrompt, companyInfo, constants } from "@/data/chatbot-text";
import { MessagesSquare, X } from "lucide-react";
import ChatForm from './chatbot-form';
import ChatUserMessage from './chat-message-user';
import ChatBotMessage from './chat-message-bot';
import { generateDeepseekResponse } from '@/utils/DeepseekaiAnalysis';
import "@/styles/chatbot.css"
import Image from 'next/image';

export interface ChatMessageType {
    id: string;
    role: string;
    content: string;
    isError: boolean;
    CTA_detected: boolean;
}

const ChatbotContainer = () => {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [isBusy, setIsBusy] = useState(false);
    const [initialTimestamp, setInitialTimestamp] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);

    // makes the chatbot window open or closed
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    // update the initial timestamp when the chatbot is opened only once
    useEffect(() => {
        if (isChatbotOpen && initialTimestamp === null) {
            setInitialTimestamp(new Date().toLocaleString());
        }

        // Add or remove the body class when chatbot opens/closes
        if (isChatbotOpen) {
            document.body.classList.add('chatbot-open');
        } else {
            document.body.classList.remove('chatbot-open');
        }
        
        // Cleanup function to ensure class is removed when component unmounts
        return () => {
            document.body.classList.remove('chatbot-open');
        };

    }, [isChatbotOpen, initialTimestamp]);


    // Allow the user to scroll the chat body using the mouse wheel
    // useEffect(() => {
    //     const handleWheel = (e: WheelEvent) => {
    //         if (chatBodyRef.current) {
    //             // Use requestAnimationFrame for smoother scrolling
    //             requestAnimationFrame(() => {
    //                 if (chatBodyRef.current) {
    //                     chatBodyRef.current.scrollTop += e.deltaY * 0.5; // Reduce sensitivity
    //                 }
    //             });
    //             e.preventDefault();
    //         }
    //     };

    //     const chatBody = chatBodyRef.current;
    //     if (chatBody) {
    //         // Use passive: true for better performance when possible
    //         chatBody.addEventListener('wheel', handleWheel, { passive: false });
    //     }

    //     return () => {
    //         if (chatBody) {
    //             chatBody.removeEventListener('wheel', handleWheel);
    //         }
    //     };
    // }, []);

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
    const updateChatHistory = (text: string, isError: boolean = false, CTA_detected: boolean = false) => {
        setChatHistory(prevHistory => [...prevHistory.filter(message => message.content !== "Thinking..."), {
            id: new Date().toLocaleString(),
            role: "model",
            content: text,
            isError: isError,
            CTA_detected: CTA_detected
        }]);
    }

    // Maximum number of messages to include in each API request
    const MAX_WINDOW_SIZE = 10;

    const generateBotResponse = async (chatHistory: ChatMessageType[]) => {
        // console.log("Generating bot response...");
        setIsBusy(true);
        
        try {
            // Get visible messages
            const visibleMessages = chatHistory
                .map(msg => ({
                    role: msg.role === "user" ? "user" : "assistant",
                    content: msg.content
                }));
            
            // Separate the last user message from previous conversation
            const lastUserMessageIndex = [...visibleMessages].reverse().findIndex(msg => msg.role === "user");
            
            if (lastUserMessageIndex === -1) {
                throw new Error("No user message found");
            }
            
            const lastUserMessage = visibleMessages[visibleMessages.length - 1 - lastUserMessageIndex];
            
            // Get previous conversation context (excluding the last user message)
            let conversationContext = visibleMessages.slice(0, visibleMessages.length - 1 - lastUserMessageIndex);
            
            // Apply windowing to conversation context if needed
            if (conversationContext.length > MAX_WINDOW_SIZE - 2) { // -2 to account for system message and last user message
                conversationContext = conversationContext.slice(-(MAX_WINDOW_SIZE - 2));
            }
            
            // Structure the data in your preferred format
            const structuredData = {
                company_brief: companyInfo,
                previous_chat: conversationContext,
                last_user_message: lastUserMessage.content
            };
            
            // console.log("Structured data for Deepseek:", structuredData);
            
            // Format for Deepseek API - they expect an array of messages with role and content
            const messages = [
                {
                    role: "system",
                    content: JSON.stringify({
                        company_brief: structuredData.company_brief,
                        previous_chat: structuredData.previous_chat
                    })
                },
                {
                    role: "user",
                    content: AIPrompt + structuredData.last_user_message
                }
            ];
            
            // console.log("Sending to Deepseek API:", messages);
            
            // Call our external Deepseek API handler
            const responseText = await generateDeepseekResponse(messages);

            try {
                let parsedResponse;
                let CTA_detected = false;

                // Check if responseText is already an object or a string
                if (typeof responseText === 'object' && responseText !== null) {
                    // Response is already parsed
                    parsedResponse = responseText;
                } else if (typeof responseText === 'string') {
                    // Clean up the response text - remove markdown code block markers if present
                    let cleanResponseText = responseText;
                    
                    // Check if response is wrapped in markdown code blocks
                    if (responseText.includes("```json") || responseText.includes("```")) {
                        // Extract content between code block markers
                        const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                        if (codeBlockMatch && codeBlockMatch[1]) {
                            cleanResponseText = codeBlockMatch[1];
                        }
                    }
                    
                    console.log("Cleaned response text:", cleanResponseText);
                    
                    // Try to parse the cleaned response as JSON
                    parsedResponse = JSON.parse(cleanResponseText);
                } else {
                    throw new Error("Invalid response type");
                }

                // Check if the response contains a message field
                if (parsedResponse.message) {
                    // Check if the response contains a CALL_TO_ACTION field with any truthy value
                    if (parsedResponse.CALL_TO_ACTION && 
                        (parsedResponse.CALL_TO_ACTION === "CALL_TO_ACTION" || 
                         parsedResponse.CALL_TO_ACTION === true || 
                         parsedResponse.CALL_TO_ACTION === "true")) {
                        CTA_detected = true;
                    }
                    updateChatHistory(parsedResponse.message, false, CTA_detected);

                } else {
                    // If no message field, use the whole response as the message
                    updateChatHistory(JSON.stringify(parsedResponse), false, CTA_detected);
                }
            } catch (e) {
                console.error("Error parsing response:", e, responseText);
                // If parsing fails, treat responseText as a string message
                const messageText = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
                updateChatHistory(messageText, false);
            }
            
        } catch (error) {
            console.error("Error generating response:", error);
            updateChatHistory("Sorry, I encountered an error. Please try again.", true);
        }
        
        setIsBusy(false);
    }

  return (
    <div className={`container z-[100] chatbot-wrapper ${isChatbotOpen ? "show-chatbot" : ""}`}
    >

        {/* Chatbot toggler - placed in the bottom right corner of the page with fixed position */}
        <button id="chatbot-toggler" onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
            <span>{constants.chatbot_button}</span>
            {isChatbotOpen ? <span><MessagesSquare className="chatbot-toggler-icon toggle-opened-icon pb-[1px]" /></span> : <span><MessagesSquare className="chatbot-toggler-icon toggle-closed-icon" /></span>}
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
                    <X className="chat-header-chevron"/>
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
                {chatHistory.map((message) => (
                    message.role === "user" ? (
                        <ChatUserMessage message={message} key={message.id} />
                    ) : (
                        <ChatBotMessage message={message} key={message.id} setIsChatbotOpen={setIsChatbotOpen} />
                    )
                ))}

            </div>

            {/* Chatbot footer - the chat input form */}
            <div className="chat-footer">
                <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}
                isBusy={isBusy}
                />
            </div>
            


        </div>


    </div>
  )
}

export default ChatbotContainer
