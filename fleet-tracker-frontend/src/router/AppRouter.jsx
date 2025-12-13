import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import CamionsPage from "../pages/admin/CamionsPage";
import DashboardLayout from "../components/layout/admin/DashboardLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<div style={{padding: '2rem', marginLeft: '250px', marginTop: '70px'}}><h1>Dashboard Admin</h1><p>Bienvenue sur le tableau de bord</p></div>} />
          <Route path="camions" element={<CamionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;