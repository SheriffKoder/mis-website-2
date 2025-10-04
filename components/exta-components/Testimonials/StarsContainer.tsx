import React, { useState, useEffect } from 'react'
import Star from './Star'
import { motion } from 'framer-motion'

const StarsContainer = ({ size, animateStars }: { size: number, animateStars: boolean }) => {
  // Calculate container dimensions based on size
  const containerWidth = Math.max(350, size * 7);
  const containerHeight = Math.max(70, size * 2);
  
  // Define all positions in the arc
  const positions = [
    { left: 0, top: containerHeight * 0.45 },                  // Position 1
    { left: containerWidth * 0.2, top: containerHeight * 0.3 }, // Position 2
    { left: containerWidth * 0.4, top: containerHeight * 0.2 }, // Position 3
    { left: containerWidth * 0.6, top: containerHeight * 0.3 }, // Position 4
    { left: containerWidth * 0.8, top: containerHeight * 0.45 }, // Position 5
  ];

  // State to track animation step
  const [animationStep, setAnimationStep] = useState(0);

  // Trigger the animation steps with delays between the last two versions
  useEffect(() => {
    if (animateStars) {
      // Start with all stars at position 1
      setAnimationStep(0);
      
      // After a delay, move 4 stars to position 2
      const timer1 = setTimeout(() => {
        setAnimationStep(1);
      }, 150); // 150ms delay (between 100ms and 200ms)
      
      // After another delay, move 3 stars to position 3
      const timer2 = setTimeout(() => {
        setAnimationStep(2);
      }, 300); // 150ms after the first step
      
      // After another delay, move 2 stars to position 4
      const timer3 = setTimeout(() => {
        setAnimationStep(3);
      }, 450); // 150ms after the second step
      
      // After another delay, move 1 star to position 5
      const timer4 = setTimeout(() => {
        setAnimationStep(4);
      }, 600); // 150ms after the third step
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [animateStars]);

  return (
    <div className="relative" style={{ width: containerWidth, height: containerHeight }}>
      {/* First star stays at position 1 */}
      <motion.div
        key="star1"
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          left: positions[0].left,
          top: positions[0].top,
          opacity: 1
        }}
        transition={{ 
          type: "spring",
          stiffness: 180, // Moderate stiffness
          damping: 18,    // Higher damping to reduce jiggling
          duration: 0.12  // Between 0.08 and 0.15
        }}
      >
        <Star size={size} />
      </motion.div>

      {/* Second star starts at position 1, moves to position 2, and stays there */}
      <motion.div
        key="star2"
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          left: animationStep === 0 ? positions[0].left : positions[1].left,
          top: animationStep === 0 ? positions[0].top : positions[1].top,
          opacity: 1
        }}
        transition={{ 
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.12
        }}
      >
        <Star size={size} />
      </motion.div>

      {/* Third star starts at position 1, moves to position 2, then to position 3, and stays there */}
      <motion.div
        key="star3"
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          left: animationStep === 0 ? positions[0].left : 
                animationStep === 1 ? positions[1].left : positions[2].left,
          top: animationStep === 0 ? positions[0].top : 
               animationStep === 1 ? positions[1].top : positions[2].top,
          opacity: 1
        }}
        transition={{ 
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.12
        }}
      >
        <Star size={size} />
      </motion.div>

      {/* Fourth star follows path through positions 1-4 */}
      <motion.div
        key="star4"
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          left: animationStep === 0 ? positions[0].left : 
               animationStep === 1 ? positions[1].left : 
               animationStep === 2 ? positions[2].left : positions[3].left,
          top: animationStep === 0 ? positions[0].top : 
               animationStep === 1 ? positions[1].top : 
               animationStep === 2 ? positions[2].top : positions[3].top,
          opacity: 1
        }}
        transition={{ 
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.12
        }}
      >
        <Star size={size} />
      </motion.div>

      {/* Fifth star follows path through all positions */}
      <motion.div
        key="star5"
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          left: animationStep === 0 ? positions[0].left : 
               animationStep === 1 ? positions[1].left : 
               animationStep === 2 ? positions[2].left : 
               animationStep === 3 ? positions[3].left : positions[4].left,
          top: animationStep === 0 ? positions[0].top : 
               animationStep === 1 ? positions[1].top : 
               animationStep === 2 ? positions[2].top : 
               animationStep === 3 ? positions[3].top : positions[4].top,
          opacity: 1
        }}
        transition={{ 
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.12
        }}
      >
        <Star size={size} />
      </motion.div>
    </div>
  );
};

export default StarsContainer;
