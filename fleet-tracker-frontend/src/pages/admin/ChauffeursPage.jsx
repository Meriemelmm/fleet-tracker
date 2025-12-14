import { useState, useEffect } from "react";
import "../../styles/admin/chauffeur.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchChauffeurs, createChauffeur, deleteChauffeur } from "../../features/chauffeurSlice";
import ChauffeurModal from "../../components/ui/ChauffeurModal ";

const ChauffeursPage = () => {
  const [showModal, setShowModal] = useState(false);
 
  
  const dispatch = useDispatch();
  const { chauffeurs, pagination, loading, error } = useSelector(state => state.chauffeurs);
  const [currentPage, setCurrentPage] = useState(1);

 
  useEffect(() => {
    dispatch(fetchChauffeurs({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  console.log("chauffeurs:", chauffeurs);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    
  };

  const handleDelete = async (id) => {
    console.log("id de chauffeur",id);
    
      dispatch(deleteChauffeur(id));
    
  };



 

  const stats = {
    total: pagination?.totalItems || chauffeurs.length,
    actifs: chauffeurs.filter(c => c.statut === "actif").length,
    inactifs: chauffeurs.filter(c => c.statut === "inactif").length,
    en_conge: chauffeurs.filter(c => c.statut === "en_conge").length
  };

 


  return (
    <div className="chauffeur-page">
      {/* Header section */}
      <div className="chauffeur-header">
        <h2>Gestion des Chauffeurs</h2>
        <button className="btn-primary" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Ajouter Chauffeur
        </button>
      </div>

      {/* Stats */}
      <div className="chauffeur-stats">
        <div className="stat-card">
          <h3>Total Chauffeurs</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Actifs</h3>
          <p className="success">{stats.actifs}</p>
        </div>
        <div className="stat-card">
          <h3>Inactifs</h3>
          <p className="danger">{stats.inactifs}</p>
        </div>
        <div className="stat-card">
          <h3>En Congé</h3>
          <p className="warning">{stats.en_conge}</p>
        </div>
      </div>

      {/* Table */}
      <div className="chauffeur-table-card">
        <div className="table-header">
          <h3>Liste des Chauffeurs</h3>
          <input
            type="text"
            placeholder="Rechercher un chauffeur..."
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
            <p>{typeof error === 'string' ? error : error?.message || 'Une erreur est survenue'}</p>
          </div>
        ) : chauffeurs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Aucun chauffeur trouvé</p>
          </div>
        ) : (
          <table className="chauffeur-table">
            <thead>
              <tr>
                <th>Nom Complet</th>
              
                <th>Email</th>
                  <th>Role</th>
                {/* <th>Permis</th> */}
              
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chauffeurs.map((chauffeur) => (
                <tr key={chauffeur._id}>
                  <td><strong>{chauffeur.name} </strong></td>
                
                  <td>{chauffeur.email }</td>
                    <td>{chauffeur.role }</td>
                 
                
                  <td className="actions">
                    {/* <button className="icon-btn edit" >
                      <i className="fas fa-edit"></i>
                    </button> */}
                    <button 
                      className="icon-btn delete"
                      onClick={() => handleDelete(chauffeur._id)}
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

      <ChauffeurModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={(data) => {
          dispatch(createChauffeur(data));
          handleCloseModal();
        }}
      
      />
    </div>
  );
};

export default ChauffeursPage;