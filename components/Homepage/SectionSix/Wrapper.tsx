"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { easeOut } from "framer-motion";
import { WebsiteHeaders } from "@/constants";
import Form from "./Form";
import ScrollFillText from "./ScrollFillText/page";

import TicktokSVG from "./SVG/TickTokSVG";
import LinkedInSVG from "./SVG/LinkedInSVG";
import InstagramSVG from "./SVG/InstagramSVG";
import YoutubeSVG from "./SVG/YoutubeSVG";

const ContactUs = () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  useGSAP(() => {
    gsap.to("#sectionSix_header", {
      scrollTrigger: {
        trigger: "#contact",
        // scrub: true,
        start: "top 60%",
        end: "10% 50%",
        // markers: false,
      },
      x: 0, //normal value
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: easeOut,
    });

    gsap.to("#sectionSix_element", {
      scrollTrigger: {
        trigger: "#contact",
        // scrub: true,
        start: "top 60%",
        end: "10% 50%",
        // markers: false,
      },
      x: 0, //normal value
      opacity: 1,
      duration: 1,
      delay: 1,
      ease: easeOut,
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

    const socialIcons = gsap.utils.toArray(".socialIcon");

    gsap.to(socialIcons, {
      scrollTrigger: {
        trigger: "#contact",
        // scrub: true,
        start: "top 60%",
        end: "10% 50%",
        // markers: true,
      },
      scale: 1, //normal value
      // x:0,
      opacity: 1,
      duration: 1,
      delay: 0,
      ease: easeOut,
      stagger: -0.2, // delay between elements
    });
  }, []);

  return (
    <section id="contact"
      className="w-[80vw] xl:max-w-[1100px] flex flex-col lg:flex-row items-center justify-center
      gap-[3rem] xl:gap-[1rem] mb-[5rem]">
      <div className="w-full lg:w-[50%] lg:order-2 lg:mb-auto lg:flex gap-[2rem] flex-col lg:justify-start">
        <div className="text-center h-full lg:h-auto">
          <span
            className=" translate-x-[10rem] opacity-0"
            id="sectionSix_header"
          >
            <ScrollFillText text={["LET'S TALK"]} />
          </span>
        </div>

        <div className="xl:mt-[-2rem] w-full visible flex flex-row items-center justify-center">
          {/* {
          sectionSix_socials.map((social)=> (
            <div className="socialIcon w-[2rem] h-[2rem] rounded-full border flex items-center justify-center
            scale-0 opacity-0" key={social.name+" sm"}>Hi</div>
          ))
        } */}
          <a
            href="https://www.tiktok.com/@misolutions.ai"
            className="socialIcon relative cursor-pointer h-[5rem] aspect-square flex flex-col items-center justify-center group"
          >
            <TicktokSVG />
            <span className="text-center text-xs opacity-50 absolute bottom-0 font-light">Tiktok</span>
          </a>

          <a
            href="https://www.linkedin.com/company/modern-intelligence-solutions/?viewAsMember=true"
            className="socialIcon relative cursor-pointer h-[5rem] aspect-square flex flex-col items-center justify-center group"
          >
            <LinkedInSVG />
            <span className="text-center text-xs opacity-50 absolute bottom-0 font-light">LinkedIn</span>
          </a>

          <a
            href="https://www.instagram.com/misolutions.ai"
            className="socialIcon relative cursor-pointer h-[5rem] aspect-square flex flex-col items-center justify-center group"
          >
            <InstagramSVG />
            <span className="text-center text-xs opacity-50 absolute bottom-0 font-light">Instagram</span>
          </a>

          <a
            href="https://www.youtube.com/@misolutions.ai"
            className="socialIcon relative cursor-pointer h-[5rem] aspect-square flex flex-col items-center justify-center group"
          >
              <YoutubeSVG />
              <span className="text-center text-xs opacity-50 absolute bottom-0 font-light">Youtube</span>
          </a>
        </div>
      </div>

      <div className="lg:order-2 lg:w-[50%] w-full h-full bg-[#0a0a0a42] border border-[#252525] rounded-[10px] py-[2rem]
      translate-x-[-10rem] opacity-0 max-w-[600px] lg:max-w-[800px]"
        id="sectionSix_element"
      >
        <h3 className="Heading3 text-center my-[1rem]">
          {WebsiteHeaders.contact.header}
        </h3>
        <Form />
      </div>
    </section>
  );
};

export default ContactUs;
