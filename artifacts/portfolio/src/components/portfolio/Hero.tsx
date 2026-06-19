import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════
   ROLES & TYPEWRITER
   ═══════════════════════════════════════════ */
const roles = [
  "Embedded Systems Engineer",
  "IoT Developer",
  "Firmware Developer",
  "VLSI Enthusiast",
];

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

/* ═══════════════════════════════════════════
   PARTICLE CANVAS — full-screen starfield
   ═══════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 70;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.8,
    }));

    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
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
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
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
        ctx.fillStyle = "rgba(0,229,255,0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00E5FF";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 110)})`;
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

  return createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />,
    document.body
  );
}

/* ═══════════════════════════════════════════
   HERO COMPONENT
   ═══════════════════════════════════════════ */
export default function Hero() {
  const typed = useTypewriter(roles);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeUrl = `${import.meta.env.BASE_URL}resume_tharun.pdf`;

  /* ═══ VIDEO PLAYBACK STATE ═══ */
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<'playing' | 'paused' | 'ended'>('playing');
  const [videoFade, setVideoFade] = useState(1); // 1 = fully visible

  const handlePlay = useCallback(() => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
    setVideoState('playing');
  }, []);

  const handlePause = useCallback(() => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    vid.pause();
    setVideoState('paused');
  }, []);

  const handleReplay = useCallback(() => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    // Fade out, reset, fade in
    setVideoFade(0.8);
    vid.currentTime = 0;
    vid.play().catch(() => {});
    setVideoState('playing');
    setTimeout(() => setVideoFade(1), 50);
  }, []);

  const handleVideoEnded = useCallback(() => {
    const vid = heroVideoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.pause();
    }
    setVideoState('ended');
  }, []);

  /* ═══ SCROLL-LINKED ANIMATIONS ═══ */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Video: fades 1 → 0.15, parallax moves slower
  const videoOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.4, 0.15]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Content: fades 1 → 0, parallax moves faster
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 250]);

  // Dark overlay: 0 → 0.85
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0.85]);

  // Particles fade
  const particleOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.7, 0.3, 0.05]);

  /* — Mouse-follow glow — */
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setGlowPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  /* — Resume modal — */
  const closeResume = useCallback(() => {
    setResumeOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openResume = useCallback(() => {
    setResumeOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeResume();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeResume]);

  /* — Global video reset — */
  useEffect(() => {
    (window as any).resetHeroVideo = handleReplay;
    return () => { delete (window as any).resetHeroVideo; };
  }, [handleReplay]);

  return (
    <section id="home" ref={heroRef} className="hero-section">
      {/* Particle canvas with scroll-linked opacity */}
      <motion.div style={{ opacity: particleOpacity }} className="hero-particle-wrap">
        <ParticleCanvas />
      </motion.div>

      {/* Mouse-follow ambient glow */}
      <div
        className="hero-mouse-glow"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,229,255,0.06) 0%, transparent 55%)`,
        }}
      />

      {/* ═══ LEFT: FULL-BLEED VIDEO PANEL ═══ */}
      <motion.div
        className="hero-video-panel"
        style={{ opacity: videoOpacity, y: videoY }}
      >
        <video
          ref={heroVideoRef}
          id="hero-video"
          className="hero-video"
          src="intro/Video Project 6.mp4"
          autoPlay
          muted
          playsInline
          loop={false}
          onEnded={handleVideoEnded}
          style={{ opacity: videoFade, transition: 'opacity 0.5s ease' }}
        />
        {/* Subtle cyan ambient light on top */}
        <div className="video-ambient-top" />
        {/* Dark gradient at bottom */}
        <div className="video-ambient-bottom" />

        {/* ═══ FLOATING VIDEO CONTROLS ═══ */}
        <div className="video-controls">
          {/* While playing: Show Pause button */}
          {videoState === 'playing' && (
            <button className="vc-btn vc-pill" onClick={handlePause} aria-label="Pause" title="Pause">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style={{ marginRight: '8px' }}>
                <rect x="5" y="3" width="4" height="18" />
                <rect x="15" y="3" width="4" height="18" />
              </svg>
              Pause
            </button>
          )}

          {/* While paused or ended: Show Continue button */}
          {(videoState === 'paused' || videoState === 'ended') && (
            <button className="vc-btn vc-pill vc-glow" onClick={handlePlay} aria-label="Continue" title="Continue">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style={{ marginRight: '8px' }}>
                <polygon points="6,3 20,12 6,21" />
              </svg>
              Continue
            </button>
          )}

          {/* Optional: Show Replay button after video completion */}
          {videoState === 'ended' && (
            <button className="vc-btn vc-pill" onClick={handleReplay} aria-label="Replay" title="Replay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" style={{ marginRight: '8px' }}>
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay
            </button>
          )}
        </div>
      </motion.div>

      {/* ═══ SCROLL DARK OVERLAY ═══ */}
      <motion.div className="hero-dark-overlay" style={{ opacity: overlayOpacity }} />

      {/* ═══ BOTTOM GRADIENT — dissolves hero into next section ═══ */}
      <div className="hero-bottom-gradient" />

      {/* ═══ RIGHT: CONTENT ═══ */}
      <motion.div className="hero-content" style={{ opacity: contentOpacity, y: contentY }}>
        {/* Label */}
        <motion.p
          className="hero-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          ECE Student · Chennai, India
        </motion.p>

        {/* Name */}
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          data-testid="text-hero-name"
        >
          THARUN<br />RAMESH
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          data-testid="text-hero-role"
        >
          {typed}<span className="hero-cursor">_</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          className="hero-bio"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          data-testid="text-hero-tagline"
        >
          Creative ECE student building real-time embedded solutions at the
          intersection of hardware and software.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-cta-row"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="hero-btn hero-btn-primary"
            data-testid="button-view-projects"
          >
            View Projects
          </button>
          <button
            onClick={openResume}
            className="hero-btn hero-btn-secondary"
            data-testid="button-view-resume"
          >
            View Resume
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        style={{ opacity: contentOpacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        data-testid="scroll-indicator"
      >
        <span>SCROLL</span>
        <ChevronDown size={18} style={{ color: "#00E5FF" }} />
      </motion.div>

      {/* ═══ RESUME MODAL ═══ */}
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

      {/* ═══════════ STYLES ═══════════ */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cinematicBreathe {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.04); }
        }
        @keyframes vcGlow {
          0%,100% { box-shadow: 0 0 8px rgba(0,229,255,0.3); }
          50%     { box-shadow: 0 0 20px rgba(0,229,255,0.6); }
        }
        @keyframes ambientPulse {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 0.6; }
        }

        /* ═══ SECTION ═══ */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .hero-particle-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .hero-mouse-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          transition: background 0.4s ease;
        }

        /* ═══ SCROLL DARK OVERLAY — fades in as user scrolls ═══ */
        .hero-dark-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          z-index: 3;
          pointer-events: none;
        }

        /* ═══ BOTTOM GRADIENT — dissolves hero into About ═══ */
        .hero-bottom-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.4) 50%,
            rgba(0,0,0,0.95) 100%
          );
          z-index: 4;
          pointer-events: none;
        }

        /* ═══ LEFT — FULL-BLEED VIDEO ═══ */
        .hero-video-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 55vw;
          height: 100vh;
          z-index: 2;
          overflow: hidden;
          will-change: transform, opacity;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          background: #000;

          /* RIGHT-SIDE FADE */
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) 55%,
            rgba(0,0,0,0) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) 55%,
            rgba(0,0,0,0) 100%
          );

          /* Cinematic breathing zoom */
          animation: cinematicBreathe 12s ease-in-out infinite;
          transform-origin: center center;
        }

        /* Ambient light bleed — top edge */
        .video-ambient-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          background: linear-gradient(180deg,
            rgba(0,229,255,0.05) 0%,
            transparent 100%);
          pointer-events: none;
          z-index: 3;
          animation: ambientPulse 6s ease-in-out infinite;
        }

        /* Ambient light bleed — bottom edge */
        .video-ambient-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 200px;
          background: linear-gradient(0deg,
            rgba(0,0,0,0.8) 0%,
            transparent 100%);
          pointer-events: none;
          z-index: 3;
        }

        /* ═══ RIGHT — CONTENT ═══ */
        .hero-content {
          position: relative;
          z-index: 5;
          margin-left: 50%;
          padding-left: 60px;
          padding-right: 5vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          will-change: transform, opacity;
        }

        .hero-label {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #00e5ff;
          opacity: 0.5;
          letter-spacing: 3px;
          margin: 0 0 20px 0;
          text-transform: uppercase;
        }

        .hero-name {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.06em;
          line-height: 1.05;
          margin: 0 0 22px 0;
          text-shadow:
            0 0 30px rgba(0,229,255,0.25),
            0 0 80px rgba(0,229,255,0.08);
        }

        .hero-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(1rem, 1.6vw, 1.35rem);
          color: #00E5FF;
          margin-bottom: 22px;
          min-height: 32px;
        }
        .hero-cursor {
          animation: blink 0.8s step-end infinite;
        }

        .hero-bio {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(0.82rem, 1vw, 0.95rem);
          color: #9CA3AF;
          line-height: 1.75;
          max-width: 440px;
          margin: 0 0 34px 0;
        }

        /* ═══ CTA BUTTONS ═══ */
        .hero-cta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-btn {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 34px;
          cursor: pointer;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary {
          background: transparent;
          border: 1px solid #00E5FF;
          color: #00E5FF;
        }
        .hero-btn-primary:hover {
          background: #00E5FF;
          color: #000;
          box-shadow:
            0 0 30px rgba(0,229,255,0.5),
            0 0 60px rgba(0,229,255,0.15);
        }

        .hero-btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #9CA3AF;
        }
        .hero-btn-secondary:hover {
          border-color: rgba(0,229,255,0.5);
          color: #00E5FF;
          box-shadow: 0 0 20px rgba(0,229,255,0.15);
        }

        /* ═══ SCROLL INDICATOR ═══ */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 10;
        }
        .hero-scroll-indicator span {
          font-size: 10px;
          letter-spacing: 3px;
          color: #6B7280;
          font-family: 'Courier New', monospace;
        }

        /* ═══ FLOATING VIDEO CONTROLS ═══ */
        .video-controls {
          position: absolute;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 20;
          pointer-events: auto;
        }

        .vc-btn.vc-pill {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 18px;
          height: auto;
          border-radius: 999px;
          border: 1px solid rgba(0, 229, 255, 0.35);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #00e5ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 0 12px rgba(0, 229, 255, 0.15), inset 0 0 8px rgba(0, 229, 255, 0.05);
        }

        .vc-btn.vc-pill:hover {
          background: rgba(0, 229, 255, 0.2);
          border-color: #00e5ff;
          box-shadow: 0 0 22px rgba(0, 229, 255, 0.5), inset 0 0 12px rgba(0, 229, 255, 0.1);
          transform: translateY(-2px);
        }

        .vc-btn.vc-pill:active {
          transform: translateY(0);
        }

        .vc-btn.vc-pill.vc-glow {
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 8px rgba(0, 229, 255, 0.05);
          animation: vcGlow 2.5s ease-in-out infinite;
        }

        /* ═══ RESPONSIVE — TABLET ═══ */
        @media (max-width: 1024px) {
          .hero-video-panel {
            width: 50vw;
          }
          .hero-content {
            margin-left: 45%;
            padding-left: 40px;
          }
        }

        /* ═══ RESPONSIVE — MOBILE ═══ */
        @media (max-width: 768px) {
          .hero-section {
            height: auto;
            min-height: 100vh;
          }

          .hero-video-panel {
            position: relative;
            width: 100%;
            height: 55vh;
          }

          .hero-video {
            -webkit-mask-image: linear-gradient(
              to bottom,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,1) 60%,
              rgba(0,0,0,0) 100%
            );
            mask-image: linear-gradient(
              to bottom,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,1) 60%,
              rgba(0,0,0,0) 100%
            );
          }

          .hero-content {
            margin-left: 0;
            padding: 0 24px 80px;
            height: auto;
            min-height: 45vh;
            align-items: center;
            text-align: center;
          }

          .hero-name {
            text-align: center;
          }

          .hero-role {
            text-align: center;
            width: 100%;
          }

          .hero-bio {
            text-align: center;
          }

          .hero-cta-row {
            justify-content: center;
          }

          .hero-scroll-indicator {
            bottom: 16px;
          }

          .hero-bottom-gradient {
            height: 30%;
          }

          .video-controls {
            bottom: 16px;
            right: 16px;
          }
        }

        @media (max-width: 480px) {
          .hero-video-panel {
            height: 48vh;
          }
          .hero-btn {
            padding: 12px 24px;
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}
