"use client"

import React, { useEffect, useState } from 'react';

interface DonutCountdownProps {
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  onComplete?: () => void;
}

const DonutCountdown: React.FC<DonutCountdownProps> = ({
  totalSeconds,
  size = 40,
  strokeWidth = 4,
  primaryColor = '#3b82f6', // Blue
  secondaryColor = '#e5e7eb', // Light gray
  textColor = '#1f2937', // Dark gray
  onComplete
}) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate stroke dash offset based on remaining time
  const progress = secondsLeft / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  
  useEffect(() => {
    // Reset seconds if totalSeconds changes
    setSecondsLeft(totalSeconds);
    
    // Set up the countdown interval
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [totalSeconds, onComplete]);
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      
      {/* Countdown text */}
      <div 
        className="absolute text-center font-medium mb-[1px]"
        style={{ color: textColor, fontSize: `${size / 3}px` }}
      >
        {secondsLeft}
      </div>
    </div>
  );
};

export default DonutCountdown; 