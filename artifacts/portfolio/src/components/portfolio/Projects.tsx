import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const projects = [
  {
    title: "Smart IV Drip Monitoring System",
    desc: "Developed a system to monitor IV fluid level using sensors. Implemented alert mechanism for low fluid condition.",
    tags: ["ESP32", "IoT", "Sensors"],
  },
  {
    title: "Smart Air Quality Monitoring System",
    desc: "Built a system to detect air pollutants using MQ sensors. Enabled real-time monitoring using IoT.",
    tags: ["MQ Sensors", "Firebase", "IoT"],
  },
  {
    title: "ECG-Based Authentication System",
    desc: "Designed a system to identify users based on ECG signals. Applied basic signal processing concepts.",
    tags: ["Signal Processing", "Python", "ECG"],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref}>
      <h2
        className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
        style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
        data-testid="heading-projects"
      >
        <span className="inline-block pb-2" style={{ borderBottom: "2px solid #00E5FF" }}>
          Projects
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,229,255,0.25)" }}
            className="glass-card rounded-lg p-5 md:p-6 relative overflow-hidden transition-all duration-300 cursor-default"
            data-testid={`card-project-${i}`}
          >
            {/* Top-left accent */}
            <div
              className="absolute top-0 left-0 w-12 h-[2px]"
              style={{ background: "#00E5FF" }}
            />
            <div
              className="absolute top-0 left-0 w-[2px] h-12"
              style={{ background: "#00E5FF" }}
            />

            <h3
              className="text-sm font-bold mb-3 leading-snug"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "#FFFFFF",
                lineHeight: "1.5",
              }}
              data-testid={`text-project-title-${i}`}
            >
              {proj.title}
            </h3>
            <p
              className="text-xs leading-relaxed mb-5"
              style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {proj.desc}
            </p>

            <div className="flex flex-wrap gap-2">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[10px] rounded-sm"
                  style={{
                    background: "rgba(0,229,255,0.1)",
                    border: "1px solid rgba(0,229,255,0.3)",
                    color: "#00E5FF",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
