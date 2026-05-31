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

    const decodedSchool = decodeURIComponent(school);

    const handleSave = async (data) => {
      try {
        const isNew = !data.item_id; // ID가 없으면 새로 만들고 있으면 수정
        const url = isNew 
          ? `http://localhost:3000/api/lost-items` // POST (생성)
          : `http://localhost:3000/api/lost-items/${data.item_id}`;

        const response = await fetch(url, {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            school_name: decodedSchool,
            item_name: data.item_name,
            lost_location: data.lost_location,
            status: data.status,
            image_url: data.image_url
          })
        });

        if (response.ok) {
          alert(isNew ? "새 분실물이 등록되었습니다!" : "수정이 완료되었습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("저장 중 에러 발생:", error);
        alert("저장에 실패했습니다.");
      }
    };

    // ── handleDelete : 분실물 삭제 ─────────────────
    const handleDelete = async (deletedId) => {
      if (!window.confirm("정말 삭제하시겠습니까?")) return;
      try {
        const response = await fetch(`http://localhost:3000/api/lost-items/${deletedId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert("삭제되었습니다.");
          navigate(`/${school}/items?role=${role}`);
        }
      } catch (error) {
        console.error("삭제 중 에러:", error);
      }
    };
    return (
      <ItemDetailPage
        schoolName={decodeURIComponent(school)}
        role={role}
        itemId={id ?? null}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    );
  }
