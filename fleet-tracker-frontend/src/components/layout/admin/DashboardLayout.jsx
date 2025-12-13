import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../../styles/admin/AdminLayout.css';

const AdminLayout = () => (
  <>
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  </>
);

export default AdminLayout;