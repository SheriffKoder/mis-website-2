"use client"
import Button from '@/components/ui/Button'
import GradientButton from '@/components/ui/GradientButton'
import React from 'react'
import { WebsiteHeaders } from '@/constants'
import { useGSAP } from "@gsap/react";
import { animations } from '@/utils/gsapAnimations'
import { easeInOut, easeOut } from 'framer-motion'
import BrandsSlider from '@/components/exta-components/Hero/BrandsSlider';

const HeroWrapper = () => {

    useGSAP(()=> {
        // Use slideUp animation for hero text elements with the original values
        animations.slideUp("#hero_text1", {
          duration: 1,
          delay: 0.5,
          distance: 50,
          ease: easeOut
        });
    
        animations.slideUp("#hero_text2", {
          duration: 1,
          delay: 1.5,
          distance: 30,
          ease: easeOut
        });
    
        // Use slideUp for buttons with the original values
        animations.slideUp(".hero_button1", {
          duration: 1,
          delay: 1.75,
          distance: 15,
          ease: easeInOut
        });
    
        animations.slideUp(".hero_button2", {
          duration: 1,
          delay: 1.75,
          distance: 15,
          ease: easeInOut
        });



    },[]);

  return (
    <section className='w-full min-h-screen flex justify-center items-center relative' id="hero">

        <div id="heroContent" className='w-full flex flex-col justify-center items-center md2:items-start px-[5%] md2:px-[10%] 3xl:px-0
        text-center md2:text-left max-w-[1800px]'>
            <h1 className='flex flex-col items-center md2:items-start gap-2 Heading1 z-[2]'
            id="hero_text1">
                <div className=''>Modern</div> 
                <div className=''>Intelligence</div> 
                <div className=''>Solutions</div>
            </h1>
            <p className='Paragraph1 mt-4 max-w-[1000px] text-center md2:text-left z-[2]'
            id="hero_text2">
                {WebsiteHeaders.hero.paragraph}
            </p>
            
            <div className='w-full flex flex-col heroButtons_wrapper
            md:flex-row justify-start items-start md:items-center mt-4 gap-2 md2:gap-4 z-[2]'>
                <Button text={WebsiteHeaders.hero.button1}  className='w-full md2:w-[250px] hero_button1' defaultAnimate={false} heavyBorder={true}
                onClick={()=>{
                    window.location.href = '#contact';
                }}/>
                <GradientButton text={WebsiteHeaders.hero.button2} showIcon={true} className='w-full md2:w-[250px] hero_button2' onClick={()=>{
                    window.location.href = '#about';
                }}/>
            </div>

            <div className='w-full absolute bottom-[10%] md2:bottom-[7%] left-0 right-0
            md:px-[10%] 3xl:px-0 brandSlider
            text-center md2:text-left max-w-[1800px] 8xl:bg-gradient-to-r from-[#9046d92a] to-[#17d8ff36] z-[0]
             hover:from-[#e6e6e600] hover:to-[#aff2ff00] transition-all duration-300'>
                <div className="absolute left-0 top-0 h-full w-[20%] z-10 bg-gradient-to-r from-black to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-[20%] z-10 bg-gradient-to-l from-black to-transparent"></div>
                <BrandsSlider />
            </div>
        
        </div>

    </section>
  )
}

export default HeroWrapper
