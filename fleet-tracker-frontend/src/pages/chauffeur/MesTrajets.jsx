import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMesTrajets, updateMonTrajet } from "../../features/TrajetSlice";
import "../../styles/chauffeur/mestrajets.css";
import TrajetUpdateModal from '../../components/ui/TrajetUpdateModal';
import TrajetDetailsModal from '../../components/ui/TrajetDetailsModal'

const MesTrajetsPage = () => {
  const dispatch = useDispatch();
  const { mesTrajets,pagination, loading, error } = useSelector(state => state.trajets);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    kmDepart: '',
    kmArrivee: '',
    dateArrivee: '',
    remarquesChauffeur: '',
    statut: 'À faire'
  });

  useEffect(() => {
    dispatch(fetchMesTrajets());
  }, [dispatch]);

  const handleStatusChange = async (trajetId, newStatus) => {
    try {
      await dispatch(updateMonTrajet({
        id: trajetId,
        data: { statut: newStatus }
      })).unwrap();
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };

  const handleViewDetails = (trajet) => {
    setSelectedTrajet(trajet);
    setShowDetailsModal(true);
  };

  const handleOpenUpdate = (trajet) => {
    setSelectedTrajet(trajet);
    setFormData({
      kmDepart: trajet.kmDepart || '',
      kmArrivee: trajet.kmArrivee || '',
      dateArrivee: trajet.dateArrivee ? new Date(trajet.dateArrivee).toISOString().slice(0, 16) : '',
      remarquesChauffeur: trajet.remarquesChauffeur || '',
      statut: trajet.statut || 'À faire'
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrajet) return;

    try {
      const updateData = {
        ...formData,
        dateArrivee: formData.dateArrivee ? new Date(formData.dateArrivee) : null
      };

      await dispatch(updateMonTrajet({
        id: selectedTrajet._id,
        data: updateData
      })).unwrap();
      
      setShowUpdateModal(false);
      setSelectedTrajet(null);
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };

  const stats = {
    total: pagination.totalTrajets,
    a_faire: mesTrajets.filter(t => t.statut === 'À faire').length,
    en_cours: mesTrajets.filter(t => t.statut === 'En cours').length,
    termines: mesTrajets.filter(t => t.statut === 'Terminé').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mes-trajets-page">
      {/* Header */}
      <div className="page-header">
        <h2>Mes Trajets</h2>
        <div className="header-actions">
          <button 
            className="btn-refresh" 
            onClick={() => dispatch(fetchMesTrajets())}
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i> Actualiser
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="trajets-stats">
        <div className="stat-card">
          <h3>Total Trajets</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>À Faire</h3>
          <p className="warning">{stats.a_faire}</p>
        </div>
        <div className="stat-card">
          <h3>En Cours</h3>
          <p className="info">{stats.en_cours}</p>
        </div>
        <div className="stat-card">
          <h3>Terminés</h3>
          <p className="success">{stats.termines}</p>
        </div>
      </div>

      {/* Table */}
      <div className="trajets-table-card">
        <div className="table-header">
          <h3>Liste des Trajets</h3>
          
        </div>

        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Chargement...
          </div>
        ) : error ? (
          <div className="error-display">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : mesTrajets.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-route"></i>
            <p>Aucun trajet trouvé</p>
          </div>
        ) : (
          <table className="trajets-table">
            <thead>
              <tr>
                <th>Départ → Arrivée</th>
                <th>Date Départ</th>
                <th>Date Arrivée</th>
                <th>Km Début</th>
                <th>Km Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mesTrajets.map((trajet) => (
                <tr key={trajet._id}>
                  <td>
                    <div className="trajet-route">
                      <strong>{trajet.pointDepart}</strong>
                      <i className="fas fa-arrow-right"></i>
                      <strong>{trajet.pointArrivee}</strong>
                    </div>
                  </td>
                  <td>{formatDate(trajet.dateDepart)}</td>
                  <td>{formatDate(trajet.dateArrivee)}</td>
                  <td>{trajet.kmDepart || '-'}</td>
                  <td>{trajet.kmArrivee || '-'}</td>
                  <td>
                    <select
                      className={`status-select ${trajet.statut?.toLowerCase().replace(' ', '-')}`}
                      value={trajet.statut || 'À faire'}
                      onChange={(e) => handleStatusChange(trajet._id, e.target.value)}
                    >
                      <option value="À faire">À faire</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </td>
                  <td className="actions">
                    <button 
                      className="icon-btn details"
                      onClick={() => handleViewDetails(trajet)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="icon-btn edit"
                      onClick={() => handleOpenUpdate(trajet)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedTrajet && (
        <TrajetDetailsModal
          trajet={selectedTrajet}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Modal Mise à jour */}
      {showUpdateModal && selectedTrajet && (
        <TrajetUpdateModal
          trajet={selectedTrajet}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdateSubmit}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  );
};

export default MesTrajetsPage;