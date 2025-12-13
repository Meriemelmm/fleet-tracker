import "../../../styles/admin/header.css";

import { FaBell } from "react-icons/fa";

const Header = () => {
  

  return (
    <>
      <header className="admin-header">
        <input
          type="text"
          placeholder="Rechercher des utilisateurs, commandes, produits..."
          className="search-input"
        />
        <div className="header-right">
          <div className="notification">
            <FaBell color="#FF6F61" />
          </div>
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="role-name">
              <span className="user-name"> </span>
              <span className="user-role"></span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
