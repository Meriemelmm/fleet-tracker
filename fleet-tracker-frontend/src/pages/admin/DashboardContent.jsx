import '../../styles/admin/stats.css';

const DashboardContent = () => {
  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1 className="stats-title">Tableau de Bord</h1>
        <p className="stats-subtitle">Vue d'ensemble de votre flotte</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Camions</div>
            <div className="stat-icon primary">🚛</div>
          </div>
          <div className="stat-value">42</div>
          <div className="stat-change positive">↗ +2 ce mois</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-title">Disponibles</div>
            <div className="stat-icon success">✅</div>
          </div>
          <div className="stat-value">28</div>
          <div className="stat-change positive">↗ 67%</div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-title">En Mission</div>
            <div className="stat-icon warning">🚚</div>
          </div>
          <div className="stat-value">9</div>
          <div className="stat-change">21%</div>
        </div>
        
        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-title">Maintenance</div>
            <div className="stat-icon danger">🔧</div>
          </div>
          <div className="stat-value">5</div>
          <div className="stat-change negative">↘ 12%</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Activité de la Flotte</h3>
            <select className="chart-filter">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="chart-placeholder">
            Graphique des activités (à implémenter)
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Statuts</h3>
          </div>
          <div className="chart-placeholder">
            Graphique en secteurs (à implémenter)
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Dernières Missions</h3>
            <a href="#" className="view-all-btn">Voir tout</a>
          </div>
          <div className="recent-list">
            <div className="recent-item">
              <div className="recent-info">
                <div className="recent-name">Mission Paris-Lyon</div>
                <div className="recent-details">Camion: TR-001 • Chauffeur: Jean Dupont</div>
              </div>
              <div className="recent-status status-en-mission">En cours</div>
            </div>
            <div className="recent-item">
              <div className="recent-info">
                <div className="recent-name">Livraison Marseille</div>
                <div className="recent-details">Camion: TR-005 • Chauffeur: Marie Martin</div>
              </div>
              <div className="recent-status status-disponible">Terminée</div>
            </div>
          </div>
        </div>
        
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Alertes Système</h3>
            <a href="#" className="view-all-btn">Voir tout</a>
          </div>
          <div className="recent-list">
            <div className="recent-item">
              <div className="recent-info">
                <div className="recent-name">Maintenance programmée</div>
                <div className="recent-details">Camion TR-003 • Dans 2 jours</div>
              </div>
              <div className="recent-status status-maintenance">Urgent</div>
            </div>
            <div className="recent-item">
              <div className="recent-info">
                <div className="recent-name">Contrôle technique</div>
                <div className="recent-details">Camion TR-007 • Dans 1 semaine</div>
              </div>
              <div className="recent-status status-en-mission">Info</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;