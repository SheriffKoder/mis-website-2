import type { Metadata } from "next";

import "./globals.css";
import "@/styles/side-scroll-bar.css";

import Navbar from "@/components/ui/Navbar";
import MobileNavBar from "@/components/ui/MobileNavBar";
import SmoothScrollProvider from "@/providers/SmoothScrollContext_lenis";


export const metadata: Metadata = {
  title: "Modern Intelligence Solutions | MIS",
  description: "We provide high-end solutions in web development, automation, data analysis, social media management, and more.",
  keywords: ["web development", "automation", "data analysis", "social media management", "SEO", "web application", "dashboard", "python", "AI"],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Modern Intelligence Solutions | MIS",
    description: "We provide high-end solutions in web development, automation, data analysis, social media management, and more.",
    type: "website",
    url: "https://misolutions.ai",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" className="relative" suppressHydrationWarning>
      <body className="Poppins"
      >
        <SmoothScrollProvider>
          {children}
          <Navbar />
          <MobileNavBar />
        </SmoothScrollProvider>
      </body>
    </html>

  );
}
