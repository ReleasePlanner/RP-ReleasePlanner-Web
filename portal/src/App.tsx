import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import ReleasePlanner from "./pages/ReleasePlanner";
import { ProductMaintenancePage } from "./features/productMaintenance";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ReleasePlanner />} />
        <Route path="release-planner" element={<ReleasePlanner />} />
        <Route
          path="product-maintenance"
          element={<ProductMaintenancePage />}
        />
      </Route>
    </Routes>
  );
}
