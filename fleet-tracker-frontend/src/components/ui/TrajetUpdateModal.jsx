import { useState } from "react";
import "../../styles/chauffeur/mestrajets.css";

const TrajetUpdateModal = ({ trajet, formData, setFormData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.kmDepart && isNaN(formData.kmDepart)) {
      newErrors.kmDepart = "Doit être un nombre";
    }
    
    if (formData.kmArrivee && isNaN(formData.kmArrivee)) {
      newErrors.kmArrivee = "Doit être un nombre";
    }
    
    if (formData.kmDepart && formData.kmArrivee) {
      if (parseFloat(formData.kmArrivee) <= parseFloat(formData.kmDepart)) {
        newErrors.kmArrivee = "Doit être supérieur au km de départ";
      }
    }
    
    if (formData.dateArrivee && formData.dateArrivee < trajet.dateDepart) {
      newErrors.dateArrivee = "Doit être après la date de départ";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Mettre à jour le trajet</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>Route: {trajet.pointDepart} → {trajet.pointArrivee}</h4>
          </div>

          <div className="form-grid">
            {/* Statut */}
            <div className="form-group">
              <label>Statut</label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className={errors.statut ? "error" : ""}
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
              {errors.statut && <span className="error-message">{errors.statut}</span>}
            </div>

            {/* Date d'arrivée */}
            <div className="form-group">
              <label>Date d'arrivée</label>
              <input
                type="datetime-local"
                name="dateArrivee"
                value={formData.dateArrivee}
                onChange={handleChange}
                className={errors.dateArrivee ? "error" : ""}
              />
              {errors.dateArrivee && <span className="error-message">{errors.dateArrivee}</span>}
            </div>

            {/* Km Départ */}
            <div className="form-group">
              <label>Km Départ</label>
              <input
                type="number"
                name="kmDepart"
                value={formData.kmDepart}
                onChange={handleChange}
                placeholder="Ex: 15000"
                min="0"
                step="1"
                className={errors.kmDepart ? "error" : ""}
              />
              {errors.kmDepart && <span className="error-message">{errors.kmDepart}</span>}
            </div>

            {/* Km Arrivée */}
            <div className="form-group">
              <label>Km Arrivée</label>
              <input
                type="number"
                name="kmArrivee"
                value={formData.kmArrivee}
                onChange={handleChange}
                placeholder="Ex: 15250"
                min="0"
                step="1"
                className={errors.kmArrivee ? "error" : ""}
              />
              {errors.kmArrivee && <span className="error-message">{errors.kmArrivee}</span>}
            </div>

            {/* Remarques chauffeur */}
            <div className="form-group full-width">
              <label>Observations (optionnel)</label>
              <textarea
                name="remarquesChauffeur"
                value={formData.remarquesChauffeur}
                onChange={handleChange}
                placeholder="Ajoutez vos observations..."
                rows="4"
              />
            </div>
          </div>

          <div className="info-note">
            <i className="fas fa-info-circle"></i>
            <span>Les champs en gras sont obligatoires lorsque le statut est "Terminé"</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrajetUpdateModal;