"use client"
import { useState } from 'react';
import PopUpNumbers from "../../exta-components/Numbers/PopUpNumbers"
import AnimatedDonutChart from "../../exta-components/Numbers/AnimatedDonutChart"
import { WebsiteHeaders } from '@/constants';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { easeOut } from 'framer-motion';

const NumbersWrapper = () => {
  const [showDonut, setShowDonut] = useState(false);

  useGSAP(()=> {
    gsap.registerPlugin(ScrollTrigger);
    // Create a ScrollTrigger that updates the showDonut state
    ScrollTrigger.create({
      trigger: ".section3",
      start: "top 60%",
      end: "top top",
      // markers: true,
      onEnter: () => setShowDonut(true),
      // Only trigger in forward direction - don't reset when scrolling back up
      // onLeaveBack: () => setShowDonut(false),
    });


    gsap.set("#sectionThree_header", {
      opacity: 0,
      y: 50
    })
    
    gsap.to("#sectionThree_header", {
      scrollTrigger: {
          trigger: ".section3",
          // scrub: true,
          start: "top 60%",
          end: "top top",
          // markers: true,
    
        },
      y: 0, //normal value
      opacity: 1,
      duration: 0.5,
      delay: 0,
      ease:  easeOut,
    
    });

    gsap.set("#sectionThree_para", {
      opacity: 0,
      y: 50
    })

    gsap.to("#sectionThree_para", {
      scrollTrigger: {
          trigger: ".section3",
          // scrub: true,
          start: "top 60%",
          end: "top top",
          // markers: true,

        },
        y: 0, //normal value
        opacity: 1,
        duration: 0.75,
        delay: 0.25,
        ease:  easeOut,
    })
  },[]);

  return (
    <section className='section3 overflow-hidden md2:overflow-visible xl:mb-[300px] min-h-[800px] w-full flex flex-col justify-start items-start 
    pt-[7rem] px-[10%] mt-20 xl:mt-36
    ' id="numbers">
      
      <div className='w-full flex flex-col justify-center items-center text-center z-[2]'>
        <h2 className='Heading2' id="sectionThree_header">{WebsiteHeaders.numbers.header}</h2>
        <p className='Paragraph1 mt-4 max-w-[1000px]' id="sectionThree_para">
          {WebsiteHeaders.numbers.paragraph}
        </p>
      </div>


      <div className='h-[400px] md2:h-[700px] xl:h-[400px] w-[200%] md2:w-full flex justify-center items-center relative
      right-1/2 md2:right-0' id="section3"> 
          
          {/* Container for both rotating circles */}
          <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full'>
            
            {/* Add the animated donut chart as a separate layer */}
            {showDonut && (
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none'>
              <div className='w-[96%] aspect-square'>
                <AnimatedDonutChart 
                  percentage={100} 
                  duration={3000} 
                  color="#19D6AF" 
                  delay={0}
                />
              </div>
            </div>
            )} 
            
            {/* First circle with gray border */}
            <div className='rotate3601 opacity-50 absolute top-0 left-0 w-full h-full flex justify-center items-center'
            style={{
              animationDuration: '150s',
            }}>
              <div className='w-[70%] aspect-square rounded-full border-2 border-gray-400 relative'>
                {/* Left dot */}
                <div className='absolute w-4 h-4 bg-gray-400 rounded-full -left-2 top-1/2 transform -translate-y-1/2'></div>
                
                {/* Right dot */}
                <div className='absolute w-4 h-4 bg-gray-400 rounded-full -right-2 top-1/2 transform -translate-y-1/2'></div>
              </div>
            </div>

            {/* Second circle with neon border */}
            <div className='rotate3601 opacity-50 absolute top-0 left-0 w-full h-full flex justify-center items-center'
            style={{
              animationDuration: '220s',
            }}>
              <div className='w-[80%] aspect-square rounded-full border-0 border_neon1' id="circle1">
                <div className='w-full h-full border-dashed border-[10px] rounded-full opacity-[0.05]'>
                </div> 
              </div>
            </div>
            

          </div>
            <div className='w-full h-full flex justify-center items-center max-w-[90vw]'>
              <PopUpNumbers />
            </div>

      </div>
    </section>
  )
}

export default NumbersWrapper
