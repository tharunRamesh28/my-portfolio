import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Bullet = { text: string; highlights?: string[] };

const experiences: {
  company: string;
  year: string;
  role: string;
  bullets: Bullet[];
}[] = [
  {
    company: "Maven Silicon",
    year: "2025",
    role: "VLSI Design Intern",
    bullets: [
      { text: "Designed and implemented RTL for AHB-to-APB bridge using Verilog." },
      { text: "Gained hands-on experience in AMBA bus architecture and SoC design." },
      { text: "Performed RTL verification and debugging." },
      { text: "Applied VLSI design principles in real-time projects." },
      { text: "Collaborated with team on technical solutions." },
    ],
  },
  {
    company: "Unitechplasto Components Pvt Ltd",
    year: "SMT Dept",
    role: "SMT Intern / Production Trainee",
    bullets: [
      {
        text: "Worked in the SMT (Surface Mount Technology) department gaining hands-on production floor experience.",
        highlights: ["SMT"],
      },
      {
        text: "Learned and practiced Selective Soldering techniques on PCB assemblies.",
        highlights: ["Selective Soldering"],
      },
      {
        text: "Performed Manual Soldering for through-hole and surface mount components.",
        highlights: ["Manual Soldering"],
      },
      {
        text: "Conducted PCB Testing using ICT (In-Circuit Testing) to verify board functionality and detect defects.",
        highlights: ["ICT"],
      },
      {
        text: "Gained practical understanding of SMT production workflow, quality checks, and component handling.",
        highlights: ["SMT"],
      },
    ],
  },
  {
    company: "IoT Developer",
    year: "Independent",
    role: "IoT & Embedded Systems",
    bullets: [
      { text: "Developed IoT-based systems using sensors." },
      { text: "Integrated ESP32 with Firebase for real-time data sync." },
      { text: "Designed a web dashboard to monitor sensor data." },
      { text: "Won international-level Protothon/Hackathon." },
      { text: "Active IEEE member; coordinated multiple technical events." },
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref}>
      <h2
        className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
        style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
        data-testid="heading-experience"
      >
        <span className="inline-block pb-2" style={{ borderBottom: "2px solid #00E5FF" }}>
          Experience
        </span>
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, #00E5FF, #8B5CF6, transparent)" }}
        />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="pl-12 relative"
            >
              {/* Dot */}
              <div
                className="absolute left-[9px] top-2 w-4 h-4 rounded-full"
                style={{
                  background: "#000",
                  border: "2px solid #00E5FF",
                  boxShadow: "0 0 10px #00E5FF",
                }}
              />

              <div className="glass-card rounded-lg p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{ fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF" }}
                      data-testid={`text-exp-company-${i}`}
                    >
                      {exp.company}
                    </h3>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#00E5FF", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {exp.role}
                    </p>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-sm"
                    style={{
                      background: "rgba(0,229,255,0.1)",
                      border: "1px solid rgba(0,229,255,0.3)",
                      color: "#00E5FF",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {exp.year}
                  </span>
                </div>

                <ul className="flex flex-col gap-2">
                  {exp.bullets.map((b, bi) => {
                    let rendered: React.ReactNode = b.text;
                    if (b.highlights?.length) {
                      const parts = b.text.split(
                        new RegExp(`(${b.highlights.join("|")})`, "g")
                      );
                      rendered = parts.map((part, pi) =>
                        b.highlights!.includes(part) ? (
                          <span
                            key={pi}
                            className="inline-block px-1.5 py-0 mx-0.5 rounded-sm text-[10px] align-middle"
                            style={{
                              background: "rgba(0,229,255,0.12)",
                              border: "1px solid rgba(0,229,255,0.35)",
                              color: "#00E5FF",
                            }}
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={pi}>{part}</span>
                        )
                      );
                    }
                    return (
                      <li
                        key={bi}
                        className="text-xs flex gap-2 items-baseline"
                        style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        <span style={{ color: "#00E5FF", flexShrink: 0 }}>›</span>
                        <span>{rendered}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
