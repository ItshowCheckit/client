// pages/ItemDetailPage.jsx
import { useState, useEffect } from "react";
import Header from "../components/Header";

const COLORS = {
  bg: "#F0F3F8",
  primary: "#1B3A7A",
  accent: "#2563EB",
  accentLight: "#DBEAFE",
  text: "#1E293B",
  muted: "#94A3B8",
  card: "#FFFFFF",
  border: "#E2E8F0",
  red: "#EF4444",
  shadow: "0 2px 16px rgba(0,0,0,0.06)",
};

// 아이콘
const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ImageUploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
);

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
}
function formatTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

export default function ItemDetailPage({ schoolName, logoSrc, item, onBack, onSave, onDelete }) {
  const isNew = !item;

  const [name,         setName]         = useState(item?.name     ?? "");
  const [location,     setLocation]     = useState(item?.location  ?? "");
  const [dateStr,      setDateStr]      = useState(item?.dateStr   ?? formatDate());
  const [timeStr,      setTimeStr]      = useState(item?.timeStr   ?? formatTime());
  const [status,       setStatus]       = useState(item?.status    ?? "keeping");
  const [imagePreview, setImagePreview] = useState(item?.image     ?? null);
  const [mounted,      setMounted]      = useState(false);
  const [confirmDel,   setConfirmDel]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim() || !location.trim()) return;
    onSave?.({ name, location, dateStr, timeStr, status, image: imagePreview });
  };

  const handleDelete = () => {
    if (!confirmDel) { setConfirmDel(true); return; }
    onDelete?.(item?.id);
  };

  const canSave = name.trim() && location.trim();

  return (
    <div style={styles.root}>
      <Header schoolName={schoolName} logoSrc={logoSrc} />

      <main
        style={{
          ...styles.main,
          opacity:   mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.38s ease, transform 0.38s ease",
        }}
      >
        {/* 뒤로가기 */}
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft />
          <span>돌아가기</span>
        </button>

        {/* 메인 컨텐츠 행 */}
        <div style={styles.contentRow}>

          {/* 왼쪽: 이미지 (절반 차지) */}
          <div style={styles.imageSection}>
            {imagePreview ? (
              <div style={styles.imageWrap}>
                <img src={imagePreview} alt="분실물 사진" style={styles.image} />
                <button style={styles.removeBtn} onClick={() => setImagePreview(null)} aria-label="이미지 제거">
                  <XIcon />
                </button>
              </div>
            ) : (
              <label style={styles.uploadArea}>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                <ImageUploadIcon />
                <span style={styles.uploadText}>사진을 업로드하세요.</span>
              </label>
            )}
          </div>

          {/* 오른쪽: 폼 */}
          <div style={styles.formSection}>

            {/* 물품명 */}
            <div style={styles.fieldRow}>
              <BoxIcon />
              <input
                style={styles.input}
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 위치 */}
            <div style={styles.fieldRow}>
              <LocationIcon />
              <input
                style={styles.input}
                type="text"
                placeholder=""
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* 날짜 + 시간 — 스크린샷처럼 텍스트 형태로 나란히 */}
            <div style={styles.fieldRow}>
              <ClockIcon />
              <span style={styles.dateText}>{dateStr}</span>
              <span style={styles.dateText}>{timeStr}</span>
            </div>

            {/* 상태 버튼 */}
            <div style={styles.statusRow}>
              {[
                { key: "keeping",  label: "보관중" },
                { key: "received", label: "수령 완료" },
              ].map((s) => {
                const active = status === s.key;
                return (
                  <button
                    key={s.key}
                    style={{
                      ...styles.statusBtn,
                      borderColor: active ? COLORS.accent : COLORS.border,
                      color:       active ? COLORS.accent : COLORS.muted,
                      fontWeight:  active ? 700 : 400,
                    }}
                    onClick={() => setStatus(s.key)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* 저장 / 삭제 */}
            <div style={styles.actionRow}>
              <button
                style={{ ...styles.saveBtn, opacity: canSave ? 1 : 0.45 }}
                onClick={handleSave}
                disabled={!canSave}
              >
                저장하기
              </button>
              {!isNew && (
                <button
                  style={{
                    ...styles.deleteBtn,
                    background: confirmDel ? COLORS.red : "transparent",
                    color:      confirmDel ? "#fff"     : COLORS.red,
                  }}
                  onClick={handleDelete}
                >
                  {confirmDel ? "정말 삭제할까요?" : "삭제하기"}
                </button>
              )}
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: ${COLORS.bg}; }
        button { font-family: 'Noto Sans KR', sans-serif; cursor: pointer; }
        input  { font-family: 'Noto Sans KR', sans-serif; }
        input:focus { border-color: ${COLORS.accent} !important; outline: none; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: COLORS.bg,
    fontFamily: "'Noto Sans KR', sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  main: {
    flex: 1,
    padding: "28px 40px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: COLORS.muted,
    fontSize: 14,
    cursor: "pointer",
    width: "fit-content",
    padding: "2px 0",
  },

  contentRow: {
    display: "flex",
    gap: 48,
    alignItems: "flex-start",
  },

  // 이미지 — 왼쪽 절반
  imageSection: {
    flex: "0 0 48%",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: 12,
    overflow: "hidden",
    border: `1px solid ${COLORS.border}`,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: COLORS.red,
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  // 스크린샷: 점선 테두리, 아이콘+텍스트 중앙
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    width: "100%",
    aspectRatio: "4 / 3",
    border: `1.5px dashed ${COLORS.border}`,
    borderRadius: 12,
    cursor: "pointer",
    background: COLORS.card,
  },
  uploadText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: 400,
  },

  // 폼 — 오른쪽
  formSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingTop: 8,
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  input: {
    flex: 1,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 15,
    color: COLORS.text,
    background: COLORS.card,
    outline: "none",
    transition: "border-color 0.2s",
  },
  // 날짜/시간 — 인풋 아닌 텍스트
  dateText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: 400,
  },

  statusRow: {
    display: "flex",
    gap: 12,
  },
  statusBtn: {
    flex: 1,
    padding: "12px 0",
    border: "1.5px solid",
    borderRadius: 8,
    fontSize: 15,
    background: COLORS.card,
    cursor: "pointer",
    transition: "all 0.15s",
  },

  actionRow: {
    display: "flex",
    gap: 12,
    marginTop: 4,
  },
  saveBtn: {
    flex: 1,
    padding: "14px 0",
    background: COLORS.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  deleteBtn: {
    flex: 1,
    padding: "14px 0",
    border: `1.5px solid ${COLORS.red}`,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  },
};
