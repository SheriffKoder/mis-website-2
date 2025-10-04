import React from 'react'

interface DownwardArrowFlowItemProps {
  backgroundColor?: string;
  children?: React.ReactNode;
  index?: number;
}

const DownwardArrowFlowItem: React.FC<DownwardArrowFlowItemProps> = ({ 
  backgroundColor = "#3B82F6", // Default to blue if no color provided
  children,
  index
}) => {
  return (
    <div className="drop-shadow-lg">
      <div className="relative">
        {/* Main card body */}
        <div 
          className={`w-full flex items-end justify-center rounded-t-lg rounded-b-2xl border border-gray-800/50 h-[230px]
            ${index === 0 ? 'pb-8 md:pb-6 md1:pb-10 md2:pb-12' : 'pb-3 md:pb-4 md2:pb-5'}
            `}
          style={{ backgroundColor: backgroundColor }} // Full opacity
        >
          {children || <p className="text-center text-white">Downward Arrow Shape Example</p>}
        </div>
        
        {/* SVG Arrow */}
        <svg 
          className="xl:w-[99%] w-[calc(100%-3px)] md:w-[calc(100%+0px)] mx-auto h-[40px] overflow-visible mt-[-4px] md:mt-[-2px] xl:mt-[-1px]" 
          preserveAspectRatio="none"
          viewBox="0 0 100 15"
        //   style={{ marginTop: "-3px" }} // This removes the gap
        >
          <path 
            d="M0,0 L50,15 L100,0 Z" 
            fill={backgroundColor} // Full opacity
          />
        </svg>
      </div>
    </div>
  )
}

export default DownwardArrowFlowItem

