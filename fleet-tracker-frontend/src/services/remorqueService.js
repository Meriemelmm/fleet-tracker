import api from '../config/axios';
 const remorqueService={

getAllRemorque:(page=1,limit=10)=>{
    const response=api.get(`/remorques??page=${page}&limit=${limit}`);
    return  response.data;

},
getRemorqueById:(id)=>{
    const response=api.get(`/remorques/${id}`);
    return response.data;
} ,
createRemorque:(remorqueData)=>{
    const response=api.post('/remorques',remorqueData);
    return response.data;
},
updateRemorque:(id,remorqueData)=>{
    const response=api.put(`/remorques/${id}`,remorqueData);
    return response.data;
},
deleteRemorque:(id)=>{
    const response=api.delete(`/remorques/${id}`);
    return response.data;
}
  




}
export default remorqueService;