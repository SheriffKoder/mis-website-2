'use client'
import React, { useEffect, useState } from 'react'
import MISCard from './MIS_Card';

// Service data - Contains information about each service card
const OurServices = [
    {
        title: 'Web Development',
        description: 'We specialize in creating custom websites tailored to your business needs.'
    },
    {
        title: 'AI Solutions',
        description: 'We specialize in creating custom websites tailored to your business needs.'
    },
    {
        title: 'UI/UX Design',
        description: 'We specialize in creating custom websites tailored to your business needs.'
    },
    {
        title: 'Accounting',
        description: 'We specialize in creating custom websites tailored to your business needs.'
    },
    {
        title: 'MIS Powered',
        description: 'We specialize in creating custom websites tailored to your business needs.'
    },
    {
        title: 'Social Media Management',
        description: 'Random description for social media management'
    },
    {
        title: 'Data Analysis',
        description: 'Random description for data analysis'
    },

    {
        title: 'Automation',
        description: 'Random description for automation'
    },
]

/**
 * ServicesCards Component
 * 
 * This component displays a grid of service cards with an animated reveal effect.
 * The animation sequence is as follows:
 * 1. Lines extend from the central MIS card to the four adjacent cards
 * 2. The four adjacent cards (1,3,5,7) fade in slightly before the lines finish extending
 * 3. The remaining corner cards (0,2,6) fade in last
 * 
 * The central MIS card (index 4) is always visible, while other cards appear based on
 * the animation sequence triggered by the isVisible prop.
 */
