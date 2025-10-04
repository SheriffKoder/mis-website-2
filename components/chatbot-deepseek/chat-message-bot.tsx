import React from 'react'
import { ChatMessageType } from './chatbot-container-deepseek';
import Image from 'next/image';
import { constants } from '@/data/chatbot-text';

const ChatBotMessage = ({ message, setIsChatbotOpen }: { message: ChatMessageType, setIsChatbotOpen: (isChatbotOpen: boolean) => void }) => {
    
    // is mobile landscape or portrait
    const isMobile = window.innerWidth < 1024 && window.innerHeight < 500 || window.innerWidth < 520;
    
    // trial to fix keyboard overlap issue on android phones
    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
    if(isAndroid) {
        document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');
    }
    return (
    <div className="">
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
      {message.CTA_detected && (
          <div className="cta-container" onClick={()=>{isMobile ? setIsChatbotOpen(false) : null}}>
              <a href="#contact" className="cta-button">
                  {constants.CTA_text}
              </a>
          </div>
      )}

    </div>
  )
}

export default ChatBotMessage
