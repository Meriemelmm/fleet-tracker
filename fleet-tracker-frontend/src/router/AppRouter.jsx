import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import CamionsPage from "../pages/admin/CamionsPage";
import RemorquePage from "../pages/admin/RemorquesPage";
import DashboardLayout from "../components/layout/admin/DashboardLayout";
import ChauffeursPage from '../pages/admin/ChauffeursPage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<DashboardLayout />}>

          <Route path="camions" element={<CamionsPage />} />
          <Route path="remorques" element={<RemorquePage />} />
          <Route path="chauffeurs" element={<ChauffeursPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;