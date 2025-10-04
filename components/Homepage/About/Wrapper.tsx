"use client"
import { WebsiteHeaders } from '@/constants'
import { section_about_cardsContent } from '@/constants';

import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";
import { easeInOut, easeOut } from 'framer-motion';
import { useState } from 'react';

import AboutCard from '@/components/exta-components/About/aboutCard';




const AboutWrapper = () => {
  // const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isSectionTwoVisible, setIsSectionTwoVisible] = useState(false);
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  useGSAP(()=> {

        // Create a ScrollTrigger that updates the isHeadingVisible state
        ScrollTrigger.create({
          trigger: ".section2",
          start: "top 60%",
          end: "top top",
          // markers: true,
          // onEnter: () => setIsHeadingVisible(true),
          // Only trigger in forward direction - don't reset when scrolling back up
          // onLeaveBack: () => setIsHeadingVisible(false),
        });

        gsap.set("#sectionTwo_header", {
          opacity: 0,
          y: 50
        })
        
        gsap.to("#sectionTwo_header", {
          scrollTrigger: {
              trigger: ".section2",
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

        gsap.set("#sectionTwo_para", {
          opacity: 0,
          y: 50
        })

        gsap.to("#sectionTwo_para", {
          scrollTrigger: {
              trigger: ".section2",
              // scrub: true,
              start: "top 60%",
              end: "top top",
              // markers: true,

            },
            y: 0, //normal value
            opacity: 1,
            duration: 0.75,
            delay: 0.25,
            ease: easeInOut
    
        });

        // sllow to set margin when robot enters the section
        ScrollTrigger.create({
          trigger: ".section2",
          start: "30% 60%",
          end: "70% top",
          // markers: true,
          onEnter: () => setIsSectionTwoVisible(true),
          // Only trigger in forward direction - don't reset when scrolling back up
          onLeave: () => setIsSectionTwoVisible(false),
          onEnterBack: () => setIsSectionTwoVisible(true),
          onLeaveBack: () => setIsSectionTwoVisible(false),
        });

  },[]);


  return (
    <section className='section2 w-full flex flex-col justify-center items-start pt-[7rem] px-[10%] max-w-[2000px]' id="about">

      <div className='w-full flex flex-col justify-center items-center text-center md2:items-end md2:text-right'>
        <h2 className='Heading2' id="sectionTwo_header">
          {WebsiteHeaders.about.header}
        </h2>
        <p className='Paragraph1 mt-4 max-w-[1000px]' id="sectionTwo_para">
          {WebsiteHeaders.about.paragraph}
        </p>
      </div>

      {/* <div className='flex-1 w-full justify-center items-center mt-20
      relative floating-left-static hidden xl:flex'>
        <ServicesCards isHeadingVisible={isHeadingVisible} />
      </div> */}

        <div className={`about_cards_container transition-all duration-1000 ease-in-out ${isSectionTwoVisible ? 'lg:ml-[150px] xl:ml-[300px]' : ''}`}>
          {/* grid with items aligned to the right */}
          <div className='about_cards_container mt-20 grid grid-cols-1 lg:grid-cols-2 gap-2 justify-items-end'>
            {section_about_cardsContent.map((card, index) => (
              <AboutCard 
                card={card}
                index={index}
                key={index}
                section_about_cardsContent={section_about_cardsContent}
              />
            ))}
          </div>
        </div>



      
    </section>
  )
}

export default AboutWrapper
