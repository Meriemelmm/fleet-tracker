import api from '../config/axios'

const remorqueService = {
  // GET /remorques - Récupérer toutes les remorques
  getAllRemorque: async () => {
    try {
      const response = await api.get('/remorques');
      console.log('getAllRemorque - Full API response:', response.data);
      // L'API retourne: { success: true, data: [...], pagination: {...} }
      return response.data;
    } catch (error) {
      console.error('Error in getAllRemorque:', error);
      throw error;
    }
  },

  // GET /remorques/:id - Récupérer une remorque par ID
  getRemorqueById: async (id) => {
    try {
      const response = await api.get(`/remorques/${id}`);
      console.log('getRemorqueById - API response:', response.data);
      // L'API retourne: { success: true, data: {...} }
      return response.data;
    } catch (error) {
      console.error('Error in getRemorqueById:', error);
      throw error;
    }
  },

  // POST /remorques - Créer une nouvelle remorque
  createRemorque: async (data) => {
    try {
      console.log('createRemorque - Sending data:', data);
      const response = await api.post('/remorques', data);
      console.log('createRemorque - API response:', response.data);
      // L'API retourne: { success: true, message: "...", data: {...} }
      // On retourne uniquement l'objet remorque (response.data.data)
      return response.data.data;
    } catch (error) {
      console.error('Error in createRemorque:', error);
      throw error;
    }
  },

  // PUT /remorques/:id - Mettre à jour une remorque
  updateRemorque: async (id, data) => {
    try {
      console.log('updateRemorque - ID:', id, 'Data:', data);
      const response = await api.put(`/remorques/${id}`, data);
      console.log('updateRemorque - API response:', response.data);
      // L'API retourne: { success: true, message: "...", data: {...} }
      // On retourne uniquement l'objet remorque mis à jour
      return response.data.data;
    } catch (error) {
      console.error('Error in updateRemorque:', error);
      throw error;
    }
  },

  // DELETE /remorques/:id - Supprimer une remorque
  deleteRemorque: async (id) => {
    try {
      console.log('deleteRemorque - ID:', id);
      const response = await api.delete(`/remorques/${id}`);
      console.log('deleteRemorque - API response:', response.data);
      // L'API retourne: { success: true, message: "..." }
      return response.data;
    } catch (error) {
      console.error('Error in deleteRemorque:', error);
      throw error;
    }
  }
};

export default remorqueService;