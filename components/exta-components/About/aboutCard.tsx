import React from 'react'
import ModelBoxTheedimentional from '@/components/exta-components/three-dimensional/model-box-theedimentional';
// import GradientCornerBorder from '@/components/exta-components/About/GradientCornerBorderCard';

interface card {
    title: string;
    description: string;
    fileName: string;
    rotationSpeed: number;
    color: string;
    color_hover: string;
}
interface AboutCardProps {
    card: card;
    index: number;
    section_about_cardsContent: card[];
}

const AboutCard: React.FC<AboutCardProps> = ({
    card,
    index,
    section_about_cardsContent,
}) => {
  return (
    <div 
    key={index} 
    className={`h-[450px] md:h-[400px] rounded-lg bg-[rgba(58,58,58,0.1)] relative
      cursor-pointer group
      ${(section_about_cardsContent.length % 2 !== 0 && index === section_about_cardsContent.length - 1 && window.innerWidth >= 768) ? 'lg:col-span-2 w-full' : ''}`}
    >
        {/* ////// Noise overlay ////// */}
        <div 
        className="absolute inset-0 pointer-events-none opacity-[0.12]" 
        style={{
            backgroundImage: `url('/card_grain.svg')`,
            backgroundSize: 'cover',
            // mixBlendMode: 'soft-light'
        }}
        ></div>

        {/* ////// Gradient corner border ////// */}
        <div className='absolute top-[0px] left-[0px] h-[100%] w-[100%] opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out z-[-1]'>

            <div className='absolute top-[0px] left-[0px] w-full h-full rounded-lg
            border'
            style={{
            borderColor: card.color_hover,
            }}></div>

            <div className='absolute top-[0px] left-[0px] w-full h-full rounded-lg'
            style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(7,16,31,1) 40%)',
            }}
            >

            </div>
        </div>
        {/* <GradientCornerBorder 
        color1={card.color_hover} 
        color2={card.color_hover} 
        color3={card.color_hover} 
        color4={card.color_hover}
        animate={false}
        animateSpeed={2}
        borderRadius={8}
        // size={}
        borderWidth={2}
        backgroundColor={'rgba(7,16,31,1)'}
        zIndex={-1}
        /> */}

        {/* ////// Main content ////// */}
        {/* items with radial background separated from the card background */}
        <div className='h-full flex flex-col z-10' style={{
        background: `radial-gradient(circle, ${card.color} 0%, rgba(255,255,255,0) 60%)`,
        }}>
            <h3 className='Paragraph2 px-4 py-4' style={{fontWeight: 500}}>{card.title}</h3>
            
            <div className='flex-1 flex justify-center items-center brightness-[0.2]'>
                <ModelBoxTheedimentional fileName={card.fileName} rotationSpeedProp={card.rotationSpeed}/>
            </div>

            <p className='Paragraph2 px-4 py-4 opacity-50 group-hover:opacity-100 transition-all duration-1000 ease-in-out z-10' style={{fontWeight: 400}}>{card.description}</p>
            
        </div>
  </div>
  )
}

export default AboutCard