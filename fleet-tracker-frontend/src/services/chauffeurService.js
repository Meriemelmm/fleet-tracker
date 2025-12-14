import api from '../config/axios';

const chauffeurService = {
  // GET /admin/chauffeurs - Récupérer tous les chauffeurs avec pagination
  getAllChauffeurs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/chauffeurs?page=${page}&limit=${limit}`);
      console.log('getAllChauffeurs - API response:', response.data);
      console.log("hello");
      // L'API retourne: { success: true, data: [...], pagination: {...} }
      return response.data;
    } catch (error) {
      console.error('Error in getAllChauffeurs:', error);
      throw error;
    }
  },

 
  createChauffeur: async (data) => {
    try {
      console.log('createChauffeur - Sending data:', data);
      const response = await api.post('/admin/chauffeur', data);
      console.log('createChauffeur - API response:', response.data);
     
      return response.data.data;
    } catch (error) {
      console.error('Error in createChauffeur:', error);
      throw error;
    }
  },

  


  deleteChauffeur: async (id) => {
    try {
      console.log('deleteChauffeur - ID:', id);
      const response = await api.delete(`/admin/chauffeur/${id}`);
      console.log('deleteChauffeur - API response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error in deleteChauffeur:', error);
      throw error;
    }
  }
};

export default chauffeurService;