import "../../styles/admin/trajetDetailsModal.css";

const TrajetDetailsModal = ({ isOpen, onClose, trajet }) => {
    if (!isOpen || !trajet) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Détails du Trajet</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-row">
                        <span>Départ :</span>
                        <p>{trajet.pointDepart}</p>
                    </div>

                    <div className="detail-row">
                        <span>Arrivée :</span>
                        <p>{trajet.pointArrivee}</p>
                    </div>

                    <div className="detail-row">
                        <span>Chauffeur :</span>
                        <p>{trajet.chauffeur?.name || "-"}</p>
                    </div>

                    <div className="detail-row">
                        <span>Date départ :</span>
                        <p>{trajet.dateDepart ? new Date(trajet.dateDepart).toLocaleDateString("fr-FR") : "-"}</p>
                    </div>

                    <div className="detail-row">
                        <span>KM départ :</span>
                        <p>{trajet.kmDepart ?? "-"}</p>
                    </div>

                    <div className="detail-row">
                        <span>KM arrivée :</span>
                        <p>{trajet.kmArrivee ?? "-"}</p>
                    </div>

                    <div className="detail-row">
                        <span>Statut :</span>
                        <p className={`badge ${trajet.statut}`}>
                            {trajet.statut}
                        </p>
                    </div>

                    {trajet.description && (
                        <div className="detail-row">
                            <span>Description :</span>
                            <p>{trajet.description}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrajetDetailsModal;
