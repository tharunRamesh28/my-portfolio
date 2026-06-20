import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skillGroups = [
  {
    label: "Languages",
    color: "#00E5FF",
    skills: ["C", "C++", "Python", "HTML", "CSS", "JavaScript"],
  },
  {
    label: "Hardware",
    color: "#8B5CF6",
    skills: [
      "Embedded Systems (ESP32, Arduino)",
      "IoT & Sensor Integration",
      "Digital Electronics & Analog Fundamentals",
      "VLSI (Basic)",
    ],
  },
  {
    label: "Tools & Design",
    color: "#00E5FF",
    skills: ["FreeCAD", "KiCad (PCB Design)", "Firebase (Realtime DB, Cloud Integration)"],
  },
  {
    label: "Other",
    color: "#8B5CF6",
    skills: ["AI-Powered Web Development"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref}>
      <h2
        className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
        style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
        data-testid="heading-skills"
      >
        <span className="inline-block pb-2" style={{ borderBottom: "2px solid #00E5FF" }}>
          Technical Skills
        </span>
      </h2>

      <div className="flex flex-col gap-8">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: gi * 0.1, duration: 0.5 }}
          >
            <p
              className="text-xs tracking-[0.25em] uppercase mb-4"
              style={{ color: group.color, fontFamily: "'Orbitron', sans-serif" }}
            >
              {group.label}
            </p>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill, si) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: gi * 0.1 + si * 0.05, duration: 0.4 }}
                  whileHover={{
                    boxShadow: `0 0 18px ${group.color}80`,
                    borderColor: group.color,
                  }}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-xs rounded-sm cursor-default select-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${group.color}40`,
                    color: "#FFFFFF",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                  data-testid={`skill-${skill.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
