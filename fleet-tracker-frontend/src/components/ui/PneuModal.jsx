import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCamions } from "../../features/camionSlice";
import { fetchRemorques } from "../../features/remorqueSlice";
import "../../styles/admin/pneuModal.css";

const PneuModal = ({ isOpen, onClose, onSave, pneu }) => {
  const dispatch = useDispatch();
  const { camions } = useSelector((state) => state.camions);
  const { remorques } = useSelector((state) => state.remorques);

  const defaultForm = {
    vehiculeType: "Camion",
    vehiculeId: "",
    position: "",
    marque: "",
    kilometrageInstallation: "",
    statut: "bon",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (pneu) {
        setFormData({
          vehiculeType: pneu.vehiculeType,
          vehiculeId: pneu.vehiculeId,
          position: pneu.position,
          marque: pneu.marque || "",
          kilometrageInstallation: pneu.kilometrageInstallation || "",
          statut: pneu.statut,
        });
      } else {
        setFormData(defaultForm); 
      }
    }
  }, [isOpen, pneu]);


  useEffect(() => {
    if (formData.vehiculeType === "Camion") {
      dispatch(fetchCamions({ page: 1, limit: 100 }));
    } else {
      dispatch(fetchRemorques({ page: 1, limit: 100 }));
    }
  }, [formData.vehiculeType, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehiculeId || !formData.position || !formData.kilometrageInstallation) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{pneu ? "Modifier Pneu" : "Ajouter Pneu"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type Véhicule</label>
            <select name="vehiculeType" value={formData.vehiculeType} onChange={handleChange}>
              <option value="Camion">Camion</option>
              <option value="Remorque">Remorque</option>
            </select>
          </div>

          <div className="form-group">
            <label>Véhicule</label>
            <select name="vehiculeId" value={formData.vehiculeId} onChange={handleChange} required>
              <option value="">-- Sélectionner --</option>
              {formData.vehiculeType === "Camion" &&
                camions?.map((c) => (
                  <option key={c._id} value={c._id}>{c.immatriculation}</option>
                ))}
              {formData.vehiculeType === "Remorque" &&
                remorques?.map((r) => (
                  <option key={r._id} value={r._id}>{r.immatriculation}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Position</label>
            <input name="position" value={formData.position} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Marque</label>
            <input name="marque" value={formData.marque} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Kilométrage Installation</label>
            <input
              type="number"
              name="kilometrageInstallation"
              value={formData.kilometrageInstallation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select name="statut" value={formData.statut} onChange={handleChange}>
              <option value="bon">Bon</option>
              <option value="moyen">Moyen</option>
              <option value="usé">Usé</option>
              <option value="remplacé">Remplacé</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">{pneu ? "Mettre à jour" : "Ajouter"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PneuModal;
