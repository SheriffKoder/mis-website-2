import { section_testimonials_cardsContent } from '@/constants'
import React, { useEffect, useRef } from 'react'
import * as LucideIcons from 'lucide-react';
import '@/styles/carousel.css';
const Carousel = () => {

    const nextBtn = useRef(null);

    useEffect(()=> {
        // Only proceed if component is mounted
        if (!nextBtn.current) return;

        //step 1: get DOM
        let nextDom = document.getElementById('next');
        let prevDom = document.getElementById('prev');

        let carouselDom = document.querySelector('.carousel');
        let SliderDom = carouselDom.querySelector('.carousel .list');
        let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
        // let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
        // let timeDom = document.querySelector('.carousel .time');

        // thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        let timeRunning = 500;
        let timeAutoNext = 7000;

        // Check if elements exist before adding event listeners
        if (nextDom) {
            nextDom.onclick = function(){
                showSlider('next');     
            }
        }

        if (prevDom) {
            prevDom.onclick = function(){
                showSlider('prev');    
            }
        }
        
        let runTimeOut;
        let runNextAuto;
        
        // Start the auto-rotation
        if (nextBtn.current) {
            runNextAuto = setTimeout(() => {
                if (nextBtn.current) {
                    nextBtn.current.click();
                }
            }, timeAutoNext);
        }
        
        function showSlider(type){
            // Check if elements still exist
            if (!carouselDom || !SliderDom || !thumbnailBorderDom) return;
            
            let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
            let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
            
            if(type === 'next'){
                SliderDom.appendChild(SliderItemsDom[0]);
                thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                carouselDom.classList.add('next');
            }else{
                SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
                thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
                carouselDom.classList.add('prev');
            }
            
            clearTimeout(runTimeOut);
            runTimeOut = setTimeout(() => {
                if (carouselDom) {
                    carouselDom.classList.remove('next');
                    carouselDom.classList.remove('prev');
                }
            }, timeRunning);

            clearTimeout(runNextAuto);
            runNextAuto = setTimeout(() => {
                // Check if button still exists before clicking
                if (nextBtn.current) {
                    nextBtn.current.click();
                }
            }, timeAutoNext);
        }
        
        // Cleanup function to clear timeouts when component unmounts
        return () => {
            clearTimeout(runTimeOut);
            clearTimeout(runNextAuto);
            
            // Remove event listeners
            if (nextDom) nextDom.onclick = null;
            if (prevDom) prevDom.onclick = null;
        };
    },[])
    
  return (
    <div className="carousel">
        
        <div className="list">
            

            {section_testimonials_cardsContent.map((card, index)=> (
            <div className="item bg-[#0a0a0a42] border border-[#252525] rounded-[10px]
            "
            id={card.name}
            key={"sectionFive_cardsContent"+index}>
                <div className="content flex flex-col gap-2 w-full">
                    <div className="author">{card.company}</div>
                    <div className="title text-[1.5rem] md2:text-[min(45px,8vw)]">{card.name}</div>

                    <div className='flex flex-row gap-2 mb-[1rem] services flex-wrap'>
                    {
                        card.services.map((service, index)=> (
                            <div className="text-xs md:text-sm md:px-3 md:py-2 px-2 py-1 border-[1px] rounded-[10px] min-w-[100px] text-center
                            accent1 border-[#17D9FF] grayscale opacity-80 hover:grayscale-0 cursor-pointer"
                            key={"card services"+index+""+Math.random()}>{service}</div>
                        ))
                    }
                    </div>


                    <div className="des">
                        <p className=' Paragraph1'>
                        {card.comment}
                        </p>
                    </div>
                </div>
            </div>
            ))}
            

        </div>


        <div className="thumbnail">
            {section_testimonials_cardsContent.map((card, index)=> (
                <span key={"sectionFive_cardsContent thumb"+Math.random()}>
                {(section_testimonials_cardsContent[0].name !== card.name) && (
                    <div className={`rounded-[5px] item
                    CardStyle_cont overflow`}
                    id={"thumb "+card.name+index}
                    key={"sectionFive_cardsContent thumb"+Math.random()}>
                    {/* <Image alt="" src={`/image/img1.jpg`} width={200} height={400}/> */}
                        <div className={`${index % 2 === 0 ? 'CardStyle_bg_1' : 'CardStyle_bg_2'} bg-[#0a0a0a2f] border border-[#252525] rounded-[10px] content CardStyle_glass w-full h-[100px]`}>
                            <div className="title text-xs">
                                {card.name}
                            </div>
                            <div className="description font-extralight text-xs md2:text-base">
                                {card.company}
                            </div>
                        </div>
                    </div>
                )}       
                </span>
            ))}

            <div className={`rounded-[5px] item CardStyle_cont overflow-hidden`}
            id={"thumb "+section_testimonials_cardsContent[0].name+0}>
            {/* <Image alt="" src={`/image/img1.jpg`} width={200} height={400}/> */}
            <div className={`CardStyle_bg_1 content CardStyle_glass bg-[#0a0a0a2f] border border-[#252525] rounded-[10px] content CardStyle_glass w-full h-[100px]`}>
                <div className="title text-xs">
                    {section_testimonials_cardsContent[0].name}
                </div>
                <div className="description font-extralight text-xs md2:text-base">
                    {section_testimonials_cardsContent[0].company}
                </div>
                </div>
            </div>

        </div>

        <div className="arrows">
            <button id="prev" className='flex items-center justify-center'><LucideIcons.ChevronLeft /></button>
            <button id="next" ref={nextBtn} className='flex items-center justify-center'><LucideIcons.ChevronRight /></button>
        </div>
        
        <div className="time">
        </div>

    </div>
  )
}

export default Carousel
