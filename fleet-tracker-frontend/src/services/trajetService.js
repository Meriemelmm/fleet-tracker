// services/trajetService.js
import api from '../config/axios';

const trajetService = {

  // Créer un trajet
  createTrajet: async (trajetData) => {
    try {
      const response = await api.post('/trajets', trajetData);
      console.log("response de post",response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer tous les trajets (admin)
  getAllTrajets: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/trajets/admin/all', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un trajet par ID
  getTrajetById: async (id) => {
    try {
      const response = await api.get(`/trajets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un trajet (admin)
  updateTrajet: async (id, trajetData) => {
    try {
      const response = await api.put(`/trajets/admin/${id}`, trajetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 
  deleteTrajet: async (id) => {
    try {
      const response = await api.delete(`/trajets/admin/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 
  getMesTrajets: async () => {
    try {
      const response = await api.get('/trajets/mes-trajets');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  
  updateMonTrajet: async (id, trajetData) => {
    try {
      const response = await api.put(`/trajets/chauffeur/${id}`, trajetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

};

export default trajetService;
