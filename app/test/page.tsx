'use client'

import React from 'react'

const GradientCornerBorder = () => {
  const borderWidth = 2
  const size = 500;
  const color1 = 'rgba(255,0,0,1)' // top-left
  const color2 = 'rgba(0,255,0,1)' // top-right
  const color3 = 'rgba(0,255,255,1)' // bottom-right
  const color4 = 'rgba(255,0,255,1)' // bottom-left
  const backgroundColor = 'rgba(16,0,37,1)'
  const animate = true;
  const animateSpeed = 2;
  const borderRadius = 20;
  return (
    <div className='w-full h-screen bg-gray-700 flex justify-center items-center'>

        {/* main container */}
        <div className={`relative group z-[1] flex justify-center items-center 
        overflow-hidden`}
        style={{
            height: `${size}px`,
            width: `${size}px`,
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
            <div className={`absolute -top-[35%] -left-[35%] ${animate ? 'animate-border-rotate' : ''}`}
            style={{
                height: `${size*2}px`,
                width: `${size*2}px`,
                background: `linear-gradient(135deg, transparent 0%, rgba(0,0,0,1) ${animate ? '60%' : '40%'})`,
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
