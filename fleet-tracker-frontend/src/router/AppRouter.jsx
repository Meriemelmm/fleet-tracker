import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import CamionsPage from "../pages/admin/CamionsPage";
import RemorquePage from "../pages/admin/RemorquesPage";
import DashboardLayout from "../components/layout/admin/DashboardLayout";
import ChauffeursPage from '../pages/admin/ChauffeursPage'
import PneuPage from "../pages/admin/PneuPage";
import TrajetPage from "../pages/admin/TrajetPage";
import MesTrajets from "../pages/chauffeur/MesTrajets";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées pour admin */}
        <Route element={<ProtectedRoute rolesAllowed={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="camions" element={<CamionsPage />} />
            <Route path="remorques" element={<RemorquePage />} />
            <Route path="chauffeurs" element={<ChauffeursPage />} />
            <Route path="pneus" element={<PneuPage />} />
            <Route path="trajets" element={<TrajetPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute rolesAllowed={["chauffeur"]} />}>
          <Route path="/chauffeur" element={<DashboardLayout />}>
            <Route path="trajets" element={<MesTrajets />} />
          </Route>
        </Route>

        {/* Exemple : page non autorisé */}
        <Route path="/403" element={<div>Accès refusé</div>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;