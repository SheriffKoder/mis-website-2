import React, { useState, useEffect } from 'react'
import DownwardArrowFlowItem from './DownwardArrowFlowItem'
import { section_steps_cardsContent } from "@/constants"

const arrowColors = [
    "#1D305A",  // Periwinkle/lavender blue for the fourth arrow
    "#235171", // Gray/silver for the first arrow
    "#1F525E", // Teal/turquoise for the second arrow
    "#1B415C", // Light blue for the third arrow
  ];

// Define brightness levels for each step (0.7 to 1.0)
// const brightnessByIndex = [0.7, 0.8, 0.9, 1.0];

const FlowContainer = ({animateCards}: {animateCards: boolean}) => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Define the vertical spacing between items (increased from 190px)
  const stepSpacing = 210; // Increased spacing between items

  useEffect(() => {
    if (animateCards) {
    // First animation - second item moves down
    const timer1 = setTimeout(() => {
      setActiveStep(1);
    }, 500); // Reduced from 2000ms to 1000ms
    
    // Second animation - third item moves down
    const timer2 = setTimeout(() => {
      setActiveStep(2);
    }, 1250); // Reduced from 4000ms to 2000ms
    
    // Third animation - fourth item moves down
    const timer3 = setTimeout(() => {
      setActiveStep(3);
    }, 2000); // Reduced from 6000ms to 3000ms
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }
  }, [animateCards]);

// 4 cards * 230px each in height to avoid container height expansion

  return (
    <div className='w-full mt-8 mx-auto relative max-w-[1000px] stepsCards h-[calc(230px*4)]'>
      {/* Items are positioned absolutely and will animate based on activeStep */}
      {arrowColors.map((color, index) => (
        <div 
          key={index}
          className="absolute w-full transition-all duration-700 ease-in-out"
          style={{
            top: activeStep >= index ? `${index * stepSpacing}px` : '0px',
            zIndex: arrowColors.length - index, // Higher index = lower z-index for example 4,3,2,1
          }}
        >
          <DownwardArrowFlowItem backgroundColor={color} index={index}>
            <div className='flex flex-row gap-8 items-center justify-center p-4 z-[2]'>
              <div className='Heading2 w-[75px] md2:w-[100px] border-r flex items-center justify-center gradient_text'>
                {section_steps_cardsContent[index].number}
              </div>
              <div className='w-full max-w-[300px] md:max-w-[700px] flex flex-col gap-2'>    
                <div className='Paragraph1 font-medium text-white' style={{fontWeight: '500'}}>{section_steps_cardsContent[index].name}</div>
                <div className='Paragraph3 font-extralight text-white'>{section_steps_cardsContent[index].content}</div>    
              </div>
            </div>
          </DownwardArrowFlowItem>
        </div>
      ))}
      
      {/* Spacer div to maintain container height */}
      <div style={{ height: activeStep > 0 ? `${arrowColors.length * stepSpacing}px` : '170px' }} 
           className="transition-all duration-700 ease-in-out"></div>
    </div>
  )
}

export default FlowContainer
