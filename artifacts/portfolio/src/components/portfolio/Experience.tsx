import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const experiences = [
  {
    company: "Maven Silicon",
    year: "2025",
    role: "VLSI Design Intern",
    bullets: [
      "Designed and implemented RTL for AHB-to-APB bridge using Verilog.",
      "Gained hands-on experience in AMBA bus architecture and SoC design.",
      "Performed RTL verification and debugging.",
      "Applied VLSI design principles in real-time projects.",
      "Collaborated with team on technical solutions.",
    ],
  },
  {
    company: "IoT Developer",
    year: "Independent",
    role: "IoT & Embedded Systems",
    bullets: [
      "Developed IoT-based systems using sensors.",
      "Integrated ESP32 with Firebase for real-time data sync.",
      "Designed a web dashboard to monitor sensor data.",
      "Won international-level Protothon/Hackathon.",
      "Active IEEE member; coordinated multiple technical events.",
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
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.5 }}
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

              <div className="glass-card rounded-lg p-6">
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
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-xs flex gap-2"
                      style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      <span style={{ color: "#00E5FF", flexShrink: 0 }}>›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
