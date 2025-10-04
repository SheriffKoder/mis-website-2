"use client"
// import { useGSAP } from "@gsap/react";
// import gsap from 'gsap'
import React, { useEffect } from 'react'
// import {ScrollTrigger, ScrollToPlugin} from "gsap/all";

// import "./SmoothRevealNav.css"
import "@/styles/desktop-nav-bar.css";


import { nav_links } from '@/constants';
import Link from 'next/link';
import Image from "next/image";
// import ColoredButton from './ColoredButton';
import Button from './Button';
// https://codepen.io/GreenSock/pen/qBawMGb
// https://codepen.io/GreenSock/pen/mdVyPvK

const Page = () => {

    // gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // useGSAP(()=> {

    //     // register the .from, progress=1 (complete), pause it then play on the window
    //     const showAnim = gsap.from(".main-tool-bar", {
    //         yPercent: -100,
    //         paused: true,
    //         duration: 0.2
    //     }).progress(1);


    //     // onUpdate self direction, play a registered .from
    //     ScrollTrigger.create({
    //         start: "top top",
    //         end: "max",
    //         // markers: true,
    //         onUpdate: (self) => {self.direction === -1 ? showAnim.play() : showAnim.reverse()}
    //     })

    //     // version 2: hide only 40px, above not needed
    //     // ScrollTrigger.create({
    //     //   start: 'top -80',
    //     //   end: 99999,
    //     //   toggleClass: {className: 'scrolled', targets: '.main-tool-bar'}
    //     // });


    // },[]);

    useEffect(()=> {
        let prevScrollPos = window.pageYOffset;

        window.addEventListener('scroll', function() {
          // current scroll position
          const currentScrollPos = window.pageYOffset;
        
          if (prevScrollPos > currentScrollPos) {
            // user has scrolled up
            document.querySelector('.main-tool-bar').classList.remove('navShow');
          } else {
            // user has scrolled down
            document.querySelector('.main-tool-bar').classList.add('navShow');
          }
        
          // update previous scroll position
          prevScrollPos = currentScrollPos;
        });
    },[])




  return (
    <div className="hidden xl:block z-[99] relative">
        <div className='main-tool-bar fixed w-full top-0 h-[120px] md2:h-[75px] bg-[#000000]
        ButtonText'>


            <nav className='relative top-[5rem] md2:top-[1.5rem] w-full flex justify-center'>
                <ul className='max-w[400px] flex flex-row justify-evenly gap-[max(4vw,2rem)]
                '>
                    {
                    nav_links.map((link, index)=> (
                        <li key={"nav_link "+index}>
                            <Link href={link.href}  aria-label={link.aria}
                            className=" ActiveNavLink relative color2 text-sm font-light">{link.text}</Link>
                        </li>
                    ))
                    }
                </ul>

            </nav>

            <div className="absolute right-[1.5rem] top-1/2 -translate-y-1/2">
                    <Link id="nav_main_button" href="#contact">
                        {/* <ColoredButton text={"Contact"}/> */}
                        <Button text={"Contact"} size='base' variant="primary"/>
                    </Link>
            </div>

            <Link href="/">
                <Image src="/Logo/Logo_white.png" alt="company logo 1" 
                className='absolute left-[1.5rem] top-1/2 -translate-y-1/2' width={50} height={25} ></Image>            
            </Link>

            {/* <div className='w-full h-full flex-row flex justify-between items-center
            px-4'>







  
            </div> */}


        
        
        </div>
        {/* <div className="h-[200vh]"> Scrollable Area</div> */}
    </div>
  )
}

export default Page