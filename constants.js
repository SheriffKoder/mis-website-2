////////////////////////////////////////////////////////////////////////////////
// Nav and Footer Links
////////////////////////////////////////////////////////////////////////////////

const nav_links = [
  { text: "Services", href: "#about", aria: "know more about the services we offer" },
  // { text: "Measures", href: "#measures", aria: "our achievements"},
  { text: "How it works", href: "#steps", aria: "our action plan" },
  { text: "Testimonials", href: "#testimonials", aria: "what our clients says about us" },
]

const footer_links = [
  { text: "Services", href: "#about", aria: "know more about the services we offer" },
  // { text: "Measures", href: "#measures", aria: "our achievements"},
  { text: "How it works", href: "#steps", aria: "our action plan" },
  { text: "Testimonials", href: "#testimonials", aria: "what our clients says about us" },
]

const sectionSix_socials = [
  {
    name: "linkedin",
  },
  {
    name: "instagram",
  },
  {
    name: "tiktok",
  },
  {
    name: "youtube",
  },
]

////////////////////////////////////////////////////////////////////////////////
// Website Headers
////////////////////////////////////////////////////////////////////////////////

const WebsiteHeaders = {

  hero: {
    header: ``,
    paragraph: `Transform ideas into reality with innovation and automation. Our AI solutions save time, streamline operations, and elevate your business. Discover how MIS helps you achieve more with less.`,
    button1: `Get started`,
    button2: `Explore all services`
  },
  about: {
    header: `Got you covered`,
    paragraph: `We are a team of experts dedicated to innovation in many fields.
          We believe in the limitless potential of technology to simplify lives and amplify success.
          Our aim is to empower businesses to optimize their workflows and focus on what truly matters. 
          Basically if you can imagine it, 
          we can make it a reality.`
  },
  numbers: {
    header: `Numbers speak`,
    paragraph: `With every project we complete we bring more knowledge and experience to the next.`
  },
  steps: {
    header: `With you step by step`,
    paragraph: `Our approach is simple, yet effective. We break down your challenges into manageable steps, combining cutting-edge technology and tailored solutions to achieve your goals. Here is a glimpse into our streamlined process.`
  },
  contact: {
    header: `Contact us`,
    paragraph: `Let's talk`
  },

}

////////////////////////////////////////////////////////////////////////////////
// Card Content
////////////////////////////////////////////////////////////////////////////////

const brandLogos = [
  {
    name: "Modern Car Rentals",
    src: "/images/brand-logos/modern-car-rentals.png",
  },
  {
    name: "Modern Staffing",
    src: "/images/brand-logos/modern-staffing.png",
  },
  {
    name: "Modern Stay",
    src: "/images/brand-logos/modern-stay.png",
  },
  {
    name: "ERC Guaranteed",
    src: "/images/brand-logos/erc-guaranteed.png",
  },
  {
    name: "Fulton Imports",
    src: "/images/brand-logos/fulton-imports.png",
  },
  {
    name: "Good Books",
    src: "/images/brand-logos/good-books.png",
  },
  {
    name: "Japan Awaits",
    src: "/images/brand-logos/japan-awaits.png",
  },
  {
    name: "Premier Risk Management",
    src: "/images/brand-logos/premier-risk-management.png",
  },
  {
    name: "Prism Wealth Management",
    src: "/images/brand-logos/prism-wealth-management.png",
  },
]

const section_about_cardsContent = [
  {
    title: "Automation and analytics",
    description: "Powerful automation tools and data analytics to streamline operations saving time and reducing costs for increased productivity and business management.",
    fileName: "chart-model",
    color: "rgba(0,40,60,255)",
    color_hover: "rgba(0,60,80,255)",
    rotationSpeed: 0.002
  },
  {
    title: "Web Development",
    description: "From UI/UX design to full-stack development, we deliver high-quality, aesthetically pleasing and efficient web solutions that drive business growth for any industry.",
    color: "rgba(34,23,55,255)",
    color_hover: "rgba(64,46,110,255)",
    fileName: "computer-model",
    rotationSpeed: 0.0025
  },
  {
    title: "Social Media Management",
    description: "Professional and modern content creation, post-production, and visual storytelling, we help brands amplify their presence through impactful visuals.",
    color: "rgba(34,23,55,255)",
    color_hover: "rgba(64,46,110,255)",
    fileName: "camera-model",
    rotationSpeed: 0.0015
  },

  {
    title: "Accounting",
    description: "Our preparation of financial reports and electronic invoices, analyzing financial data, submitting tax returns simplifies processes and facilitates informed decision-making.",
    color: "rgba(0,40,60,255)",
    color_hover: "rgba(0,60,80,255)",
    fileName: "money-model",
    rotationSpeed: 0.0023
  }
]

