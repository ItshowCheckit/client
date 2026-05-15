import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── 색상 상수 ─────────────────────────────────────────────────────────
const COLORS = {
  bg: "#EFF3FA",
  primary: "#1B3A7A",
  accent: "#2563EB",
  text: "#1E293B",
  muted: "#64748B",
  card: "#FFFFFF",
  border: "#E2E8F0",
  shadow: "0 4px 24px rgba(37,99,235,0.08)",
  shadowHover: "0 12px 36px rgba(37,99,235,0.18)",
};

import studentImg from "../assets/student.png";
import teacherImg from "../assets/teacher.png";

const ROLES = [
  {
    key: "student",
    imageSrc: studentImg,
    imageAlt: "학생 아이콘",
    label: "학생",
    desc: "분실물을 찾아보세요.",
  },
  {
    key: "teacher",
    imageSrc: teacherImg,
    imageAlt: "교사 아이콘",
    label: "교사",
    desc: "분실물을 등록하세요.",
  },
];

const FALLBACK_EMOJI = { student: "🎓", teacher: "📗" };


//권한분기
export default function RoleSelectPage() {
  const { school } = useParams();       // URL에서 학교명 읽기
  const navigate   = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // 클릭 즉시 해당 역할 페이지로 이동
  const handleSelect = (key) => {
    navigate(`/${school}/items?role=${key}`);
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <main
        style={{
          ...styles.main,
          opacity:   mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <p style={styles.prompt}>역할을 선택해주세요.</p>

        <div style={styles.cardRow}>
          {ROLES.map((role, i) => {
            const isHovered = hovered === role.key;

            return (
              <button
                key={role.key}
                style={{
                  ...styles.card,
                  // 후버
                  transform:   isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                  boxShadow:   isHovered ? COLORS.shadowHover : COLORS.shadow,
                  borderColor: isHovered ? COLORS.accent : COLORS.border,
                  background:  COLORS.card,
                  opacity:     mounted ? 1 : 0,
                  transitionDelay: `${i * 80}ms`,
                }}
                onMouseEnter={() => setHovered(role.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(role.key)}
                aria-label={`${role.label} 역할 선택`}
              >
                {role.imageSrc ? (
                  <img src={role.imageSrc} alt={role.imageAlt} style={styles.roleImg} />
                ) : (
                  <span style={styles.fallbackEmoji}>{FALLBACK_EMOJI[role.key]}</span>
                )}

                <span
                  style={{
                    ...styles.roleLabel,
                    color: isHovered ? COLORS.accent : COLORS.primary,
                  }}
                >
                  {role.label}
                </span>
                <span style={styles.roleDesc}>{role.desc}</span>
              </button>
            );
          })}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: 'Noto Sans KR', sans-serif; cursor: pointer; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: COLORS.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Sans KR', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
    top: -80,
    right: -80,
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
    bottom: -60,
    left: -60,
    pointerEvents: "none",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 36,
    padding: "40px 24px",
    zIndex: 1,
  },
  prompt: {
    fontSize: 18,
    fontWeight: 500,
    color: COLORS.text,
    letterSpacing: "-0.2px",
  },
  cardRow: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: 160,
    height: 190,
    background: COLORS.card,
    border: "1.5px solid",
    borderRadius: 20,
    padding: "24px 16px",
    // background는 transition 대상에서 제거
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  },
  roleImg: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
  fallbackEmoji: {
    fontSize: 52,
    lineHeight: 1,
    width: 70,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 700,
    transition: "color 0.2s",
  },
  roleDesc: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 1.4,
  },
};
