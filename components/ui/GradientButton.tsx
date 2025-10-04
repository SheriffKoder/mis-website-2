// import SparkleSVG from '@/public/SVG/sparkle'
import React from 'react'
import { Sparkles } from 'lucide-react'

interface GradientButtonProps {
  text: string
  showIcon?: boolean
  className?: string
  onClick?: () => void
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  text, 
  showIcon = false, 
  className = '',
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      className={`relative group h-[50px] rounded-full overflow-hidden ${className} gradientButton`}
    >
      {/* Box-shaped gradient background that moves left on hover */}
      <div className='absolute inset-[-100px] w-[calc(100%+200px)] h-[calc(100%+200px)] 
          bg-gradient-to-r from-[#9046D9] to-[#17D9FF] 
          transform translate-x-0 group-hover:translate-x-[100px] 
          transition-transform duration-1000 ease-in-out'></div>
      
      {/* Dark overlay with smaller dimensions to create gradient border effect */}
      <div className='absolute top-[2px] left-[2px] right-[2px] bottom-[2px] 
          bg-black/80 rounded-full flex items-center justify-center gap-2'>
          
          {showIcon && (
            <Sparkles className='ml-[-5px] stroke-2 w-6 h-6 group-hover:text-[#9046D9] text-[#4c94ec] transition-colors duration-1000' />
          )}

          <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#9046D9] to-[#17D9FF] 
              bg-[length:200%_100%] bg-[position:100%_0%] group-hover:bg-[position:0%_0%]
              transition-[background-position] duration-1000 ease-in-out
              ButtonText font-semibold'>
              {text}
          </span>
      </div>
    </button>
  )
}

export default GradientButton