import api from '../config/axios'
const camionService={

    getAllCamions:async(page = 1, limit = 10)=>{
        const response= await api.get(`/camions?page=${page}&limit=${limit}`);
        return response.data;
        

    }
    ,
    getCamionById:async(id)=>{
        const response= await api.get(`/camions/${id}`);
        return response.data;
    },
    createCamion:async(camionData)=>{
        const response= await api.post('/camions',camionData);
       response("res1:",response.data.camion);
       response("res2",response.data.data);
       return response.data.data; 
    },
    updateCamion:async(id,camionData)=>{
        const response= await api.put(`/camions/${id}`,camionData);
        return response.data.data;
    },
    deleteCamion:async(id)=>{
        const response= await api.delete(`/camions/${id}`);
        return response.data;
    },
};
export default camionService;