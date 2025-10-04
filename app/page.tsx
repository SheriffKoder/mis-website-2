import AboutWrapper from '@/components/Homepage/About/Wrapper'
import HeroWrapper from '@/components/Homepage/Hero/Wrapper'
import StepsSection from '@/components/Homepage/Steps/Wrapper'
import NumbersWrapper from '@/components/Homepage/Numbers/Wrapper'
import Testimonials from '@/components/Homepage/Testimonials/Wrapper'
import ContactUs from '@/components/Homepage/SectionSix/Wrapper'
import RobotNew from '@/components/exta-components/three-dimensional/RobotNew'
import VaporWave from '@/components/exta-components/three-dimensional/VaporWave'
import Footer from '@/components/ui/Footer'
import ChatbotContainer from '@/components/chatbot-gemini/chatbot-container'



const page = () => {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center max-w-[1800px] mx-auto'>

      <div className="w-full h-full absolute top-0 left-0 z-[-2] opacity-50 overflow-hidden vaporWave"
        id="#vaporWave">
        <VaporWave />
      </div>

      <RobotNew />

      <HeroWrapper />

      <AboutWrapper />

      <NumbersWrapper />

      {/* Radial gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      
      <StepsSection />

      <div className='w-full relative'>
        <Testimonials />
        {/* Radial gradient background */}
        <div className="min-h-[2000px] absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      </div>

      <ContactUs />

      <Footer />

      <ChatbotContainer />
    </div>
  )
}

export default page
