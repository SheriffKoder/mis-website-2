import React from 'react'

interface ButtonProps {
  className?: string;
  text?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  defaultAnimate?: boolean;
  heavyBorder?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  className = "", 
  text = "Get Started", 
  onClick,
  type = "button",
  defaultAnimate = false,
  heavyBorder = false
}) => {
  return (
    <button 
      className={`mainButton
        bg-[#17D9FF] text-black px-4 py-2 rounded-full
        ${heavyBorder ? "border-[3px] border-[#17D9FF]" : ""}
        hover:text-white
        hover:shadow-lg hover:shadow-[#17d8ff5e]
        ButtonText
        ${defaultAnimate ? "transition-all duration-300 ease-in-out" : ""}
        ${className}
      `}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  )
}

export default Button