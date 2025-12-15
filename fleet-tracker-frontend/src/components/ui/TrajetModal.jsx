import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCamions } from "../../features/camionSlice";
import { fetchRemorques } from "../../features/remorqueSlice";
import { fetchChauffeurs } from "../../features/chauffeurSlice";

import "../../styles/admin/trajetModal.css";

const TrajetModal = ({ isOpen, onClose, onSave, trajet }) => {
  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */
  const { camions } = useSelector((state) => state.camions);
  const { remorques } = useSelector((state) => state.remorques);
  const { chauffeurs } = useSelector((state) => state.chauffeurs);

  /* ================= LOCAL STATE ================= */
  const [formData, setFormData] = useState({
    camionId: "",
    remorqueId: "",
    chauffeur: "",
    pointDepart: "",
    pointArrivee: "",
    dateDepart: "",
    dateArrivee: "",
    kmDepart: "",
    kmArrivee: "",
    remarques: "",
    remarquesChauffeur: "",
    statut: "À faire",
  });

  /* ================= FETCH SELECT DATA ================= */
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCamions({ page: 1, limit: 1000 }));
      dispatch(fetchRemorques({ page: 1, limit: 1000 }));
      dispatch(fetchChauffeurs({ page: 1, limit: 1000 }));
    }
  }, [dispatch, isOpen]);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (trajet) {
      setFormData({
        camionId: trajet.camionId?._id || "",
        remorqueId: trajet.remorqueId?._id || "",
        chauffeur: trajet.chauffeur?._id || "",
        pointDepart: trajet.pointDepart || "",
        pointArrivee: trajet.pointArrivee || "",
        dateDepart: trajet.dateDepart?.slice(0, 10) || "",
        dateArrivee: trajet.dateArrivee?.slice(0, 10) || "",
        kmDepart: trajet.kmDepart ?? "",
        kmArrivee: trajet.kmArrivee ?? "",
        remarques: trajet.remarques || "",
        remarquesChauffeur: trajet.remarquesChauffeur || "",
        statut: trajet.statut || "À faire",
      });
    }
  }, [trajet]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  /* ================= RENDER ================= */
  return (
    <div className="trajet-modal-overlay">
      <div className="trajet-modal-card">
        {/* ===== Header ===== */}
        <div className="trajet-modal-header">
          <h3>{trajet ? "Modifier Trajet" : "Ajouter Trajet"}</h3>
          <button className="trajet-close-btn" onClick={onClose}>×</button>
        </div>

        {/* ===== Form ===== */}
        <form className="trajet-modal-form" onSubmit={handleSubmit}>

          {/* Camion */}
          <div className="trajet-form-group">
            <label>Camion</label>
            <select
              name="camionId"
              value={formData.camionId}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner camion --</option>
              {camions.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.immatriculation} - {c.marque}
                </option>
              ))}
            </select>
          </div>

          {/* Remorque */}
          <div className="trajet-form-group">
            <label>Remorque</label>
            <select
              name="remorqueId"
              value={formData.remorqueId}
              onChange={handleChange}
            >
              <option value="">-- Aucune --</option>
              {remorques.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.immatriculation || r.marque}
                </option>
              ))}
            </select>
          </div>

          {/* Chauffeur */}
          <div className="trajet-form-group">
            <label>Chauffeur</label>
            <select
              name="chauffeur"
              value={formData.chauffeur}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner chauffeur --</option>
              {chauffeurs.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.nom} ({ch.email})
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div className="trajet-form-group">
            <label>Statut</label>
            <select name="statut" value={formData.statut} onChange={handleChange}>
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          {/* Points */}
          <div className="trajet-form-group">
            <label>Point de départ</label>
            <input name="pointDepart" value={formData.pointDepart} onChange={handleChange} />
          </div>

          <div className="trajet-form-group">
            <label>Point d'arrivée</label>
            <input name="pointArrivee" value={formData.pointArrivee} onChange={handleChange} />
          </div>

          {/* Dates */}
          <div className="trajet-form-group">
            <label>Date départ</label>
            <input type="date" name="dateDepart" value={formData.dateDepart} onChange={handleChange} />
          </div>

          <div className="trajet-form-group">
            <label>Date arrivée</label>
            <input type="date" name="dateArrivee" value={formData.dateArrivee} onChange={handleChange} />
          </div>

          {/* KM */}
          <div className="trajet-form-group">
            <label>KM départ</label>
            <input type="number" name="kmDepart" value={formData.kmDepart} onChange={handleChange} />
          </div>

          <div className="trajet-form-group">
            <label>KM arrivée</label>
            <input type="number" name="kmArrivee" value={formData.kmArrivee} onChange={handleChange} />
          </div>

          {/* Remarques */}
          <div className="trajet-form-group trajet">
            <label>Remarques (Admin)</label>
            <input name="remarques" value={formData.remarques} onChange={handleChange} />
          </div>

          <div className="trajet-form-group trajet">
            <label>Remarques Chauffeur</label>
            <input name="remarquesChauffeur" value={formData.remarquesChauffeur} onChange={handleChange} />
          </div>

          {/* Actions */}
          <div className="trajet-modal-actions">
            <button type="button" className="trajet-btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="trajet-btn-primary">
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TrajetModal;
