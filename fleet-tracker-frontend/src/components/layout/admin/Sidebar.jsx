import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTruck,
  FaUsers,
  FaRoute,
  FaCogs,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import "../../../styles/admin/sidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
 

 
  const menuItems = [
    { id: 'dashboard', icon: FaTachometerAlt, label: 'Dashboard', path: '/admin' },
    { id: 'camions', icon: FaTruck, label: 'Camions', path: '/admin/camions' },
    { id: 'chauffeurs', icon: FaUsers, label: 'Chauffeurs', path: '/admin/chauffeurs' },
    { id: 'livraisons', icon: FaRoute, label: 'Livraisons', path: '/admin/livraisons' },
    { id: 'maintenance', icon: FaCogs, label: 'Maintenance', path: '/admin/maintenance' },
    { id: 'rapports', icon: FaChartBar, label: 'Rapports', path: '/admin/rapports' },
    { id: 'parametres', icon: FaCog, label: 'Paramètres', path: '/admin/parametres' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton burger pour mobile */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay pour fermer le menu en cliquant en dehors */}
      <div className={`sidebar-overlay ${isOpen ? "active" : ""}`} onClick={closeSidebar} />

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h2 className="text-xl font-bold tracking-tight">FleetTrack</h2>
          <span>Admin Panel</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className={location.pathname === item.path ? "active" : ""}>
                <Link to={item.path} onClick={closeSidebar}>
                  <span className="icon">
                    <IconComponent />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="logout-item" >
            <span className="icon">
              <FaSignOutAlt />
            </span>
            Déconnexion
          </li>
        </ul>
      </aside>
    </>
  );
};

export default AdminSidebar;