const ServicesCards = ({isHeadingVisible}: {isHeadingVisible: boolean}) => {
  // State to track which cards should be visible
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  // State to track which connecting lines should be visible
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  // State to track which cards have completed their delay and should be activated
  const [activatedCards, setActivatedCards] = useState<number[]>([]);


  useEffect(() => {
    if (isHeadingVisible) {
    // STEP 1: Animate the connecting lines with staggered timing
      // Lines extend from the central MIS card to cards 1, 3, 5, and 7
      const linesTimer = setTimeout(() => {
        setVisibleLines([1]);                           // Line to top card (1)
        setTimeout(() => setVisibleLines([1, 3]), 200); // Add line to left card (3)
        setTimeout(() => setVisibleLines([1, 3, 5]), 400); // Add line to right card (5)
        setTimeout(() => setVisibleLines([1, 3, 5, 7]), 600); // Add line to bottom card (7)
      }, 500);
      
      // STEP 2: Animate the adjacent cards (1,3,5,7) slightly before lines finish extending
      // This creates an effect where cards start to appear as lines are reaching them
      const firstWaveTimer = setTimeout(() => {
        setVisibleCards([4, 1]);                        // Top card (1)
        setTimeout(() => setVisibleCards([4, 1, 3]), 200); // Left card (3)
        setTimeout(() => setVisibleCards([4, 1, 3, 5]), 400); // Right card (5)
        setTimeout(() => setVisibleCards([4, 1, 3, 5, 7]), 600); // Bottom card (7)
      }, 550); // Start 50ms after lines begin (lines take 500ms to animate)
      
      // STEP 3: Animate the remaining corner cards (0,2,6)
      const secondWaveTimer = setTimeout(() => {
        setVisibleCards([4, 1, 3, 5, 7, 0]);                  // Top-left card (0)
        setTimeout(() => setVisibleCards([4, 1, 3, 5, 7, 0, 2]), 200); // Top-right card (2)
        setTimeout(() => setVisibleCards([4, 1, 3, 5, 7, 0, 2, 6]), 400); // Bottom-left card (6)
      }, 1550); // Start after the first wave completes
      
      // Clean up timers when component unmounts or visibility changes
      return () => {
        clearTimeout(linesTimer);
        clearTimeout(firstWaveTimer);
        clearTimeout(secondWaveTimer);
      };
    } else {
      // When component is not visible, only show the central MIS card
      setVisibleCards([4]); // Card 4 (MIS) is always visible
      setVisibleLines([]); // Hide all connecting lines
    }
  }, [isHeadingVisible]);
  
  // When a card becomes visible, schedule it to be activated after 2 seconds
  useEffect(() => {
    visibleCards.forEach(cardIndex => {
      if (!activatedCards.includes(cardIndex)) {
        const timer = setTimeout(() => {
          setActivatedCards(prev => [...prev, cardIndex]);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    });
  }, [visibleCards, activatedCards]);

  // Helper functions
  const isCardVisible = (index: number) => visibleCards.includes(index) || index === 4;
  const isLineVisible = (index: number) => visibleLines.includes(index);
  const isCardActivated = (index: number) => activatedCards.includes(index);
  
  return (
    <div className="grid grid-cols-3 gap-20 min-h-[300px] perspective-1000px">
      
      {/* First row */}
      <div className={`servicesCard ${isCardVisible(0) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(0) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(0) ? 'text-accent' : ''}`}>
          {OurServices[0].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[0].description}</p>
      </div>
      
      <div className={`servicesCard ${isCardVisible(1) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(1) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(1) ? 'text-accent' : ''}`}>
          {OurServices[1].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[1].description}</p>
      </div>
      
      <div className={`servicesCard ${isCardVisible(2) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(2) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(2) ? 'text-accent' : ''}`}>
          {OurServices[2].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[2].description}</p>
      </div>
      
      {/* Second row */}
      <div className={`servicesCard ${isCardVisible(3) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(3) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(3) ? 'text-accent' : ''}`}>
          {OurServices[3].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[3].description}</p>
      </div>
      
      {/* MIS Powered - Always visible and activated but without hover effects */}
      <div className='w-[250px] h-[250px] p-6 border border-accent rounded-lg shadow-accent opacity-100 relative transition-all duration-500'
      style={{
        opacity: isHeadingVisible ? 1 : 0,
      }}>
        <MISCard />

        {/* Line to card 3 (left) */}
        <div className={`absolute h-[1px] bg-accent
        right-full translate-y-[-50%] top-1/2 z-[-1] flex items-center justify-center
        transition-all duration-500 ${isLineVisible(3) ? 'w-1/3' : 'w-0'}`}
        id='line-left'>
        </div>

        {/* Line to card 5 (right) */}
        <div className={`absolute h-[1px] bg-accent
        left-full translate-y-[-50%] top-1/2 z-[-1] flex items-center justify-center
        transition-all duration-500 ${isLineVisible(5) ? 'w-1/3' : 'w-0'}`}
        id='line-right'>
        </div>
        
        {/* Line to card 1 (top) */}
        <div className={`absolute w-[1px] bg-accent
        translate-x-[-50%] left-1/2 bottom-full z-[-1] flex items-center justify-center
        transition-all duration-500 ${isLineVisible(1) ? 'h-1/3' : 'h-0'}`}
        id='line-top'>
        </div>

        {/* Line to card 7 (bottom) */}
        <div className={`absolute w-[1px] bg-accent
        translate-x-[-50%] left-1/2 top-full z-[-1] flex items-center justify-center
        transition-all duration-500 ${isLineVisible(7) ? 'h-1/3' : 'h-0'}`}
        id='line-bottom'>
        </div>
      </div>
      
      <div className={`servicesCard ${isCardVisible(5) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(5) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(5) ? 'text-accent' : ''}`}>
          {OurServices[5].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[5].description}</p>
      </div>
      
      {/* Third row */}
      <div className={`servicesCard ${isCardVisible(6) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(6) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(6) ? 'text-accent' : ''}`}>
          {OurServices[6].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[6].description}</p>
      </div>
      
      <div className={`servicesCard ${isCardVisible(7) ? 'opacity-100' : 'opacity-0'} ${isCardActivated(7) ? 'servicesCardActivated' : ''}`}>
        <h2 className={`cardHeading ${isCardActivated(7) ? 'text-accent' : ''}`}>
          {OurServices[7].title}
        </h2>
        <p className='text-gray-700 Paragraph2'>{OurServices[7].description}</p>
      </div>
    </div>
  )
}

export default ServicesCards
