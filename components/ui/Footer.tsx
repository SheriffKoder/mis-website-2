import { footer_links } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full h-[150px] bg-black border-t border-[#181818]
    flex">
      <nav className="w-full px-[2rem] max-w-[1500px] flex items-center justify-start mx-auto">
      

        

        <ul className='flex flex-row justify-evenly gap-[max(4vw,2rem)]
        text-sm
        '>
            <li>
              <Link href="/">
                <Image src="/Logo/Logo_white.png" alt="company logo 1" 
                className='' width={50} height={25} ></Image>
              </Link>
            </li>
            {
            footer_links.map((link, index)=> (
                <li key={"nav_link "+index}>
                    <Link href={link.href}  aria-label={link.aria}
                    className=" ActiveNavLink relative color2">{link.text}</Link>
                </li>
            ))
            }
        </ul>

      </nav>

    </footer>
  )
}

export default Footer
