"use client"

import { ChevronDown, File, FileX2, Paperclip, Send, Smile, X } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'
import { constants } from "@/data/chatbot-text";
import { ChatMessageType } from './chatbot-container';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useRateLimit } from '@/hooks/useRateLimit';
import DonutCountdown from '@/components/ui/donut-countdown';

/////////////////////////////////////////////////////////////////////////////
// CHATBOT FORM COMPONENT
// This component handles user input, file uploads, and message submission
// It includes rate limiting to prevent abuse
// only the form is changed to allow rate limiting
// install upstash/redis
// copy the api route, hook, donut-chart counter component, add env variables

/////////////////////////////////////////////////////////////////////////////

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, isBusy }: { 
    chatHistory: ChatMessageType[],
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessageType[]>>, 
    generateBotResponse: (chatHistory: ChatMessageType[]) => void,
    isBusy: boolean
}) => {

    ///////////////////////////////////////////////////////////
    // STATE MANAGEMENT
    ///////////////////////////////////////////////////////////
    
    // Input and file references
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // File handling state
    const [hasFile, setHasFile] = useState(false);
    const [file, setFile] = useState<{
        mimeType: string;
        data: string | ArrayBuffer | null;
        name?: string;
    } | null>(null);
    
    // UI state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    ///////////////////////////////////////////////////////////
    // RATE LIMITING
    // Prevents users from sending too many messages
    ///////////////////////////////////////////////////////////
    
    // Use our rate limiting hook
    const [rateLimitState, checkRateLimit] = useRateLimit('chatbot_messages', {
        windowDuration: process.env.NEXT_PUBLIC_CHAT_WINDOW_DURATION as unknown as number || 60000,  // 1 minute
        maxRequests: process.env.NEXT_PUBLIC_MAX_CHAT_REQUESTS_MINUTE as unknown as number || 5,        // 5 messages per minute
        cooldownPeriod: process.env.NEXT_PUBLIC_CHAT_COOLDOWN_PERIOD as unknown as number || 30000   // 30 second cooldown if limit reached
    });

    // Calculate seconds remaining for countdown
    const getSecondsRemaining = () => {
        if (!rateLimitState.resetTime) return 0;
        const secondsRemaining = Math.max(0, Math.ceil((rateLimitState.resetTime - Date.now()) / 1000));
        // Cap the countdown to the cooldown period (in seconds)
        const cooldownSeconds = (process.env.NEXT_PUBLIC_CHAT_COOLDOWN_PERIOD as unknown as number || 30000) / 1000;
        return Math.min(secondsRemaining, cooldownSeconds);
    };

    ///////////////////////////////////////////////////////////
    // SERVER-SIDE RATE LIMIT CHECK
    // Double-check rate limits on the server to prevent circumvention
    ///////////////////////////////////////////////////////////
    
    const checkServerRateLimit = async () => {
        try {
          const response = await fetch('/api/chat-rate-limit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const data = await response.json();
          
          if (!data.allowed) {
            setChatHistory((history: ChatMessageType[]) => [...history, {
              role: "model",
              content: data.message || "Rate limit exceeded",
              id: new Date().toLocaleString(),
              isError: true,
              hideInChat: false
            }]);
            return false;
          }
          
          // Update UI with remaining messages
          // You could update your rate limit state here
          return true;
        } catch (error) {
          console.error("Error checking rate limit:", error);
          return true; // Allow on error
        }
      };

    ///////////////////////////////////////////////////////////
    // FORM SUBMISSION HANDLER
    // Processes user input and sends messages
    ///////////////////////////////////////////////////////////

    // handles the form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userMessage = inputRef.current?.value.trim();
        if (!userMessage && !file) return;
        
        // STEP 1: Log the submission
        console.log("Form submitted: ", userMessage);
        inputRef.current!.value = "";
        inputRef.current!.focus();

        // STEP 2: Add the user message to the chat history
        setChatHistory((history: ChatMessageType[]) => [...history, {
            role: "user",
            content: userMessage || "",
            id: new Date().toLocaleString(),
            isError: false,
            hideInChat: false,
            file: file || null
        }]);


        // STEP 3: Check server-side rate limit
        const serverAllowed = await checkServerRateLimit();
        if (!serverAllowed) return;
        
        // STEP 4: Check client-side rate limit
        const canProceed = checkRateLimit();
        if (!canProceed) {
            // Add rate limit message to chat
            setChatHistory((history: ChatMessageType[]) => [...history, {
                role: "model",
                content: rateLimitState.dailyRemaining === 0 
                    ? "You've reached your daily message limit. Please try again tomorrow." 
                    : "You've sent too many messages. Please wait a moment before trying again.",
                id: new Date().toLocaleString(),
                isError: true,
                hideInChat: false
            }]);
            return;
        }

        // STEP 5: Generate bot response with a slight delay for UX
        setTimeout(() => {
            // Add a placeholder bot message to the chat history until the bot response is generated
            setChatHistory((history: ChatMessageType[]) => [...history, {
                role: "model",
                content: "Thinking...",
                id: new Date().toLocaleString()+"-thinking",
                isError: false,
                hideInChat: false
            }]);

            // STEP 6: Generate bot response based on the user message and the chat history
            // This will replace the thinking message with the bot response
            generateBotResponse([...chatHistory, {
                role: "user",
                content: `Using the details provided above please address this query: ${userMessage}`, // Add a prefix to each message
                id: new Date().toLocaleString(),
                isError: false,
                hideInChat: false,
                file: file || null
            }]);

            // STEP 7: Clear the file and input field
            setFile(null);
            setHasFile(false);
            fileInputRef.current!.value = "";
            // inputRef.current!.value = "";

        }, 100);
    }

    ///////////////////////////////////////////////////////////
    // FILE HANDLING
    // Manages file uploads and previews
    ///////////////////////////////////////////////////////////

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        setHasFile(true);
        // console.log("File uploaded: ", file);

        // convert file to base64 format
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.onload = () => {
            const base64String = reader.result?.toString().split(',')[1];
            console.log("Base64 string: ", base64String);
            
            if (base64String) {
                setFile({
                    mimeType: uploadedFile.type,
                    data: base64String,
                    name: uploadedFile.name
                })
            }
        }
    }

    const clearFileSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setHasFile(false);
        setFile(null);
        fileInputRef.current!.value = "";
    }

    ///////////////////////////////////////////////////////////
    // EMOJI HANDLING
    // Manages emoji picker and selection
    ///////////////////////////////////////////////////////////

    const handleEmojiSelect = (emoji: any) => {
        if (inputRef.current) {
            inputRef.current.value += emoji.native;
        }
        inputRef.current!.focus();
        // setShowEmojiPicker(false);
    }

    ///////////////////////////////////////////////////////////
    // COMPONENT RENDER
    // Renders the chat form with all its features
    ///////////////////////////////////////////////////////////

  return (
    <>
        {/* FILE PREVIEW SECTION */}
        {hasFile && file && (
            <div className="file-toast">
                {file.mimeType.startsWith('image/') ? (
                    <>
                        <div className="file-preview">
                            <img 
                                src={`data:${file.mimeType};base64,${file.data}`} 
                                alt="Preview" 
                            />
                        </div>
                        <span className="text-xs text-white">Image uploaded: {file.name}</span>
                    </>
                ) : (
                    <>
                        <div className="file-icon">
                            <File />
                        </div>
                        <span>
                            {file.mimeType === 'application/pdf' 
                                ? 'PDF uploaded: ' 
                                : 'File uploaded: '
                            }
                            {file.name}
                        </span>
                    </>
                )}
                <button 
                    className="remove-file" 
                    onClick={(e) => clearFileSelection(e)}
                >
                    <X size={16} />
                </button>
            </div>
        )}

        {/* CHAT INPUT FORM */}
        <form className={`chat-form ${hasFile ? 'has-file' : ''}`} action="#" onSubmit={handleSubmit}>
            {/* Message input field */}
            <input 
                type="text" 
                placeholder={rateLimitState.isLimited 
                    ? rateLimitState.dailyRemaining === 0
                        ? "Daily message limit reached. Try again tomorrow."
                        : `Rate limited. Please wait.`
                    : rateLimitState.dailyRemaining !== undefined
                        ? `${constants.inputPlaceholder} (${rateLimitState.dailyRemaining} messages left today)`
                        : constants.inputPlaceholder
                } 
                className="message-input" 
                required 
                ref={inputRef}
                disabled={rateLimitState.isLimited || isBusy} 
            />
            
            {/* Rate limit countdown timer */}
            {rateLimitState.isLimited && rateLimitState.resetTime && (
                <div className="rate-limit-countdown ml-2 absolute top-[-45px] right-4 z-[1001]">
                    <DonutCountdown 
                        totalSeconds={getSecondsRemaining()}
                        size={30}
                        // primaryColor="#"
                        secondaryColor="rgba(255, 255, 255, 0.05)"
                        textColor="#ffff"
                    />
                </div>
            )}
            
            {/* Emoji picker */}
            {showEmojiPicker && (
                <div className="emoji-picker-container relative">
                    <Picker 
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        previewPosition="none"
                        // skinTonePosition="none"
                        perLine={8}
                        maxFrequentRows={1}
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: '2rem',
                            zIndex: 1000,
                            width: '300px',
                            height: '220px',
                            fontSize: '12px'
                        }}
                    />
                    <div className="absolute top-[-300px] right-2 z-[1001]">
                        <button 
                            className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 cursor-pointer"
                            onClick={() => setShowEmojiPicker(false)}
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            )}
            
            {/* Emoji button */}
            <button 
                type="button"
                className={`emoji-button ${showEmojiPicker ? 'emoji-button-active' : ''}`} 
                disabled={rateLimitState.isLimited || isBusy}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
                <Smile className="emoji-icon" />
            </button>

            {/* File upload button */}
            <div className='file-upload-wrapper flex items-center justify-center mx-2'>
                <button 
                    type="button"
                    className={`paperclip-button ${hasFile ? 'file-selected' : ''}`}
                    disabled={rateLimitState.isLimited || isBusy} 
                    id="file-upload"
                    onClick={(e) => {
                        e.preventDefault();
                        if (hasFile) {
                            clearFileSelection(e);
                        } else {
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    {hasFile ? (
                        <FileX2 className="paperclip-icon" />
                    ) : (
                        <Paperclip className="paperclip-icon" />
                    )}
                </button>       
                <input 
                    type="file" 
                    accept=".pdf, .docx, .txt, .jpg, .jpeg, .png, .gif, .webp"
                    id="file-input" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                />
            </div>
            
            {/* Send button */}
            <button 
                className="send-button" 
                disabled={rateLimitState.isLimited || isBusy}
            >
                <Send className="send-icon" />
            </button>
        </form>
    </>
  )
}

export default ChatForm
