'use client'

import React from 'react'

const GradientCornerBorder = ({
    color1 = 'rgba(255,0,0,1)', // top-left
    color2 = 'rgba(0,255,0,1)', // top-right
    color3 = 'rgba(0,255,255,1)', // bottom-right
    color4 = 'rgba(255,0,255,1)', // bottom-left
    backgroundColor = 'rgba(16,0,37,1)',
    animate = true,
    animateSpeed = 2,
    borderRadius = 20,
    // size = 400,
    borderWidth = 2,
    zIndex = 0,
}) => {
    
    return (
    <div className={`absolute top-[0px] left-[0px] h-[100%] w-[100%] opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out z-[${zIndex}]`}>

        {/* main container */}
        <div className={`relative group z-[${zIndex}] flex justify-center items-center 
        overflow-hidden`}
        style={{
            height: '100%',
            width: '100%',
            borderRadius: `${borderRadius}px`,
        }}>

            {/* gradient background for border */}
            <div className={`absolute top-[0px] left-[0px] w-full h-full`}
            style={{
                // borderWidth: `${borderWidth}px`,
                // background: `linear-gradient(30deg, ${color1} 0%, ${color2} 50%, ${color1} 100%)`,
                background: `linear-gradient(to top left, ${color3}, rgba(255, 153, 150, 0), ${color1}), linear-gradient(to top right, ${color4}, rgba(255, 153, 150, 0), ${color2}) rgba(255, 153, 150, 1)`, 
                borderRadius: `${borderRadius+1}px`,
            }}
            ></div>
            
            {/* hiding background */}
            <div className={`absolute -top-[70%] -left-[40%] ${animate ? 'animate-border-rotate' : ''}`}
            style={{
                height: `250%`,
                width: `250%`,
                background: `linear-gradient(135deg, transparent 0%, ${backgroundColor} ${animate ? '60%' : '40%'})`,
                borderRadius: `${borderRadius}px`,
            }}
            >

            </div>

            {/* top background */}
            <div className={`absolute`}
             style={{
                height: `calc(100% - ${borderWidth*2}px)`,
                width: `calc(100% - ${borderWidth*2}px)`,
                borderRadius: `${borderRadius-1}px`,
                backgroundColor: backgroundColor,
             }}></div>
        </div>

        <style jsx>{`
          @keyframes borderRotate {
            0% {
              transform: rotateZ(0deg);
            }
            25% {
              transform: rotateZ(90deg);
            }
            50% {
              transform: rotateZ(180deg);
            }
            75% {
              transform: rotateZ(270deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .animate-border-rotate {
            animation: borderRotate ${animateSpeed}s linear infinite;
          }
        `}</style>

    </div>
  )
}

export default GradientCornerBorder
