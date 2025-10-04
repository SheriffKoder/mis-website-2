"use client"
import React from 'react'

import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";
import { easeOut } from 'framer-motion';

import { AnimatedNumbers } from '@/components/exta-components/Numbers/IncreasingNumbers';
import { section_numbers_cardsContent } from '@/constants';

const PopUpNumbers = () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    useGSAP(()=> {
        
        const tl3 = gsap.timeline({
            scrollTrigger: {
                trigger: ".section3",
                start: "top 20%",
                end: "50% top",
                // markers: true,
            }
        })

        tl3.add("Section3_2")
        .to("#sectionThreeHeader", {
            translateY: -75,
            duration: 2.5,
            ease: "elastic.out(1,0.3)",
            delay: 0,
        }, "Section3_2")
        .to("#sectionThreeCardsContainer", {
            translateY: 0,
            opacity: 1,
            duration: 0.5,
            ease: easeOut,
            delay: 0,
        }, "Section3_2")
        
        // Add animation for the "+" signs
        gsap.to(".animated-plus", {
            opacity: 1,
            duration: 0.3,
            delay: 1, // Adjust this delay to match when your numbers finish animating
            scrollTrigger: {
                trigger: ".section3",
                start: "top 20%",
            }
        });
    },[]);

  return (
    <div className='w-full ml-auto h-full flex items-center justify-center text-white
    relative pt-16 md:pt-24'
    id="section3">
        <div className='flex flex-row justify-center items-center w-full'>
            
            <div className='absolute left-0 w-full text-center flex flex-row gap-[2rem]
            items-center justify-center' id="sectionThreeHeader">
            {section_numbers_cardsContent.map((card,index)=> (
                <div className='section3_card w-[30%] md:w-[180px] md2:w-[200px] md2:h-[200px] flex flex-col gap-0 md2:gap-2 items-center justify-center'
                key={index}>
                    <p className='Paragraph1 scale-90'>{card.content}</p>
                    <h3 className='cardHeading2'>{card.name}</h3>
                </div>
            ))}
            </div>

            <div className='flex flex-row gap-[1rem] md2:gap-[1rem] opacity-0 translate-y-[4rem] max-w-[91vw]' id="sectionThreeCardsContainer">
                
            {section_numbers_cardsContent.map((card,index)=> (
                <div className='section3_card w-[150px] md:w-[180px] md2:w-[220px] md2:h-[200px] flex flex-col gap-0 md2:gap-2 items-center justify-center'
                key={"sectionThree_cardsContent"+index}>
                    <span className='Paragraph1'>
                        <AnimatedNumbers value={card.number}/>
                        <span className="animated-plus" style={{ opacity: 0 }}>+</span>
                    </span>
                </div>
            ))}
                
            </div>
        </div>
    </div>
  )
}

export default PopUpNumbers
