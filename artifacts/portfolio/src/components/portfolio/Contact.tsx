import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

function LinkedInIcon({ size = 18, color = "#0A66C2" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7358844091",
    href: "tel:+917358844091",
    hoverColor: "#00E5FF",
    isLinkedIn: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "rameshtharun067@gmail.com",
    href: "mailto:rameshtharun067@gmail.com",
    hoverColor: "#00E5FF",
    isLinkedIn: false,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Chennai, Poonamallee",
    href: null,
    hoverColor: "#00E5FF",
    isLinkedIn: false,
  },
  {
    icon: null,
    label: "LinkedIn",
    value: "Tharun Ramesh",
    href: "https://www.linkedin.com/in/tharun-ramesh25",
    hoverColor: "#0A66C2",
    isLinkedIn: true,
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref}>
      <h2
        className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
        style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
        data-testid="heading-contact"
      >
        <span className="inline-block pb-2" style={{ borderBottom: "2px solid #00E5FF" }}>
          Get In Touch
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {contacts.map((c, i) => {
          const Icon = c.isLinkedIn ? null : c.icon;
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                boxShadow: `0 0 25px ${c.hoverColor}40`,
                borderColor: `${c.hoverColor}60`,
              }}
              className="glass-card rounded-lg p-5 flex items-center gap-4 transition-all duration-300"
              style={{ cursor: c.href ? "pointer" : "default" }}
              data-testid={`card-contact-${c.label.toLowerCase()}`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${c.hoverColor}15`,
                  border: `1px solid ${c.hoverColor}40`,
                }}
              >
                {c.isLinkedIn ? (
                  <LinkedInIcon size={18} color={c.hoverColor} />
                ) : (
                  Icon && <Icon size={18} style={{ color: c.hoverColor }} />
                )}
              </div>
              <div className="overflow-hidden">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: "#6B7280", fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {c.label}
                </p>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "#FFFFFF", fontFamily: "'IBM Plex Mono', monospace" }}
                  data-testid={`text-contact-${c.label.toLowerCase()}`}
                >
                  {c.value}
                </p>
              </div>
            </motion.div>
          );

          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              {...(c.isLinkedIn ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block no-underline"
            >
              {content}
            </a>
          ) : (
            <div key={c.label}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
