import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── 인라인 스타일 상수 ──────────────────────────────────────────────────
const COLORS = {
  bg: "#EFF3FA",
  primary: "#1B3A7A",
  accent: "#2563EB",
  accentLight: "#DBEAFE",
  green: "#22C55E",
  text: "#1E293B",
  muted: "#64748B",
  card: "#FFFFFF",
  border: "#E2E8F0",
  shadow: "0 4px 24px rgba(37,99,235,0.08)",
  shadowHover: "0 8px 32px rgba(37,99,235,0.16)",
};

// ── 최근 방문 목록 (localStorage) ─────────────────────────────────────
const STORAGE_KEY = "checkit_recent_schools";

function getRecentSchools() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSchool(name) {
  const prev = getRecentSchools().filter((s) => s !== name);
  const next = [name, ...prev].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

//더미데이터 학교 api 연동하면삭제
const SCHOOL_DB = [
  "미림마이스터고등학교",
  "미림여자고등학교",
  "동작고등학교",
  "명덕여자고등학교",
  "명덕고등학교",
  "명덕외국어고등학교",
  "강남고등학교",
  "송파고등학교",
];

// ── 아이콘 SVG ──────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>

);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);



//페이지함수
export default function MainPage({ onSelectSchool }) {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 마운트 애니메이션
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // 최근 방문 로드
  useEffect(() => {
    setRecent(getRecentSchools());
  }, []);

  // 검색 자동완성
  useEffect(() => {
    const q = query.trim();
    if (!q) { setSuggestions([]); return; }
    const filtered = SCHOOL_DB.filter((s) => s.includes(q));
    setSuggestions(filtered);
  }, [query]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (name) => {
    saveRecentSchool(name);
    setRecent(getRecentSchools());
    setQuery("");
    setSuggestions([]);
    setFocused(false);
    onSelectSchool?.(name);

    navigate(`/${name}/role`);
  };

  const removeRecent = (e, name) => {
    e.stopPropagation();
    const next = getRecentSchools().filter((s) => s !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRecent(next);
  };

  const showDropdown = focused && suggestions.length > 0;

  return (
    <div style={styles.root}>
      {/* 배경 장식 원 */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      {/* 중앙 콘텐츠 */}
      <div
        style={{
          ...styles.center,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}
      >
        {/* 임시로고 나중에 이미지로변환or컴포넌트분리 */}
        <div style={styles.logoRow}>
          <span style={styles.logoText}>체크잇</span>
          <CheckIcon />
        </div>

        {/* 서브타이틀 */}
        <p style={styles.subtitle}>교내 분실물 유무, 방문 전 미리 확인하세요.</p>

        {/* 검색창 */}
        <div style={styles.searchWrap} ref={dropdownRef}>
          <div
            style={{
              ...styles.searchBox,
              boxShadow: focused ? `0 0 0 3px ${COLORS.accentLight}, ${COLORS.shadow}` : COLORS.shadow,
              borderColor: focused ? COLORS.accent : COLORS.border,
            }}
          >
            <span style={{ color: focused ? COLORS.accent : COLORS.muted, display: "flex" }}>
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              style={styles.input}
              type="text"
              placeholder="학교 이름을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions.length > 0) handleSelect(suggestions[0]);
              }}
              aria-label="학교 검색"
            />
            {query && (
              <button
                style={styles.clearBtn}
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                aria-label="검색어 지우기"
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* 자동완성 */}
          {showDropdown && (
            <ul style={styles.dropdown}>
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  style={{
                    ...styles.dropdownItem,
                    animationDelay: `${i * 40}ms`,
                    borderBottom: i < suggestions.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  }}
                  onClick={() => handleSelect(s)}
                >
                  <SearchIcon />
                  <span>{highlight(s, query)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 최근 방문 */}
        {recent.length > 0 && (
          <div
            style={{
              ...styles.recentSection,
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.55s ease 0.2s",
            }}
          >
            <div style={styles.recentLabel}>
              <ClockIcon />
              <span>최근 방문 목록</span>
            </div>
            <div style={styles.chipRow}>
              {recent.map((name, i) => (
                <button
                  key={name}
                  style={{
                    ...styles.chip,
                    animationDelay: `${i * 60}ms`,
                  }}
                  onClick={() => handleSelect(name)}
                  className="chip-btn"
                >
                  {name}
                  <span
                    style={styles.chipRemove}
                    onClick={(e) => removeRecent(e, name)}
                    role="button"
                    aria-label={`${name} 삭제`}
                  >
                    <XIcon />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 크레딧(임의로만듬) */}
      <p style={styles.footer}>© 2026 체크잇</p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chip-btn:hover {
          background: ${COLORS.accentLight} !important;
          border-color: ${COLORS.accent} !important;
          color: ${COLORS.accent} !important;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        li[style] { animation: fadeSlideIn 0.2s ease both; }
      `}</style>
    </div>
  );
}

// 검색어 하이라이트 렌더
function highlight(text, query) {
  if (!query) return text;
  const idx = text.indexOf(query);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: COLORS.accentLight, color: COLORS.accent, borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── 스타일 객체 ────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: COLORS.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Sans KR', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 480,
    height: 480,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
    top: -80,
    right: -100,
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
    bottom: -60,
    left: -80,
    pointerEvents: "none",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 620,
    padding: "0 24px",
    zIndex: 1,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 700,
    color: COLORS.primary,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 1.6,
  },
  searchWrap: {
    position: "relative",
    width: "100%",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: COLORS.card,
    border: `1.5px solid`,
    borderRadius: 50,
    padding: "14px 20px",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    color: COLORS.text,
    background: "transparent",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: COLORS.muted,
    display: "flex",
    alignItems: "center",
    padding: 2,
    borderRadius: 50,
    transition: "color 0.15s",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    boxShadow: COLORS.shadowHover,
    listStyle: "none",
    overflow: "hidden",
    zIndex: 100,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 20px",
    cursor: "pointer",
    fontSize: 14,
    color: COLORS.text,
    transition: "background 0.15s",
  },
  recentSection: {
    marginTop: 28,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  recentLabel: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 13,
    color: COLORS.muted,
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 50,
    fontSize: 13,
    color: COLORS.text,
    cursor: "pointer",
    transition: "background 0.18s, border-color 0.18s, color 0.18s",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  chipRemove: {
    display: "flex",
    alignItems: "center",
    color: COLORS.muted,
    marginLeft: 2,
    cursor: "pointer",
    opacity: 0.6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: COLORS.muted,
    opacity: 0.5,
  },
};
