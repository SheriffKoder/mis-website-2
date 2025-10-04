import React from 'react'
import { ChatMessageType } from './chatbot-container';
import { File, FileText } from 'lucide-react';

const ChatUserMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div className="message user-message" key={message.id}>
      <div className="message-text user-text">
        {message.file && message.file.data && typeof message.file.data === 'string' && (
          <div className="message-file-attachment">
            {message.file.mimeType.startsWith('image/') ? (
              <img 
                src={`data:${message.file.mimeType};base64,${message.file.data}`} 
                alt="user-file" 
                className="user-uploaded-image"
              />
            ) : message.file.mimeType === 'application/pdf' ? (
              <div className="message-file-icon pdf-icon">
                <FileText size={24} />
                <span>PDF Document</span>
              </div>
            ) : (
              <div className="message-file-icon message-file-icon">
                <File size={24} />
                <span>{message.file.mimeType.split('/')[1].toUpperCase()} File</span>
              </div>
            )}
          </div>
        )}
        <p>{message.content}</p>
      </div>
      <span className="message-timestamp">{message.id}</span>
    </div>
  )
}

export default ChatUserMessage
