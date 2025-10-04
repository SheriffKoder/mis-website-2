'use client'
import { nav_links } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const MobileNavBar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setIsOpen(!isOpen);
    }
    
    useEffect(()=> {

        let prevScrollPos = window.pageYOffset;

        window.addEventListener('scroll', function() {
          // current scroll position
          const currentScrollPos = window.pageYOffset;
        
          if (prevScrollPos > currentScrollPos) {
            // user has scrolled up
            document.querySelector('.mobile-nav-bar')?.classList.remove('navShow');
          } else {
            // user has scrolled down
            document.querySelector('.mobile-nav-bar')?.classList.add('navShow');
          }
        
          // update previous scroll position
          prevScrollPos = currentScrollPos;
        });
    },[])

    
  return (
    <div className='mobile-nav-bar xl:hidden fixed w-full top-0 h-[50px] bg-[#000000] max-w-[100vw]
    flex flex-row justify-between items-center px-[10%] z-[99] transition-all duration-700 ease'>
      
        <Link href="/">
                <Image src="/Logo/Logo_white.png" alt="company logo 1" 
                className='absolute left-[1.5rem] top-[1rem] my-auto z-[99]' width={50} height={25} ></Image>            
        </Link>

        <div className='absolute right-[1.5rem] top-[1.1rem] my-auto z-[90]'>
            {/* Circle background that grows */}
            <div className={`absolute top-1/3 right-1/2 -translate-y-1/2 translate-x-1/2 bg-black/70 backdrop-blur-md border-4
            transition-all duration-500 ease-in-out ${isOpen ? 'w-[max(250vh,250vw)] h-[max(250vh,250vw)] rounded-full border-accent' : 'w-[40px] h-[40px] rounded-md border-transparent'}`}></div>
            
            {/* Hamburger button */}
            <div className='relative z-[101] group' onClick={handleClick}>
                <button className="flex flex-col justify-center items-center">
                    <span className={`bg-white group-hover:bg-[#17D9FF] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-2' : '-translate-y-0.5'}`}></span>
                    <span className={`bg-white group-hover:bg-[#17D9FF] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-1 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`bg-white group-hover:bg-[#17D9FF] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-1 ${isOpen ? '-rotate-45 -translate-y-2' : '-translate-y-0.5'}`}></span>
                </button>
            </div>
        </div>

        {/* Navigation menu */}
        <div className={`absolute top-[50px] right-0 w-full h-screen pointer-events-none z-[99]
        transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}>
            <ul className='flex flex-col gap-4 items-end justify-center pt-[60px] pr-[2rem]'>
                {
                nav_links.map((link, index)=> (
                    <li key={"nav_link "+index}>
                        <Link href={link.href} aria-label={link.aria} onClick={()=>setIsOpen(false)}
                        className="text-white text-2xl font-bold hover:text-[#17D9FF] transition-all duration-300 ease-out">{link.text}</Link>
                    </li>
                ))
                }
            </ul>
        </div>
    </div>
  )
}

export default MobileNavBar
