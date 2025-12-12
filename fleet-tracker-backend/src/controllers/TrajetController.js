import TrajetService from '../service/TrajetService.js';

class TrajetController {
  // Admin - Créer trajet
  createTrajet = async (req, res) => {
  
    try {
      const trajet = await TrajetService.createTrajet(req.body);
      res.status(201).json({
        success: true,
        message: 'Trajet créé avec succès',
        data: trajet
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
   // Admin - Tous les trajets avec pagination
  getAllTrajets = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await TrajetService.AllTrajets(page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Liste des trajets',
        data: result.trajets,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

 // Admin - Supprimer trajet (seulement "À faire")
  deleteTrajet = async (req, res) => {
    console.log("hello meriem ");
    try {
      console.log("trajetId",req.params.id);
      await TrajetService.deleteTrajet(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Trajet supprimé avec succès'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
   // Chauffeur - Ses trajets
  getMesTrajets = async (req, res) => {
    console.log("hello meriem el mecaniqui");
    console.log("user id", req.user._id);
    console.log("user role", req.user.role);
    console.log("id de t")  ;    
      try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await TrajetService.getTrajetsByChauffeur(req.user._id, page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Mes trajets',
        data: result.trajets,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  // Admin - Modifier trajet (seulement "À faire")
  updateTrajet = async (req, res) => {
    console.log("hello meriem el mecaniqui");
    
    try {
      const  id=req.params.id;
      console.log("id de trajet ",id);
      const  data=req.body;
      const trajet = await TrajetService.UpdateTrajetByAdmin(id,data);
      res.status(200).json({
        success: true,
        message: 'Trajet modifié avec succès',
        data: trajet
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
























 

  

 

  

  // Chauffeur - Modifier ses trajets
  updateMonTrajet = async (req, res) => {
    console.log("hello  updateMonTrajet");
    try {
      const trajet = await TrajetService.updateTrajetByChauffeur(
        req.params.id, 
        req.user._id, 
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: 'Trajet modifié avec succès',
        data: trajet
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new TrajetController();
