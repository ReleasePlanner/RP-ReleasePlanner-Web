import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import ReleasePlanner from "./pages/ReleasePlanner";
import { ProductMaintenancePage } from "./pages/productMaintenancePage";
import { FeatureMaintenancePage } from "./pages/featureMaintenancePage";
import { CalendarMaintenancePage } from "./pages/calendarMaintenancePage";
import { ITOwnerMaintenancePage } from "./pages/itOwnerMaintenancePage";

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
        <Route path="features" element={<FeatureMaintenancePage />} />
        <Route path="calendars" element={<CalendarMaintenancePage />} />
        <Route path="it-owners" element={<ITOwnerMaintenancePage />} />
      </Route>
    </Routes>
  );
}
