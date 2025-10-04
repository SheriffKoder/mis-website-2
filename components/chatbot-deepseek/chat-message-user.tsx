import React from 'react'
import { ChatMessageType } from './chatbot-container-deepseek';


const ChatUserMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div className="message user-message" key={message.id}>
    <p className="message-text user-text">{message.content}</p>
    <span className="message-timestamp">{message.id}</span>
    </div>
  )
}

export default ChatUserMessage
