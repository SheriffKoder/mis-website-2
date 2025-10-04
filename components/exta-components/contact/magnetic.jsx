"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function MagneticButton({children}) {
   
    const ref = useRef(null);

    useEffect(() => {
        // Only proceed if ref.current exists
        if (!ref.current) return;
        
        const element = ref.current;
        
        const xTo = gsap.quickTo(element, "x", {duration: 1, ease: "elastic.out(1, 0.3)"})
        const yTo = gsap.quickTo(element, "y", {duration: 1, ease: "elastic.out(1, 0.3)"})

        const mouseMove = (e) => {
            const { clientX, clientY } = e;
            // get the position of the element
            const {height, width, left, top} = element.getBoundingClientRect();
            // get the distance of the mouse from the center of the element
            const x = clientX - (left + width/2)
            const y = clientY - (top + height/2)
            // apply the magnetic effect
            xTo(x)
            yTo(y)
        }

        const mouseLeave = () => {
            // apply the magnetic effect
            xTo(0)
            // apply the hover effect
            yTo(0)
        }

        element.addEventListener("mousemove", mouseMove);
        element.addEventListener("mouseleave", mouseLeave);

        return () => {
            // Check if element still exists before removing event listeners
            if (element) {
                element.removeEventListener("mousemove", mouseMove);
                element.removeEventListener("mouseleave", mouseLeave);
            }
        }
    }, [])

    return (
        <div>
            {React.cloneElement(children, {ref:ref})}
        </div>
    )
}