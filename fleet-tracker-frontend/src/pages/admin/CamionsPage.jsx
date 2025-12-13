import { useState, useEffect } from "react";
import "../../styles/admin/camion.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamions,createCamion, deleteCamion, updateCamion } from "../../features/camionSlice";
import CamionModal from "../../components/ui/CamionModal";

const CamionPage = () => {
  const [showModal, setShowModal] = useState(false);
    const [editingCamion, setEditingCamion] = useState(null);
  
  //   {
  //     _id: "1",
  //     immatriculation: "1234-A-56",
  //     marque: "Volvo",
  //     modele: "FH16",
  //     annee: 2022,
  //     kilometrageActuel: 150000,
  //     status: "disponible",
  //     createdAt: "2023-01-15",
  //     updatedAt: "2023-06-20"
  //   },
  //   {
  //     _id: "2",
  //     immatriculation: "7890-B-21",
  //     marque: "Mercedes",
  //     modele: "Actros",
  //     annee: 2021,
  //     kilometrageActuel: 200000,
  //     status: "en_maintenance",
  //     createdAt: "2022-11-10",
  //     updatedAt: "2023-07-05"
  //   },
  //   {
  //     _id: "3",
  //     immatriculation: "5678-C-34",
  //     marque: "Scania",
  //     modele: "R500",
  //     annee: 2023,
  //     kilometrageActuel: 80000,
  //     status: "en_service",
  //     createdAt: "2023-03-22",
  //     updatedAt: "2023-08-12"
  //   }
  // ]);

   const dispatch = useDispatch();
  const { camions,pagination, loading, error } = useSelector(state => state.camions);
  const [currentPage, setCurrentPage] = useState(1);
  

  useEffect(() => {
    dispatch(fetchCamions({currentPage,limit:10}));
  }, [dispatch]);
  console.log("camions hdh",camions);
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    kilometrageActuel: 0,
    status: "disponible"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = "L'immatriculation est requise";
    } else if (!/^[A-Z0-9\-\s]+$/i.test(formData.immatriculation)) {
      newErrors.immatriculation = "Format d'immatriculation invalide";
    }
    
    if (!formData.marque.trim()) {
      newErrors.marque = "La marque est requise";
    }
    
    if (!formData.modele.trim()) {
      newErrors.modele = "Le modèle est requis";
    }
    
    if (!formData.annee) {
      newErrors.annee = "L'année est requise";
    } else if (formData.annee < 2000 || formData.annee > new Date().getFullYear()) {
      newErrors.annee = `L'année doit être entre 2000 et ${new Date().getFullYear()}`;
    }
    
    if (formData.kilometrageActuel < 0) {
      newErrors.kilometrageActuel = "Le kilométrage ne peut pas être négatif";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setShowModal(true);
    
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      immatriculation: "",
      marque: "",
      modele: "",
      annee: new Date().getFullYear(),
      kilometrageActuel: 0,
      status: "disponible"
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "annee" || name === "kilometrageActuel" 
        ? parseInt(value) || 0 
        : value
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
      // Simuler un appel API
     
      
      const newCamion = {
        
        ...formData,
        
      };
      console.log("new camion",newCamion);
      dispatch(createCamion(newCamion));
      
     
      handleCloseModal();
      
    
    } catch (error) {
      console.error("Erreur lors de l'ajout du camion:", error);
     
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
   
    dispatch(deleteCamion(id));
   
    
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
                  <button className="icon-btn edit"onClick={() => handleEdit(camion)}>
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
      </div>
      <CamionModal
  isOpen={showModal}
  onClose={() => { setShowModal(false); setEditingCamion(null); }}
  onSave={(data) => {
    if (editingCamion) {
      dispatch(updateCamion({ id: editingCamion._id,data }));
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