import { Routes, Route, Navigate } from "react-router-dom";
import App from "../App.jsx";

import RoseDay from "../pages/RoseDay.jsx";
import ProposeDay from "../pages/ProposeDay.jsx";
import ChocolateDay from "../pages/ChocolateDay.jsx";
import TeddyDay from "../pages/TeddyDay.jsx";
import PromiseDay from "../pages/PromiseDay.jsx";
import HugDay from "../pages/HugDay.jsx";
import KissDay from "../pages/KissDay.jsx";
import ValentinesDay from "../pages/ValentinesDay.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      {/* Individual day pages */}
      <Route path="/days/rose" element={<RoseDay />} />
      <Route path="/days/propose" element={<ProposeDay />} />
      <Route path="/days/chocolate" element={<ChocolateDay />} />
      <Route path="/days/teddy" element={<TeddyDay />} />
      <Route path="/days/promise" element={<PromiseDay />} />
      <Route path="/days/hug" element={<HugDay />} />
      <Route path="/days/kiss" element={<KissDay />} />
      <Route path="/days/valentines" element={<ValentinesDay />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
