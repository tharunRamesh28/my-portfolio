import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

/* ─── Achievement data ──────────────────────────────────────────────────── */
const achievements = [
  {
    icon: Trophy,
    title: "Winner",
    subtitle: "International Protothon",
    color: "#FFD700",
    /* Modal-specific fields */
    hasPhoto: true,
    imgSrc: "/images/protothon.jpg",
    imgId: "proto-img",
    modalTitle: "🏆 Winner — International Protothon",
    modalCaption: "International Protothon — 1st Place",
  },
  {
    icon: Trophy,
    title: "Winner",
    subtitle: "Hackathon",
    color: "#FFD700",
    hasPhoto: true,
    imgSrc: "/images/hackathon.jpg",
    imgId: "hackathon-img",
    modalTitle: "🏆 Winner — Hackathon",
    modalCaption: "Hackathon — 1st Place",
  },
  {
    icon: Medal,
    title: "Best Capstone",
    subtitle: "Project Award",
    color: "#FFD700",
    hasPhoto: false,
    imgSrc: "",
    imgId: "",
    modalTitle: "",
    modalCaption: "",
  },
];

/* ─── Modal component ───────────────────────────────────────────────────── */
interface ModalData {
  imgSrc: string;
  imgId: string;
  title: string;
  caption: string;
}

function AchievementModal({
  data,
  onClose,
}: {
  data: ModalData | null;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  /* Reset error state whenever the image source changes */
  useEffect(() => {
    setImgError(false);
  }, [data?.imgSrc]);

  /* Close on Escape key */
  useEffect(() => {
    if (!data) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [data, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    if (data) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [data]);

  if (!data) return null;

  return (
    <div
      id="achievement-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        id="modal-backdrop"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
      />

      {/* Box */}
      <div
        id="modal-box"
        style={{
          position: "relative",
          zIndex: 1,
          background: "#111",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 12,
          padding: "28px 24px 24px",
          width: 480,
          maxWidth: "92vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          animation: "achievementModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* Close button */}
        <button
          id="modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "none",
            border: "none",
            color: "#555",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
            transition: "color 0.2s",
            padding: "4px 8px",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "#00e5ff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "#555")
          }
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title */}
        <div
          id="modal-title"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {data.title}
        </div>

        {/* Image area */}
        <div
          id="modal-img-wrap"
          style={{
            width: "100%",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(0,229,255,0.13)",
            background: "#1a1a1a",
            minHeight: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!imgError ? (
            <img
              id={data.imgId}
              src={data.imgSrc}
              alt={data.title}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              id="modal-placeholder"
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                color: "#00e5ff",
                opacity: 0.5,
              }}
            >
              📷 Photo coming soon
            </div>
          )}
        </div>

        {/* Caption */}
        <div
          id="modal-caption"
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 12,
            color: "#555",
            textAlign: "center",
          }}
        >
          {data.caption}
        </div>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes achievementModalIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────── */
export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = useCallback((a: (typeof achievements)[number]) => {
    if (!a.hasPhoto) return;
    setModalData({
      imgSrc: a.imgSrc,
      imgId: a.imgId,
      title: a.modalTitle,
      caption: a.modalCaption,
    });
  }, []);

  const closeModal = useCallback(() => setModalData(null), []);

  return (
    <>
      {/*
        ACHIEVEMENT PHOTOS:
        Photos live at: artifacts/portfolio/public/images/
          protothon.jpg   ← International Protothon winner photo
          hackathon.jpg   ← Hackathon winner photo
        Recommended size: 800×500px or similar landscape
      */}

      <section id="achievements" ref={ref}>
        <h2
          className="text-xs tracking-[0.4em] uppercase mb-10 text-center"
          style={{ color: "#00E5FF", fontFamily: "'Orbitron', sans-serif" }}
          data-testid="heading-achievements"
        >
          <span
            className="inline-block pb-2"
            style={{ borderBottom: "2px solid #00E5FF" }}
          >
            Achievements
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            const clickable = a.hasPhoto;

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
                onClick={() => openModal(a)}
                className="glass-card rounded-lg p-5 md:p-8 flex flex-col items-center text-center transition-all duration-300"
                style={{ cursor: clickable ? "pointer" : "default" }}
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
                    style={{
                      color: a.color,
                      filter: `drop-shadow(0 0 8px ${a.color})`,
                    }}
                  />
                </div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#FFFFFF",
                  }}
                  data-testid={`text-achievement-title-${i}`}
                >
                  {a.title}
                </h3>
                <p
                  className="text-xs"
                  style={{
                    color: "#B3B3B3",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {a.subtitle}
                </p>

                {/* Camera hint — only on clickable cards */}
                {clickable && (
                  <div
                    className="card-hint"
                    style={{
                      fontSize: 10,
                      color: "#00e5ff",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      textAlign: "center",
                      fontFamily: "Courier New, monospace",
                      marginTop: 8,
                    }}
                    /* We use a data attribute + CSS trick since inline hover isn't
                       possible. We'll handle it via onMouseEnter/Leave instead. */
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.opacity = "0.6")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.opacity = "0")
                    }
                  >
                    🖼 Click to view photo
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Global card-hint hover via injected CSS */}
      <style>{`
        .glass-card:hover .card-hint {
          opacity: 0.6 !important;
        }
      `}</style>

      {/* Modal — rendered outside the section so it overlays everything */}
      <AchievementModal data={modalData} onClose={closeModal} />
    </>
  );
}
