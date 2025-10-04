"use client"

import { Send } from 'lucide-react'
import React, { useRef } from 'react'
import { constants } from "@/data/chatbot-text";
import { ChatMessageType } from '@/components/chatbot-deepseek/chatbot-container-deepseek';
import { useRateLimit } from '@/hooks/useRateLimit';
import DonutCountdown from '@/components/chatbot-deepseek/donut-countdown';

/////////////////////////////////////////////////////////////////////////////
// CHATBOT FORM COMPONENT
// This component handles user input and message submission for the chatbot
// It includes rate limiting to prevent abuse
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
    
    // Input reference
    const inputRef = useRef<HTMLInputElement>(null);
    
    ///////////////////////////////////////////////////////////
    // RATE LIMITING
    // Prevents users from sending too many messages
    ///////////////////////////////////////////////////////////
    
    // Use our rate limiting hook
    const [rateLimitState, checkRateLimit] = useRateLimit('basic_chatbot', {
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
              CTA_detected: false
            }]);
            return false;
          }
          
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
        if (!userMessage) return;

        // STEP 1: Clear the input field in the UI immediately
        inputRef.current!.value = "";
        
        // STEP 2: Add the user message to the chat history immediately
        const userMessageObj = {
            role: "user",
            content: userMessage,
            id: new Date().toLocaleString(),
            isError: false,
            CTA_detected: false
        };

        inputRef.current!.focus();
        
        setChatHistory((history: ChatMessageType[]) => [...history, userMessageObj]);
        
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
                CTA_detected: false
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
                CTA_detected: false
            }]);

            // STEP 6: Generate bot response based on the user message and the chat history
            // This will replace the thinking message with the bot response
            generateBotResponse([...chatHistory, userMessageObj]);

        }, 600);
    }

    ///////////////////////////////////////////////////////////
    // COMPONENT RENDER
    // Renders the chat form with all its features
    ///////////////////////////////////////////////////////////

    return (
        <form className="chat-form" action="#" onSubmit={handleSubmit}>
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
                        secondaryColor="rgba(255, 255, 255, 0.05)"
                        textColor="#ffff"
                    />
                </div>
            )}
            
            {/* Send button */}
            <button 
                className="send-button" 
                disabled={rateLimitState.isLimited || isBusy}
            >
                <Send className="send-icon" />
            </button>
        </form>
    )
}

export default ChatForm
