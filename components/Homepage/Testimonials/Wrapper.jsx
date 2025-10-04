"use client"
import React, { useEffect, useState } from 'react'
// import Image from 'next/image';

import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";
import { easeOut } from 'framer-motion';

import * as LucideIcons from 'lucide-react';
import StarsContainer from '@/components/exta-components/Testimonials/StarsContainer';
import Carousel from '@/components/exta-components/Testimonials/carousel';


/*

https://www.youtube.com/watch?v=j7GG009J9uc  
https://www.lundevweb.com/2023/11/design-effect-magic-slider-using-html.html
https://github.com/HoanghoDev/slider_1






*/


const Testimonials = () => {

    const [starSize, setStarSize] = useState(40);
    const [animateStars, setAnimateStars] = useState(false);

    // Handle responsive star sizing
    useEffect(() => {
        const handleResize = () => {
            // Set star size based on screen width (xl breakpoint is typically 1280px)
            setStarSize(window.innerWidth >= 1280 ? 80 : 40);
        };

        // Set initial size
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    useGSAP(()=> {
        
        gsap.set("#sectionFive_header", {
            y: 50,
            opacity: 0
        })

        gsap.to("#sectionFive_header", {
            scrollTrigger: {
                trigger: ".section5",
                // scrub: true,
                start: "top 60%",
                end: "10% 50%",
                // markers: true,

            },
            y: 0, //normal value
            opacity: 1,
            duration: 1,
            delay: 0,
            ease:  easeOut,

        });

        gsap.set("#sectionFive_element", {
            x: 100, //normal value
        })
        gsap.to("#sectionFive_element", {
            scrollTrigger: {
                trigger: ".section5",
                // scrub: true,
                start: "top 60%",
                end: "10% 50%",
                // markers: true,

            },
            x: 0, //normal value
            opacity: 1,
            duration: 1,
            delay: 0.5,
            ease:  easeOut,

        });

        //   gsap.to("#sectionFive_para", {
        //     scrollTrigger: {
        //         trigger: "#section5",
        //         // scrub: true,
        //         start: "top 60%",
        //         end: "10% 50%",
        //         // markers: false,

        //       },
        //       y: 0, //normal value
        //       opacity: 1,
        //       duration: 1,
        //       delay: 0.5,
        //       ease: easeOut

        //   });

        // animate stars on scroll
        ScrollTrigger.create({
            trigger: ".section5",
            start: "top 60%",
            end: "10% 50%",
            // markers: true,
            onEnter: () => setAnimateStars(true)
        })

    },[]);


  return (
    <section className='section5 h-[1000px] md1:h-[1000px] md2:h-[1000px] lg:h-[1200px] w-full 
    flex items-center justify-start flex-col overflow-hidden
    gap-[3rem] md:max-w-[80vw] mx-auto xl:mt-[10rem] xl:max-w-[1100px]'
    id="testimonials"
    >

        <div className='pt-[5rem] lg:pt-0 relative'>
            {/* Stars positioned behind the heading and to the right - now using dynamic size */}
            <div className={`flex justify-center items-center top-[-2rem] md2:top-[-10rem] z-10 ml-[2rem]
                transition-all duration-[2s] ${animateStars ? 'opacity-100' : 'opacity-0'}
                `}>
                <StarsContainer size={starSize} animateStars={animateStars} />
            </div>
            
            <h1 className='Heading3 text-center opacity-0 mt-5' id="sectionFive_header">What our customers say</h1>
        </div>
        
        
      <div className='relative w-full translate-x-[10rem] opacity-0 max-w-[80vw]' id="sectionFive_element">
        <LucideIcons.Quote className='absolute top-[5%] right-[-0%] xl:right-[-5%] w-1/2 h-1/2 opacity-[0.05] stroke-[#17D9FF] stroke-[1px]'/>

        <Carousel />

      </div>
    </section>


  )
}

export default Testimonials
