import { useState, useEffect } from "react";
import "../../styles/admin/trajet.css";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllTrajets,
    createTrajet,
    fetchTrajetById,
    deleteTrajet,
    updateTrajet,
    clearError
} from "../../features/TrajetSlice";

import TrajetModal from "../../components/ui/TrajetModal";
import TrajetDetailModal from "../../components/ui/DetailsModal";

const TrajetPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingTrajet, setEditingTrajet] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTrajet, setSelectedTrajet] = useState(null);


    const dispatch = useDispatch();
    const { trajets, pagination, loading, error } = useSelector(
        (state) => state.trajets
    );

    useEffect(() => {
        dispatch(fetchAllTrajets({ page: currentPage, limit: 10 }));
    }, [dispatch, currentPage]);

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleOpenDetails = (trajet) => {
        setSelectedTrajet(trajet);
        setShowDetailModal(true);
    };

    const handleCloseDetails = () => {
        setSelectedTrajet(null);
        setShowDetailModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTrajet(null);
    };

    const handleEdit = (trajet) => {
        setEditingTrajet(trajet);
        setShowModal(true);
    };

    const handleDelete = async (id) => {

        await dispatch(deleteTrajet(id));


    };

    //   const handleStatusChange = async (id, newStatus) => {
    //     await dispatch(updateTrajet({ id, data: { statut: newStatus } }));
    //     dispatch(fetchAllTrajets({ page: currentPage, limit: 10 }));
    //   };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSaveTrajet = async (data) => {
        if (editingTrajet) {
            await dispatch(updateTrajet({ id: editingTrajet._id, data }));
        } else {
            await dispatch(createTrajet(data));
        }
        handleCloseModal();
        dispatch(fetchAllTrajets({ page: currentPage, limit: 10 }));
    };

    const stats = {
        total: pagination?.totalTrajets || 0,
        aFaire: trajets.filter(t => t.statut === "À faire").length,
        enCours: trajets.filter(t => t.statut === "En cours").length,
        termine: trajets.filter(t => t.statut === "Terminé").length
    };

    const getStatusClass = (statut) => {
        switch (statut) {
            case "À faire": return "warning";
            case "En cours": return "info";
            case "Terminé": return "success";
            default: return "";
        }
    };

    const filteredTrajets = trajets.filter(trajet => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            trajet.pointDepart?.toLowerCase().includes(search) ||
            trajet.pointArrivee?.toLowerCase().includes(search) ||
            trajet.chauffeur?.nom?.toLowerCase().includes(search) ||
            trajet.statut?.toLowerCase().includes(search)
        );
    });

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    return (
        <div className="trajet-page">
            {/* Header */}
            <div className="trajet-header">
                <h2>Gestion des Trajets</h2>
                <button className="btn-primary" onClick={handleOpenModal}>
                    <i className="fas fa-plus"></i> Ajouter Trajet
                </button>
            </div>

            {/* Stats */}
            <div className="trajet-stats">
                <div className="stat-card">
                    <h3>Total Trajets</h3>
                    <p>{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>À faire</h3>
                    <p className="warning">{stats.aFaire}</p>
                </div>
                <div className="stat-card">
                    <h3>En cours</h3>
                    <p className="info">{stats.enCours}</p>
                </div>
                <div className="stat-card">
                    <h3>Terminé</h3>
                    <p className="success">{stats.termine}</p>
                </div>
            </div>

            {/* Table */}
            <div className="trajet-table-card">
                <div className="table-header">
                    <h3>Liste des Trajets</h3>
                    <input
                        type="text"
                        placeholder="Rechercher un trajet..."
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
                ) : filteredTrajets.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-inbox"></i>
                        <p>{searchTerm ? "Aucun résultat trouvé" : "Aucun trajet trouvé"}</p>
                    </div>
                ) : (
                    <>
                        <table className="trajet-table">
                            <thead>
                                <tr>
                                    <th>Départ</th>
                                    <th>Arrivée</th>
                                    <th>Chauffeur</th>
                                    <th>Date Départ</th>
                                    <th>Kilométrage</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrajets.map((trajet) => (
                                    <tr key={trajet._id}>
                                        <td>{trajet.pointDepart}</td>
                                        <td>{trajet.pointArrivee}</td>
                                        <td>{trajet.chauffeur?.name || "-"}</td>
                                        <td>{formatDate(trajet.dateDepart)}</td>
                                        <td>
                                            {trajet.kmDepart !== null && trajet.kmArrivee !== null
                                                ? `${(trajet.kmArrivee - trajet.kmDepart).toLocaleString()} km`
                                                : trajet.kmDepart !== null
                                                    ? `${trajet.kmDepart.toLocaleString()} km (départ)`
                                                    : "-"}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusClass(trajet.statut)}`}>
                                                {trajet.statut}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            {/* <select
                        value={trajet.statut}
                        onChange={(e) =>
                          handleStatusChange(trajet._id, e.target.value)
                        }
                        className={`status-select-${getStatusClass(trajet.statut)}`}
                      >
                        <option value="À faire">À faire</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                      </select> */}
                                            <button
                                                className="icon-btn view"
                                                onClick={() => handleOpenDetails(trajet)}
                                                title="Voir détails"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>

                                            {trajet.statut === "À faire" ? (
                                                <button
                                                    className="icon-btn edit"
                                                    onClick={() => handleEdit(trajet)}
                                                    title="Modifier"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            ) : null}

                                            <button
                                                className="icon-btn delete"
                                                onClick={() => handleDelete(trajet._id)}
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
                                    disabled={!pagination.hasPrev || loading}
                                    className="pagination-btn"
                                >
                                    <i className="fas fa-chevron-left"></i> Précédent
                                </button>

                                <span className="pagination-info">
                                    Page {pagination.currentPage} sur {pagination.totalPages}
                                    ({pagination.totalItems} trajets)
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.hasNext || loading}
                                    className="pagination-btn"
                                >
                                    Suivant <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <TrajetModal
                isOpen={showModal}
                onClose={handleCloseModal}
                trajet={editingTrajet}
                onSave={handleSaveTrajet}
            />
            <TrajetDetailModal
                isOpen={showDetailModal}
                onClose={handleCloseDetails}
                trajet={selectedTrajet}
            />

        </div>
    );
};

export default TrajetPage;