import { BotIcon } from 'lucide-react'
import React from 'react'
import { ChatMessageType } from './chatbot-container';
import Image from 'next/image';

const ChatBotMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    !message.hideInChat && (
        <div className="message bot-message" key={message.id}>
            <div className="bot-icon-container">
                <Image src="/Logo/Logo_white.png" alt="MIS chat logo" width={32} height={32} />
            </div>
        <div className="message-text bot-text">
            {message.content.includes("Thinking...") ? <div className="text-loader"/> : <p className={message.isError ? "bot-error-message" : ""}>{message.content}</p>}
        </div>
        {!message.id.includes("-thinking") && (
            <span className="message-timestamp">{message.id}</span>
        )}

    </div>
    )
  )
}

export default ChatBotMessage
