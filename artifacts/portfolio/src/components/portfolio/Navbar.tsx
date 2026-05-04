import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Home", "About", "Skills", "Projects", "Experience", "Achievements", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-[200] h-[2px]"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #00E5FF, #8B5CF6)",
          transition: "width 0.1s linear",
        }}
      />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid rgba(0,229,255,0.15)",
          background: "transparent",
        }}
      >
        <span
          className="text-sm font-bold tracking-[0.2em] cursor-pointer select-none"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#00E5FF" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-testid="nav-logo"
        >
          THARUN RAMESH<span className="animate-[blink_1s_step-end_infinite]">|</span>
        </span>

        <button
          className="flex flex-col gap-[5px] p-2 cursor-pointer z-[101]"
          onClick={() => setMenuOpen((v) => !v)}
          data-testid="button-hamburger"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={22} style={{ color: "#00E5FF" }} />
          ) : (
            <Menu size={22} style={{ color: "#00E5FF" }} />
          )}
        </button>
      </nav>

      {/* Full-screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(16px)",
            }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  onClick={() => scrollTo(link)}
                  className="text-2xl font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#00E5FF]"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#B3B3B3",
                  }}
                  data-testid={`link-nav-${link.toLowerCase()}`}
                >
                  {link}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
