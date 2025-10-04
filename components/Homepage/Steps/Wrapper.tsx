"use client"
import React, { useState } from 'react'
import {WebsiteHeaders} from "@/constants";

import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";
import { easeOut } from 'framer-motion';
import FlowContainer from '@/components/exta-components/Steps/FlowContainer';


const StepsSection = () => {

    const [animateCards, setAnimateCards] = useState(false);
    
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    useGSAP(()=> {
      gsap.to("#sectionFour_header", {
        scrollTrigger: {
            trigger: ".section4",
            // scrub: true,
            start: "top 60%",
            end: "10% 50%",
            // markers: false,

          },
        y: 0, //normal value
        opacity: 1,
        duration: 1,
        delay: 0,
        ease:  easeOut,
  
      });

      gsap.to("#sectionFour_para", {
        scrollTrigger: {
            trigger: ".section4",
            // scrub: true,
            start: "top 60%",
            end: "10% 50%",
            // markers: false,

          },
          y: 0, //normal value
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: easeOut
  
      });

      gsap.set(".stepsCards", {
        opacity: 0,
      })

      gsap.to(".stepsCards", {
        scrollTrigger: {
            trigger: ".section4",
            start: "top 50%",
            end: "top top",
            // markers: true,
          },
          opacity: 1,
          duration: 1,
          delay: 0,
          ease:  easeOut,
      })

      ScrollTrigger.create({
        trigger: ".section4",
        start: "top 30%",
        end: "top top",
        // markers: true,
        onEnter: () => setAnimateCards(true)
      })

    },[]);

  return (
    <section className='section4 flex flex-col items-center w-full h-full max-w-[80vw] mx-auto
    py-[4rem]
    bg-[#0a0a0a00] border border-[#25252500] rounded-[10px]'
    id="steps">

        <div className='flex flex-col gap-0 text-center max-w-[1000px] mx-auto mb-[2rem] z-[99]'>
            <h2 className='Heading3 xl:Heading3 translate-y-[50px] opacity-0 mb-4' id="sectionFour_header">{WebsiteHeaders.steps.header}</h2>
            <p className='Paragraph2 pl-[0.5rem] translate-y-[30px] opacity-0' id="sectionFour_para">{WebsiteHeaders.steps.paragraph}</p>
        </div>

        <FlowContainer animateCards={animateCards} />

    </section>
  )
}

export default StepsSection
