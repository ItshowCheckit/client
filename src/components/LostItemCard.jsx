// components/LostItemCard.jsx
import { useState } from "react";

const COLORS = {
  text:        "#1E293B",
  muted:       "#64748B",
  accent:      "#2563EB",
  card:        "#FFFFFF",
  border:      "#E2E8F0",
  shadow:      "0 2px 10px rgba(0,0,0,0.06)",
  shadowHover: "0 6px 24px rgba(37,99,235,0.13)",
};

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export default function LostItemCard({ item, isTeacher, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.card,
        boxShadow: hovered && isTeacher ? COLORS.shadowHover : COLORS.shadow,
        cursor:    isTeacher ? "pointer" : "default",
        ...style,
      }}
      onClick={isTeacher ? onClick : undefined}
      onMouseEnter={() => isTeacher && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 이미지 */}
      <div style={styles.imgWrap}>
        <img src={item.image} alt={item.name} style={styles.img} />

        {/* 상태 뱃지 */}
        <span style={styles.badge}>
          {item.status === "received" ? "수령 완료" : "보관중"}
        </span>

        {/* 교사 전용: 호버 시 수정 오버레이 */}
        {isTeacher && (
          <div style={{
            ...styles.editOverlay,
            opacity: hovered ? 1 : 0,
          }}>
            <EditIcon />
            <span style={styles.editText}>클릭하여 수정</span>
          </div>
        )}
      </div>

      {/* 카드 정보 */}
      <div style={styles.cardBody}>
        <p style={styles.itemName}>{item.name}</p>
        <p style={styles.meta}><LocationIcon /><span>{item.location}</span></p>
        <p style={styles.meta}><ClockIcon /><span>{item.time}</span></p>
      </div>
    </button>
  );
}

const styles = {
  card: {
    background:    COLORS.card,
    borderRadius:  14,
    overflow:      "hidden",
    display:       "flex",
    flexDirection: "column",
    padding:       0,
    border:        "none",
    textAlign:     "left",
    fontFamily:    "'Noto Sans KR', sans-serif",
    transition:    "box-shadow 0.18s",
  },
  imgWrap: {
    position:    "relative",
    width:       "100%",
    aspectRatio: "1 / 1",
    overflow:    "hidden",
    background:  COLORS.border,
  },
  img: {
    width:     "100%",
    height:    "100%",
    objectFit: "cover",
    display:   "block",
  },
  badge: {
    position:       "absolute",
    top:            10,
    right:          10,
    background:     "rgba(50,60,90,0.75)",
    color:          "#fff",
    fontSize:       12,
    fontWeight:     700,
    padding:        "5px 14px",
    borderRadius:   20,
    backdropFilter: "blur(4px)",
    whiteSpace:     "nowrap",
    letterSpacing:  "0.1px",
  },
  editOverlay: {
    position:       "absolute",
    inset:          0,
    background:     "rgba(37,99,235,0.55)",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    transition:     "opacity 0.18s",
  },
  editText: {
    fontSize:   13,
    fontWeight: 700,
    color:      "#fff",
  },
  cardBody: {
    padding:       "14px 16px 16px",
    display:       "flex",
    flexDirection: "column",
    gap:           7,
  },
  itemName: {
    fontSize:     15,
    fontWeight:   700,
    color:        COLORS.text,
    whiteSpace:   "nowrap",
    overflow:     "hidden",
    textOverflow: "ellipsis",
    marginBottom: 2,
  },
  meta: {
    display:    "flex",
    alignItems: "center",
    gap:        5,
    fontSize:   13,
    color:      COLORS.muted,
  },
};
