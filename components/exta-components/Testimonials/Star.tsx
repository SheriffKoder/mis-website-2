import React from 'react';
import { Star as LucideStar } from 'lucide-react';

interface StarProps extends React.HTMLAttributes<SVGSVGElement> {
  className?: string;
  size?: number;
}

const Star: React.FC<StarProps> = ({ className, size = 24, ...props }) => {
  // Create unique IDs for each star's gradients to avoid conflicts
  const silverGradientId = `silver-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const goldGradientId = `gold-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="inline-block relative group">
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Silver gradient (default) */}
          <linearGradient id={silverGradientId} gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="#f0f0f0" />
            <stop offset="50%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#a0a0a0" />
          </linearGradient>
          
          {/* Gold gradient (hover) - less bright */}
          <linearGradient id={goldGradientId} gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="#e6c200" />
            <stop offset="50%" stopColor="#d4a017" />
            <stop offset="100%" stopColor="#c17e00" />
          </linearGradient>
        </defs>
      </svg>
      <LucideStar 
        className={`${className || ''} transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]`} 
        strokeWidth={1} 
        size={size}
        style={{ 
          fill: `url(#${silverGradientId})`, 
          stroke: `url(#${silverGradientId})` 
        }}
        {...props}
        onMouseEnter={(e) => {
          e.currentTarget.style.fill = `url(#${goldGradientId})`;
          e.currentTarget.style.stroke = `url(#${goldGradientId})`;
          if (props.onMouseEnter) props.onMouseEnter(e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.fill = `url(#${silverGradientId})`;
          e.currentTarget.style.stroke = `url(#${silverGradientId})`;
          if (props.onMouseLeave) props.onMouseLeave(e);
        }}
      />
    </div>
  );
};

export default Star; 