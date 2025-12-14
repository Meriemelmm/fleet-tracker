import { useState, useEffect } from "react";
import "../../styles/admin/camion.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamions, createCamion, deleteCamion, updateCamion } from "../../features/camionSlice";
import CamionModal from "../../components/ui/CamionModal";

const CamionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCamion, setEditingCamion] = useState(null);
  
  const dispatch = useDispatch();
  const { camions, pagination, loading, error } = useSelector(state => state.camions);
  const [currentPage, setCurrentPage] = useState(1);
  

  useEffect(() => {
    dispatch(fetchCamions({ currentPage, limit: 10 }));
  }, [dispatch, currentPage]); // Ajout de currentPage comme dépendance



  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const handleOpenModal = () => {
    setShowModal(true);
    
  };
const handleCloseModal = () => {
  setShowModal(false);
  setEditingCamion(null);
  setErrors({});
};

 

 
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce camion ?")) {
      dispatch(deleteCamion(id));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log("id de camion", id);
      console.log("newStatus", newStatus);
      dispatch(updateCamion({ id, data: { status: newStatus } }));
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  // Calcul des statistiques - note: cela ne concerne que la page actuelle
  const stats = {
    total: pagination.totalItems,
    disponibles: camions.filter(c => c.status === "disponible").length,
    en_service: camions.filter(c => c.status === "en_service").length,
    en_maintenance: camions.filter(c => c.status === "en_maintenance").length
  };

  const formatKilometrage = (km) => {
    return new Intl.NumberFormat('fr-FR').format(km) + " km";
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "disponible": return "Disponible";
      case "en_service": return "En Service";
      case "en_maintenance": return "En Maintenance";
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "disponible": return "success";
      case "en_service": return "info";
      case "en_maintenance": return "warning";
      default: return "";
    }
  };

  const handleEdit = (camion) => {
    setEditingCamion(camion);
    setShowModal(true);
  };

  return (
    <div className="camion-page">
      {/* Header section */}
      <div className="camion-header">
        <h2>Gestion des Camions</h2>
        <button className="btn-primary" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Ajouter Camion
        </button>
      </div>

      {/* Stats */}
      <div className="camion-stats">
        <div className="stat-card">
          <h3>Total Camions</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Disponibles</h3>
          <p className="success">{stats.disponibles}</p>
        </div>
        <div className="stat-card">
          <h3>En Service</h3>
          <p className="info">{stats.en_service}</p>
        </div>
        <div className="stat-card">
          <h3>En Maintenance</h3>
          <p className="warning">{stats.en_maintenance}</p>
        </div>
      </div>

      {/* Table */}
      <div className="camion-table-card">
        <div className="table-header">
          <h3>Liste des Camions</h3>
          <input
            type="text"
            placeholder="Rechercher un camion..."
            className="search-input"
          />
        </div>
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Chargement...
          </div>
        ) : error ? (
          <div className="error-display">
            <i className="fas fa-exclamation-circle"></i> 
            <p>{typeof error === 'string' ? error : error.message || 'Une erreur est survenue'}</p>
          </div>
        ) : camions.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Aucun camion trouvé</p> {/* Correction ici */}
          </div>
        ) : (
          <>
            <table className="camion-table">
              <thead>
                <tr>
                  <th>Immatriculation</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Année</th>
                  <th>Kilométrage</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {camions.map((camion) => (
                  <tr key={camion._id}>
                    <td><strong>{camion.immatriculation}</strong></td>
                    <td>{camion.marque}</td>
                    <td>{camion.modele}</td>
                    <td>{camion.annee}</td>
                    <td>{formatKilometrage(camion.kilometrageActuel)}</td>
                    <td>
                      <span className={`badge ${getStatusClass(camion.status)}`}>
                        {getStatusLabel(camion.status)}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="status-select">
                        <select 
                          value={camion.status}
                          onChange={(e) => handleStatusChange(camion._id, e.target.value)}
                          className={`status-select-${getStatusClass(camion.status)}`}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="en_service">En Service</option>
                          <option value="en_maintenance">Maintenance</option>
                        </select>
                      </div>
                      <button className="icon-btn edit" onClick={() => handleEdit(camion)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="icon-btn delete"
                        onClick={() => handleDelete(camion._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Précédent
                </button>
                <span>Page {currentPage} sur {pagination.totalPages}</span>
                <button 
                  disabled={currentPage === pagination.totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <CamionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={(data) => {
          if (editingCamion) {
            dispatch(updateCamion({ id: editingCamion._id, data }));
          } else {
            dispatch(createCamion(data));
          } 
        }}
        camion={editingCamion}
      />
    </div>
  );
};

export default CamionPage;