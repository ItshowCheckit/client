import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LostItemListPage from "./pages/LostItemListPage"
import ItemDetailPage from "./pages/ItemDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/:school/role" element={<RoleSelectPage />} />
      <Route path="/:school/items" element={<LostItemListPage />} />
      <Route path="/:school/items/:id" element={<ItemDetailPage />} />
    </Routes>
  );
}