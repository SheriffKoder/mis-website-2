import React, { useEffect, useState } from 'react';

interface AnimatedDonutChartProps {
  percentage: number;
  duration: number;
  color?: string;
  thickness?: number;
  delay?: number;
}

const AnimatedDonutChart: React.FC<AnimatedDonutChartProps> = ({
  percentage = 100,
  duration = 2000,
  color = '#00f0ff',
  thickness = 0.2,
  delay = 0
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= percentage) {
            clearInterval(interval);
            return percentage;
          }
          return prev + 1;
        });
      }, duration / percentage);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [percentage, duration, delay]);

  // Calculate the circumference and the offset
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* Animated progress circle - starts from bottom (rotate 90 degrees) */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(90 60 60)"
          className="transition-all duration-300 ease-out"
        //   style={{ filter: 'drop-shadow(0 0 4px ' + color + ')' }}
        />
      </svg>
    </div>
  );
};

export default AnimatedDonutChart; 