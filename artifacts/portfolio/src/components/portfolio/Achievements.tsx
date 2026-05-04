import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Winner",
    subtitle: "International Protothon",
    color: "#FFD700",
  },
  {
    icon: Trophy,
    title: "Winner",
    subtitle: "Hackathon",
    color: "#FFD700",
  },
  {
    icon: Medal,
    title: "Best Capstone",
    subtitle: "Project Award",
    color: "#FFD700",
  },
];

export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="achievements" ref={ref}>
      <h2
        className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
        style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
        data-testid="heading-achievements"
      >
        <span className="inline-block pb-2" style={{ borderBottom: "2px solid #00E5FF" }}>
          Achievements
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.subtitle}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{
                scale: 1.04,
                boxShadow: `0 12px 40px rgba(255,215,0,0.2)`,
              }}
              className="glass-card rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300 cursor-default"
              data-testid={`card-achievement-${i}`}
            >
              <div
                className="mb-4 p-3 rounded-full"
                style={{
                  background: "rgba(255,215,0,0.1)",
                  border: "1px solid rgba(255,215,0,0.3)",
                }}
              >
                <Icon
                  size={32}
                  style={{ color: a.color, filter: `drop-shadow(0 0 8px ${a.color})` }}
                />
              </div>
              <h3
                className="text-sm font-bold mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF" }}
                data-testid={`text-achievement-title-${i}`}
              >
                {a.title}
              </h3>
              <p
                className="text-xs"
                style={{ color: "#B3B3B3", fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {a.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
