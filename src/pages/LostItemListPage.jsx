import { useState, useEffect } from "react";
import Header from "../components/Header";

const COLORS = {
  bg: "#F0F3F8",
  primary: "#1B3A7A",
  accent: "#2563EB",
  accentLight: "#DBEAFE",
  text: "#1E293B",
  muted: "#64748B",
  card: "#FFFFFF",
  border: "#E2E8F0",
  shadow: "0 2px 10px rgba(0,0,0,0.06)",
  shadowHover: "0 6px 24px rgba(37,99,235,0.13)",
};

const TABS = [
  { key: "all",      label: "전체" },
  { key: "keeping",  label: "보관중" },
  { key: "received", label: "수령 완료" },
];

const PAGE_SIZE = 10; // 5열 × 2행

//더미데이터(나중에 디비연결하던해서처리할것)
const DUMMY_ITEMS = [
  { id: 1,  name: "갈색 지갑",             location: "3학년 3반 교탁 위",  time: "1시간 전", status: "received", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
  { id: 2,  name: "나이키 검정 신발 한 짝", location: "3학년 3반 교탁 위",  time: "1시간 전", status: "received", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: 3,  name: "신용 카드",             location: "화장실 세면대 위",    time: "1일 전",   status: "received", image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&q=80" },
  { id: 4,  name: "주황색 물통",           location: "체육관",             time: "3일 전",   status: "received", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80" },
  { id: 5,  name: "마우스",               location: "실습실 5실",          time: "7일 전",   status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 6,  name: "마우스",               location: "실습실 5실",          time: "7일 전",   status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 7,  name: "마우스",               location: "실습실 5실",          time: "7일 전",   status: "received", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 8,  name: "마우스",               location: "운동장",          time: "7일 전",   status: "keeping",  image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 9,  name: "우산",                 location: "1학년 2반 사물함",    time: "2일 전",   status: "keeping",  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
  { id: 10, name: "에어팟",               location: "도서관",              time: "4일 전",   status: "keeping",  image: "https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=400&q=80" },
  { id: 11, name: "텀블러",               location: "2학년 복도",          time: "5일 전",   status: "received", image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80" },
  { id: 12, name: "체육복 상의",           location: "탈의실",             time: "6일 전",   status: "keeping",  image: "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=400&q=80" },
  { id: 13, name: "필통",                 location: "3학년 1반",           time: "8일 전",   status: "keeping",  image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80" },
];

// 아이콘 svg 후에 이미지로 교체가능
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
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
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function LostItemListPage({ schoolName, logoSrc, onSelectItem }) {
  const [activeTab,    setActiveTab]    = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [page,         setPage]         = useState(1);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => { setPage(1); }, [activeTab, searchQuery]);

  const filtered = DUMMY_ITEMS.filter((item) => {
    const tabMatch    = activeTab === "all" || item.status === activeTab;
    const searchMatch = item.name.includes(searchQuery) || item.location.includes(searchQuery);
    return tabMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    all:      DUMMY_ITEMS.length,
    keeping:  DUMMY_ITEMS.filter((i) => i.status === "keeping").length,
    received: DUMMY_ITEMS.filter((i) => i.status === "received").length,
  };

  return (
    <div style={styles.root}>
      <Header schoolName={schoolName} logoSrc={logoSrc} />

      {/* 탭 + 검색 행 */}
      <div style={styles.toolbar}>
        <div style={styles.tabs}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                style={{
                  ...styles.tab,
                  color:        active ? COLORS.accent : COLORS.text,
                  borderBottom: active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                  fontWeight:   active ? 700 : 400,
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            );
          })}
        </div>

        {/* 검색창 - 스크린샷처럼 오른쪽에 길게 */}
        <div style={styles.searchBox}>
          <SearchIcon />
          <input
            style={styles.searchInput}
            type="text"
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 카드 그리드 */}
      <main style={styles.main}>
        {paginated.length === 0 ? (
          <div style={styles.empty}>분실물이 없습니다.</div>
        ) : (
          <div style={styles.grid}>
            {paginated.map((item, i) => (
              <button
                key={item.id}
                style={{
                  ...styles.card,
                  opacity:    mounted ? 1 : 0,
                  transform:  mounted ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.3s ease ${i * 30}ms, transform 0.3s ease ${i * 30}ms, box-shadow 0.18s`,
                }}
                onClick={() => onSelectItem?.(item)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = COLORS.shadowHover)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = COLORS.shadow)}
              >
                <div style={styles.imgWrap}>
                  <img src={item.image} alt={item.name} style={styles.img} />
                  <span style={styles.badge}>
                    {item.status === "received" ? "수령 완료" : "보관중"}
                  </span>
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.meta}><LocationIcon /><span>{item.location}</span></p>
                  <p style={styles.meta}><ClockIcon /><span>{item.time}</span></p>
                </div>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={{ ...styles.pageBtn, opacity: page === 1 ? 0.3 : 1 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} style={{
                ...styles.pageBtn,
                background:  p === page ? COLORS.accent : "transparent",
                color:       p === page ? "#fff" : COLORS.muted,
                fontWeight:  p === page ? 700 : 400,
                borderColor: p === page ? COLORS.accent : COLORS.border,
              }} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.3 : 1 }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight />
            </button>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: ${COLORS.bg}; }
        button { font-family: 'Noto Sans KR', sans-serif; cursor: pointer; border: none; background: none; text-align: left; }
        input  { font-family: 'Noto Sans KR', sans-serif; }
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

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    background: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
    gap: 20,
  },
  tabs: {
    display: "flex",
    gap: 0,
  },
  tab: {
    padding: "18px 28px",
    fontSize: 16,
    background: "none",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
    whiteSpace: "nowrap",
    letterSpacing: "-0.2px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "10px 16px",
    background: COLORS.card,
    flex: "0 0 340px",   // 스크린샷처럼 넉넉한 너비
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    color: COLORS.text,
    background: "transparent",
  },

  main: {
    flex: 1,
    padding: "32px 40px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 20,
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 15,
    padding: "80px 0",
  },

  card: {
    background: COLORS.card,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: COLORS.shadow,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    padding: 0,
    border: "none",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    background: COLORS.border,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  // 스크린샷: 상단 우측, 어두운 배경에 흰 텍스트, 넉넉한 패딩
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(50,60,90,0.75)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 14px",
    borderRadius: 20,
    backdropFilter: "blur(4px)",
    whiteSpace: "nowrap",
    letterSpacing: "0.1px",
  },
  cardBody: {
    padding: "14px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 700,
    color: COLORS.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 2,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 13,
    color: COLORS.muted,
  },

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pageBtn: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    fontSize: 14,
    color: COLORS.muted,
    cursor: "pointer",
    background: "transparent",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
  },
};
