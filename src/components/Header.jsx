// components/Header.jsx
const COLORS = {
  primary: "#1B3A7A",
  card: "#FFFFFF",
  border: "#E2E8F0",
  green: "#22C55E",
};

export default function Header({ schoolName, logoSrc }) {
  return (
    <header style={styles.header}>
      {/* 왼쪽: 로고 이미지 or 텍스트 로고 */}
      <div style={styles.logoArea}>
        {logoSrc ? (
          <img src={logoSrc} alt="체크잇 로고" style={styles.logoImg} />
        ) : (
          <div style={styles.textLogo}>
            <span style={styles.logoText}>체크잇</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={COLORS.green} strokeWidth="2"/>
              <path d="M7 12l3.5 3.5L17 8" stroke={COLORS.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* 오른쪽: 학교명 */}
      <span style={styles.schoolName}>{schoolName ?? "학교"}</span>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 80,
    background: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
  },
  logoImg: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
  textLogo: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 800,
    color: COLORS.primary,
    letterSpacing: "-0.5px",
  },
  schoolName: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.primary,
    letterSpacing: "-0.3px",
  },
};
