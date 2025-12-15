import { useState, useEffect } from "react";
import "../../styles/admin/pneu.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPneus,      // correction ici (était fetchAllPneus)
  createPneu,
  fetchPneuById,
  deletePneu,
  updatePneu,
  clearError
} from "../../features/PneuSlice"; // nom correct du slice

import PneuModal from "../../components/ui/PneuModal";

const PneusPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPneu, setEditingPneu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { pneus, pagination, loading, error } = useSelector(
    (state) => state.pneus
  );

  useEffect(() => {
    dispatch(fetchPneus({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPneu(null);
  };

  const handleEdit = (pneu) => {
    setEditingPneu(pneu);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
   
      await dispatch(deletePneu(id));
      dispatch(fetchPneus({ page: currentPage, limit: 10 }));
    
  };

  const handleStatusChange = async (id, newStatus) => {
    await dispatch(updatePneu({ id, data: { statut: newStatus } }));
    dispatch(fetchPneus({ page: currentPage, limit: 10 }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSavePneu = async (data) => {
    if (editingPneu) {
      await dispatch(updatePneu({ id: editingPneu._id, data }));
    } else {
      await dispatch(createPneu(data));
    }
    handleCloseModal();
    dispatch(fetchPneus({ page: currentPage, limit: 10 }));
  };

  const stats = {
    total: pagination?.totalItems || 0,
    bon: pneus.filter(p => p.statut === "bon").length,
    moyen: pneus.filter(p => p.statut === "moyen").length,
    use: pneus.filter(p => p.statut === "usé").length,
    remplace: pneus.filter(p => p.statut === "remplacé").length
  };

  const getStatusClass = (statut) => {
    switch (statut) {
      case "bon": return "success";
      case "moyen": return "warning";
      case "usé": return "danger";
      case "remplacé": return "info";
      default: return "";
    }
  };

  const filteredPneus = pneus.filter(pneu => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      pneu.vehiculeType?.toLowerCase().includes(search) ||
      pneu.position?.toLowerCase().includes(search) ||
      pneu.marque?.toLowerCase().includes(search) ||
      pneu.statut?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="pneu-page">
      {/* Header */}
      <div className="pneu-header">
        <h2>Gestion des Pneus</h2>
        <button className="btn-primary" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Ajouter Pneu
        </button>
      </div>

      {/* Stats */}
      <div className="pneu-stats">
        <div className="stat-card">
          <h3>Total Pneus</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Bon</h3>
          <p className="success">{stats.bon}</p>
        </div>
        <div className="stat-card">
          <h3>Moyen</h3>
          <p className="warning">{stats.moyen}</p>
        </div>
        <div className="stat-card">
          <h3>Usé</h3>
          <p className="danger">{stats.use}</p>
        </div>
      </div>

      {/* Table */}
      <div className="pneu-table-card">
        <div className="table-header">
          <h3>Liste des Pneus</h3>
          <input
            type="text"
            placeholder="Rechercher un pneu..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="error-display">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error?.message || error}</p>
            <button onClick={() => dispatch(clearError())}>Fermer</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Chargement...
          </div>
        ) : filteredPneus.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>{searchTerm ? "Aucun résultat trouvé" : "Aucun pneu trouvé"}</p>
          </div>
        ) : (
          <>
            <table className="pneu-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Position</th>
                  <th>Marque</th>
                  <th>Kilométrage</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPneus.map((pneu) => (
                  <tr key={pneu._id}>
                    <td>{pneu.vehiculeType}</td>
                    <td>{pneu.position}</td>
                    <td>{pneu.marque || "-"}</td>
                    <td>{pneu.kilometrageInstallation?.toLocaleString()} km</td>
                    <td>
                      <span className={`badge ${getStatusClass(pneu.statut)}`}>
                        {pneu.statut}
                      </span>
                    </td>
                    <td className="actions">
                      <select
                        value={pneu.statut}
                        onChange={(e) =>
                          handleStatusChange(pneu._id, e.target.value)
                        }
                        className={`status-select-${getStatusClass(pneu.statut)}`}
                      >
                        <option value="bon">Bon</option>
                        <option value="moyen">Moyen</option>
                        <option value="usé">Usé</option>
                        <option value="remplacé">Remplacé</option>
                      </select>

                      <button
                        className="icon-btn edit"
                        onClick={() => handleEdit(pneu)}
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(pneu._id)}
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="pagination-btn"
                >
                  <i className="fas fa-chevron-left"></i> Précédent
                </button>

                <span className="pagination-info">
                  Page {pagination.currentPage} sur {pagination.totalPages} 
                  ({pagination.totalItems} pneus)
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="pagination-btn"
                >
                  Suivant <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PneuModal
        isOpen={showModal}
        onClose={handleCloseModal}
        pneu={editingPneu}
        onSave={handleSavePneu}
      />
    </div>
  );
};

export default PneusPage;
