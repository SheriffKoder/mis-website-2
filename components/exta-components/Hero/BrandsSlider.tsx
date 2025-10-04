"use client"

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

// import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/all";
import { brandLogos } from '@/constants';

const BrandsSlider = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);

  const slider = useRef(null);

  const factor = useRef(0.004);

  let xPercent = 10;
  let direction = 1; // -1 left, 1 right

  useEffect(() => {

      gsap.registerPlugin(ScrollTrigger); //2

      requestAnimationFrame(animation);

      gsap.to(slider.current, {   //2
          scrollTrigger: {
              trigger: document.documentElement,
              start: 0,
              end: window.innerHeight,
              scrub: 0.25,    // instead of 1 to be more smooth
              onUpdate: e => direction = e.direction * -1, // reverse direction
          },
          x: "-=75px", // original: 300
      })


  }, []);

  const animation = () => {

      // reset (left)
      if (xPercent <= -100) {
          xPercent = 0;
      }

      // reset (right)
      if (xPercent > 0) {
          xPercent = -100;
      }

      gsap.set(firstText.current, {
          xPercent: xPercent
      });
      gsap.set(secondText.current, {
          xPercent: xPercent
      });
      xPercent += factor.current * direction; //speed   original: 0.1
      requestAnimationFrame(animation);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-[100px] z-10 bg-gradient-to-r from-transparent to-transparent"></div>
      <div className="absolute right-0 top-0 h-full w-[100px] z-10 bg-gradient-to-l from-transparent to-transparent"></div>
      
      <div ref={slider} className="relative whitespace-nowrap flex flex-row
      hover:cursor-pointer z-[1]"
              onMouseEnter={() => factor.current = 0.001}
              onMouseLeave={() => factor.current = 0.004}
          >
              <span ref={firstText} className="relative left-[0]">
                  <div className='w-[200vw] md:w-[100vw] h-[60px] lg:h-[75px] 
          flex flex-row justify-around items-center gap-8 md:gap-1'>
              {brandLogos.map((logo, index) => (
                  <div key={index} className='bg-transparent hover:bg-white h-[60px] w-[90px] md2:h-[75px] md2:w-[120px] flex items-center justify-center 
                  p-2 rounded-[10px] overflow-hidden relative brightness-200 hover:brightness-100
                  grayscale opacity-100 hover:grayscale-0 hover:opacity-100 transition-all 
                  duration-200'>
                  <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain object-center"
                  />
                  </div>
                      ))}
                  </div>
              </span>

              <span ref={secondText} className="absolute left-[200vw] md:left-[100vw] md2:left-[100vw]">
                  <div className='w-[200vw] md:w-[100vw] h-[50px] lg:h-[75px] 
          flex flex-row justify-around items-center gap-8 md:gap-1'>
              {brandLogos.map((logo, index) => (
                  <div key={index} className='bg-transparent hover:bg-white h-[60px] w-[90px] md2:h-[75px] md2:w-[120px] flex items-center justify-center 
                  p-2 rounded-[10px] overflow-hidden relative brightness-200 hover:brightness-100
                  grayscale opacity-100 hover:grayscale-0 hover:opacity-100 transition-all 
                  duration-200'>
                  <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain object-center"
                  />
                  </div>
                      ))}
              </div>
              </span>
          </div>
    </div>
  );
};

export default BrandsSlider; 