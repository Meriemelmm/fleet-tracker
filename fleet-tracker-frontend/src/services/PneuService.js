import api from '../config/axios'

const pneuService = {
 
  createPneu: async (pneuData) => {
    try {
      const response = await api.post('/pneus', pneuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 
  getAllPneus: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/pneus', {
        params: { page, limit }
      });
      return response.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPneuById: async (id) => {
    try {
      const response = await api.get(`/pneus/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  updatePneu: async (id, pneuData) => {
    try {
      const response = await api.put(`/pneus/${id}`, pneuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 
  deletePneu: async (id) => {
    try {
      const response = await api.delete(`/pneus/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default pneuService;