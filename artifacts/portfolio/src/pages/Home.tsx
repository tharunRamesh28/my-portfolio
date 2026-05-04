import React, { useEffect, useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Achievements from "@/components/portfolio/Achievements";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import CustomCursor from "@/components/portfolio/CustomCursor";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      
      {/* Signature PCB Background */}
      <div className="fixed inset-0 pointer-events-none pcb-bg z-0" />
      
      <Navbar />
      
      <main className="relative z-10 flex flex-col items-center">
        <Hero />
        <div className="w-full max-w-[1100px] px-6 mx-auto flex flex-col gap-[100px] pb-[100px]">
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <Contact />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