const section_about_cardsContent_old = [
  {
    name: "Web Development",
    content: "Creating visually stunning and functionally robust websites tailored to your business needs",
  },
  {
    name: "Automation",
    content: "Streamlining repetitive tasks to save time and reduce costs through intelligent automation solutions.",
  },
  {
    name: "Social Media Management",
    content: "Enhancing your brand's online presence with curated content and strategic campaigns.",
  },
  {
    name: "Accounting",
    content: "Simplifying financial management with accurate and efficient tools.",
  },
  {
    name: "Video Editing",
    content: "Crafting engaging video content that captivates audiences and tells your story.",
  },
  {
    name: "AI Solutions",
    content: "Harnessing the power of artificial intelligence to revolutionize your processes and decision-making.",
  },
  {
    name: "UI/UX Design",
    content: "Designing intuitive and user-friendly interfaces that enhance customer experiences.",
  },

]

const section_numbers_cardsContent = [
  {
    name: "Projects",
    content: "Completed",
    number: 1000
  },
  {
    name: "Clients",
    content: "Trusted by",
    number: 300
  },
  {
    name: "Experience",
    content: "Years of",
    number: 10,
  }
]

const section_steps_cardsContent = [
  {
    name: "Discover",
    content: "Our journey begins with a conversation. Share your challenges, goals, and vision, and we'll work with you to define the problem and outline the desired outcomes.",
    number: 1
  },
  {
    name: "Strategize",
    content: "We craft a tailored action plan, combining cutting-edge technologies and innovative strategies to deliver the best possible solution for your needs.",
    number: 2
  },
  {
    name: "Build",
    content: "Our team designs and develops your solution with precision, ensuring quality and scalability at every stage, while keeping you updated throughout the process.",
    number: 3
  },
  {
    name: "Deliver and Support",
    content: "We deploy your solution and ensure it integrates seamlessly into your operations. Beyond delivery, we provide ongoing support and optimizations to guarantee success.",
    number: 4
  }
];

const section_testimonials_cardsContent = [
  {
    name: "Vicky T.",
    company: "Japan Awaits",
    comment: "Amazing to work with from start to finish. Always professional, prompt and patient. The automations they put in place has helped our team save a lot of time from having to manually type in info ourselves (which normally led to a lot of human error). Now, all the data is inputted properly and we don't have to worry about these problems arising again.",
    services: ["Automation", "Web Development"]
  },
  {
    name: "Kyle H.",
    company: "Good Books",
    comment: "Lot's of candidates passed on my job because it was too complicated, I think. Not MI Soloutions. They are an absolute force. Kind and humble, yet very intelligent and excellent at their craft. I can't envision a situation that you would be disappointed with them.",
    services: ["Automation", "Web Development"]
  },
  {
    name: "Sarah T.",
    company: "TechWave",
    comment: "MI Soloutions completely transformed how we handle data and decision-making. Their AI-driven tools allowed us to automate repetitive tasks, saving us hours every week and enabling our team to focus on strategic goals.",
    services: ["Automation", "AI Solutions"]
  },
  {
    name: "Mark L.",
    company: "GrowthEdge Inc.",
    comment: "The insights provided by MI Soloutions's team were game-changing for our business. We were able to identify key market trends and adjust our strategies in real time, leading to a 25% increase in revenue within six months.",
    services: ["Data Analytics", "AI Insights"]
  },
  {
    name: "Emily R.",
    company: "InnovateHub",
    comment: "What I loved most about MI Soloutions was how seamlessly their AI solutions integrated into our existing workflows. The team was incredibly supportive, and the onboarding process was smooth and efficient.",
    services: ["Workflow Integration", "AI Solutions"]
  },
  {
    name: "James K.",
    company: "ScaleUp Solutions",
    comment: "MI Soloutions helped us scale our operations effortlessly. Their adaptive AI tools ensured we could handle increased demand without compromising on quality or efficiency. Highly recommend for any growing business!",
    services: ["AI Solutions", "Automation"]
  },
  {
    name: "Lisa M.",
    company: "BrightPath Ventures",
    comment: "The MI Soloutions team went above and beyond to ensure our success. Their expertise in AI and data analytics was evident in every interaction, and their platform delivered results beyond our expectations.",
    services: ["Data Analytics", "AI Consulting"]
  },
  {
    name: "David S.",
    company: "Visionary Group",
    comment: "Using MI Soloutions, we gained unparalleled clarity in our decision-making process. The platform's AI models provided actionable insights that led to smarter, faster decisions for our business.",
    services: ["AI Insights", "Data Analytics"]
  },
]


// to be required/imported into tailwind.config.js
module.exports = {
  nav_links,
  footer_links,
  sectionSix_socials,
  WebsiteHeaders,
  brandLogos,
  section_about_cardsContent,
  section_numbers_cardsContent,
  section_steps_cardsContent,
  section_testimonials_cardsContent,
}

// export {};


