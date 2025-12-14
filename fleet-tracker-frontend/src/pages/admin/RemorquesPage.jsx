import { useState, useEffect } from "react";
import "../../styles/admin/remorque.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemorques, createRemorque, deleteRemorque, updateRemorque } from "../../features/remorqueSlice";
import RemorqueModal from "../../components/ui/RemorqueModal";

const RemorquesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingRemorque, setEditingRemorque] = useState(null);
 
  
  const dispatch = useDispatch();
  const { remorques, pagination, loading, error } = useSelector(state => state.remorques);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchRemorques({ currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  console.log("remorques:", remorques);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRemorque(null);
  };

  const handleDelete = async (id) => {
   
      dispatch(deleteRemorque(id));
    
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log("id de remorque", id);
      console.log("newStatus", newStatus);
      dispatch(updateRemorque({ id, data: { status: newStatus } }));
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const handleEdit = (remorque) => {
    setEditingRemorque(remorque);
    setShowModal(true);
  };

  const stats = {
    total: pagination?.totalItems || remorques.length,
    disponibles: remorques.filter(r => r.status === "disponible").length,
    en_service: remorques.filter(r => r.status === "en_service").length,
    en_maintenance: remorques.filter(r => r.status === "en_maintenance").length
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

  const getTypeLabel = (type) => {
    const types = {
      'frigorifique': 'Frigorifique',
      'bachee': 'Bâchée',
      'plateau': 'Plateau',
      'citerne': 'Citerne',
      'porte-conteneur': 'Porte-conteneur'
    };
    return types[type?.toLowerCase()] || type;
  };

  return (
    <div className="remorque-page">
      {/* Header section */}
      <div className="remorque-header">
        <h2>Gestion des Remorques</h2>
        <button className="btn-primary" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Ajouter Remorque
        </button>
      </div>

      {/* Stats */}
      <div className="remorque-stats">
        <div className="stat-card">
          <h3>Total Remorques</h3>
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
      <div className="remorque-table-card">
        <div className="table-header">
          <h3>Liste des Remorques</h3>
          <input
            type="text"
            placeholder="Rechercher une remorque..."
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
        ) : remorques.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Aucune remorque trouvée</p>
          </div>
        ) : (
          <table className="remorque-table">
            <thead>
              <tr>
                <th>Immatriculation</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {remorques.map((remorque) => (
                <tr key={remorque._id}>
                  <td><strong>{remorque.immatriculation}</strong></td>
                  <td>{getTypeLabel(remorque.type)}</td>
                  <td>
                    <span className={`badge ${getStatusClass(remorque.status)}`}>
                      {getStatusLabel(remorque.status)}
                    </span>
                  </td>
                  <td>
                    {remorque.createdAt 
                      ? new Date(remorque.createdAt).toLocaleDateString('fr-FR')
                      : '-'
                    }
                  </td>
                  <td className="actions">
                    <div className="status-select">
                      <select 
                        value={remorque.status}
                        onChange={(e) => handleStatusChange(remorque._id, e.target.value)}
                        className={`status-select-${getStatusClass(remorque.status)}`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="en_service">En Service</option>
                        <option value="en_maintenance">Maintenance</option>
                      </select>
                    </div>
                    <button className="icon-btn edit" onClick={() => handleEdit(remorque)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => handleDelete(remorque._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RemorqueModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={(data) => {
          if (editingRemorque) {
            dispatch(updateRemorque({ id: editingRemorque._id, data }));
          } else {
            dispatch(createRemorque(data));
          }
          handleCloseModal();
        }}
        remorque={editingRemorque}
      />
    </div>
  );
};

export default RemorquesPage;