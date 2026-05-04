import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import profilePhoto from "@assets/WhatsApp_Image_2026-05-04_at_10.07.47_PM_1777912834027.jpeg";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const roles = ["Embedded Systems Engineer", "IoT Developer", "VLSI Enthusiast", "Hackathon Winner"];

function useTypewriter(texts: string[], speed = 80, pause = 1500) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
      } else {
        setDeleting(false);
        setTextIdx((i) => (i + 1) % texts.length);
      }
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return display;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 60;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", handleMouse);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 0.015;
          p.vy += (dy / dist) * 0.015;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.6)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00E5FF";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.15 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

export default function Hero() {
  const typed = useTypewriter(roles);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeUrl = `${import.meta.env.BASE_URL}resume_tharun.pdf`;

  const closeResume = useCallback(() => {
    setResumeOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openResume = useCallback(() => {
    setResumeOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeResume(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeResume]);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20"
    >
      <ParticleCanvas />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[1100px] mx-auto">
        {/* Profile circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          <div
            style={{
              border: "2px solid #00E5FF",
              boxShadow: "0 0 25px #00E5FF, 0 0 50px rgba(0,229,255,0.3)",
              borderRadius: "50%",
              animation: "pulse-ring 3s ease-in-out infinite",
              lineHeight: 0,
            }}
            data-testid="img-avatar"
          >
            <img
              src={profilePhoto}
              alt="Tharun Ramesh"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl font-black tracking-[0.1em] mb-4 text-glow"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF" }}
          data-testid="text-hero-name"
        >
          THARUN RAMESH
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-2xl mb-6 h-8"
          style={{ color: "#00E5FF", fontFamily: "'IBM Plex Mono', monospace" }}
          data-testid="text-hero-role"
        >
          {typed}
          <span className="animate-[blink_0.8s_step-end_infinite]">_</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm md:text-base mb-10 max-w-[600px]"
          style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace" }}
          data-testid="text-hero-tagline"
        >
          Creative ECE student building real-time embedded solutions at the
          intersection of hardware and software.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              border: "1px solid #00E5FF",
              color: "#00E5FF",
              boxShadow: "0 0 0 transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(0,229,255,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 transparent";
            }}
            data-testid="button-view-projects"
          >
            View Projects
          </button>

          <button
            onClick={openResume}
            className="px-7 py-3 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#B3B3B3",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.6)";
              (e.currentTarget as HTMLButtonElement).style.color = "#8B5CF6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
            }}
            data-testid="button-view-resume"
          >
            View Resume
          </button>
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        data-testid="scroll-indicator"
      >
        <span className="text-xs tracking-[0.2em]" style={{ color: "#6B7280" }}>SCROLL</span>
        <ChevronDown size={18} style={{ color: "#00E5FF" }} />
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 25px #00E5FF, 0 0 50px rgba(0,229,255,0.3); }
          50% { box-shadow: 0 0 35px #00E5FF, 0 0 70px rgba(0,229,255,0.5); }
        }
      `}</style>

      {resumeOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeResume(); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(20px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "24px",
          }}
        >
          {/* Inner content — stops backdrop click from closing when clicking inside */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "4px",
                  color: "#00E5FF",
                  textTransform: "uppercase",
                }}
              >
                Resume — Tharun Ramesh
              </span>
              <button
                onClick={closeResume}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,229,255,0.3)",
                  color: "#FFFFFF",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "13px",
                  padding: "8px 20px",
                  cursor: "pointer",
                  letterSpacing: "2px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,229,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,229,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
                data-testid="button-close-resume"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* PDF Embed */}
            <iframe
              src={resumeUrl}
              title="Tharun Ramesh Resume"
              style={{
                width: "100%",
                height: "85vh",
                border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: "4px",
                boxShadow: "0 0 40px rgba(0,229,255,0.15)",
                background: "#fff",
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
