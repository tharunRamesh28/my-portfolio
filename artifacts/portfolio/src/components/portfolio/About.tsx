import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      id="about"
      ref={ref}
      className="mt-[80px] md:mt-[180px]"
      style={{
        position: "relative",
        zIndex: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2
          className="text-xs tracking-[0.4em] uppercase mb-8 text-center"
          style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
          data-testid="heading-about"
        >
          <span
            className="inline-block pb-2"
            style={{ borderBottom: "2px solid #00E5FF" }}
          >
            About Me
          </span>
        </h2>

        <div
          className="glass-card rounded-lg p-5 md:p-8 relative overflow-hidden"
          style={{
            borderRadius: "8px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Left electric blue accent line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
            style={{ background: "linear-gradient(180deg, #00E5FF, #8B5CF6)" }}
          />

          <p
            className="text-sm md:text-base leading-relaxed pl-4"
            style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace", lineHeight: "1.9" }}
            data-testid="text-about-bio"
          >
            Creative and highly motivated Electronics and Communication Engineering student with a strong interest in Embedded Systems, IoT, and VLSI. Known for innovative thinking and problem-solving ability, with hands-on experience in developing real-time sensor-based projects and participating in international hackathons. Possesses foundational skills in C, C++, and Python, along with knowledge of digital electronics and SoC concepts. Currently seeking internship opportunities to apply technical skills in real-world engineering challenges.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
