import React, { useState, useEffect } from "react";
import "../../styles/admin/camion.css";

const CamionModal = ({ isOpen, onClose, onSave, camion }) => {
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    kilometrageActuel: 0,
    status: "disponible",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Remplir le formulaire si on reçoit un camion pour l'édition
 useEffect(() => {
  if (camion) {
    setFormData({
      immatriculation: camion.immatriculation || "",
      marque: camion.marque || "",
      modele: camion.modele || "",
      annee: camion.annee || new Date().getFullYear(),
      kilometrageActuel: camion.kilometrageActuel || 0,
      status: camion.status || "disponible",
    });
  } else {
    setFormData({
      immatriculation: "",
      marque: "",
      modele: "",
      annee: new Date().getFullYear(),
      kilometrageActuel: 0,
      status: "disponible",
    });
  }
}, [camion, isOpen]);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.immatriculation.trim()) newErrors.immatriculation = "L'immatriculation est requise";
    if (!formData.marque.trim()) newErrors.marque = "La marque est requise";
    if (!formData.modele.trim()) newErrors.modele = "Le modèle est requis";
    if (!formData.annee || formData.annee < 2000 || formData.annee > new Date().getFullYear())
      newErrors.annee = `L'année doit être entre 2000 et ${new Date().getFullYear()}`;
    if (formData.kilometrageActuel < 0) newErrors.kilometrageActuel = "Le kilométrage ne peut pas être négatif";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "annee" || name === "kilometrageActuel" ? parseInt(value) || 0 : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    onSave(formData); // Appel du callback parent
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{camion ? "Modifier le camion" : "Ajouter un nouveau camion"}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Immatriculation *</label>
              <input type="text" name="immatriculation" value={formData.immatriculation} onChange={handleInputChange} className={errors.immatriculation ? "error" : ""} />
              {errors.immatriculation && <span className="error-message">{errors.immatriculation}</span>}
            </div>

            <div className="form-group">
              <label>Marque *</label>
              <input type="text" name="marque" value={formData.marque} onChange={handleInputChange} className={errors.marque ? "error" : ""} />
              {errors.marque && <span className="error-message">{errors.marque}</span>}
            </div>

            <div className="form-group">
              <label>Modèle *</label>
              <input type="text" name="modele" value={formData.modele} onChange={handleInputChange} className={errors.modele ? "error" : ""} />
              {errors.modele && <span className="error-message">{errors.modele}</span>}
            </div>

            <div className="form-group">
              <label>Année *</label>
              <input type="number" name="annee" value={formData.annee} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} className={errors.annee ? "error" : ""} />
              {errors.annee && <span className="error-message">{errors.annee}</span>}
            </div>

            <div className="form-group">
              <label>Kilométrage Actuel *</label>
              <input type="number" name="kilometrageActuel" value={formData.kilometrageActuel} onChange={handleInputChange} min="0" className={errors.kilometrageActuel ? "error" : ""} />
              {errors.kilometrageActuel && <span className="error-message">{errors.kilometrageActuel}</span>}
            </div>

            <div className="form-group">
              <label>Statut *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="disponible">Disponible</option>
                <option value="en_service">En Service</option>
                <option value="en_maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">{isSubmitting ? "En cours..." : camion ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CamionModal;
