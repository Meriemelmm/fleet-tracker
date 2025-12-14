import { useState, useEffect } from "react";

const RemorqueModal = ({ isOpen, onClose, onSave, remorque }) => {
  const [formData, setFormData] = useState({
    immatriculation: "",
    type: "Frigorifique",
    status: "disponible"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (remorque) {
      setFormData({
        immatriculation: remorque.immatriculation || "",
        type: remorque.type || "Frigorifique",
        status: remorque.status || "disponible"
      });
    } else {
      setFormData({
        immatriculation: "",
        type: "Frigorifique",
        status: "disponible"
      });
    }
  }, [remorque]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = "L'immatriculation est requise";
    } else if (!/^[A-Z0-9\-\s]+$/i.test(formData.immatriculation)) {
      newErrors.immatriculation = "Format d'immatriculation invalide (lettres, chiffres et tirets uniquement)";
    }
    
    if (!formData.type.trim()) {
      newErrors.type = "Le type est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{remorque ? "Modifier la Remorque" : "Ajouter une Remorque"}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="required">Immatriculation</label>
              <input
                type="text"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleInputChange}
                className={errors.immatriculation ? "error" : ""}
                placeholder="Ex: 1234-A-56"
              />
              {errors.immatriculation && (
                <span className="error-message">{errors.immatriculation}</span>
              )}
            </div>

            <div className="form-group">
              <label className="required">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={errors.type ? "error" : ""}
              >
                <option value="Frigorifique">Frigorifique</option>
                <option value="Bâchée">Bâchée</option>
                <option value="Plateau">Plateau</option>
                <option value="Citerne">Citerne</option>
                <option value="Porte-conteneur">Porte-conteneur</option>
              </select>
              {errors.type && (
                <span className="error-message">{errors.type}</span>
              )}
            </div>

            <div className="form-group">
              <label>Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="disponible">Disponible</option>
                <option value="en_service">En Service</option>
                <option value="en_maintenance">En Maintenance</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {remorque ? "Modifier" : "Ajouter"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemorqueModal;