import { Routes, Route, useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LostItemListPage from "./pages/LostItemListPage";
import ItemDetailPage from "./pages/ItemDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/"                          element={<MainWrapper />} />
      <Route path="/:school/role"              element={<RoleSelectPage />} />
      <Route path="/:school/items"             element={<LostItemListWrapper />} />
      <Route path="/:school/items/new"         element={<ItemDetailWrapper />} />
      <Route path="/:school/items/:id/edit"    element={<ItemDetailWrapper />} />
    </Routes>
  );
}

// ── MainPage: 학교 선택 → 역할 선택 페이지로 ─────────────────────────
function MainWrapper() {
  const navigate = useNavigate();
  return (
    <MainPage
      onSelectSchool={(name) =>
        navigate(`/${encodeURIComponent(name)}/role`)
      }
    />
  );
}

// ── LostItemListPage: role 쿼리파라미터 읽어서 prop으로 전달 ──────────
function LostItemListWrapper() {
  const { school }     = useParams();
  const [searchParams] = useSearchParams();
  const role           = searchParams.get("role") ?? "student"; // 기본값 student
  const navigate       = useNavigate();

  return (
    <LostItemListPage
      schoolName={decodeURIComponent(school)}
      role={role}
      // 교사: 카드 클릭 → /:school/items/:id/edit?role=teacher
      // 교사: 등록 버튼 → /:school/items/new?role=teacher
      onSelectItem={(item) =>
        navigate(`/${school}/items/${item.id}/edit?role=${role}`)
      }
      onAddItem={() =>
        navigate(`/${school}/items/new?role=${role}`)
      }
    />
  );
}

// ── ItemDetailPage: id 없으면 신규 등록, 있으면 수정 ─────────────────
function ItemDetailWrapper() {
  const { school, id } = useParams();
  const [searchParams] = useSearchParams();
  const role           = searchParams.get("role") ?? "teacher";
  const navigate       = useNavigate();

  return (
    <ItemDetailPage
      schoolName={decodeURIComponent(school)}
      role={role}
      itemId={id ?? null}           // null이면 신규 등록 모드
      onBack={() => navigate(-1)}
      onSave={(data) => {
        // TODO: API 연동 후 실제 저장 처리
        console.log("저장", data);
        navigate(-1);
      }}
      onDelete={(deletedId) => {
        // TODO: API 연동 후 실제 삭제 처리
        console.log("삭제", deletedId);
        navigate(`/${school}/items?role=${role}`);
      }}
    />
  );
}
