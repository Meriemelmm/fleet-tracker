import Consommation from "../models/Consommation.js";
import Trajet from "../models/Trajet.js";

class ConsoService {

  
  async create(data, chauffeurId) {
   
    const trajet = await Trajet.findById(data.trajetId);

    
if (!trajet) throw new Error("Trajet non trouvé");




    return await Consommation.create(data);
  }

  






























































  async getByTrajet(trajetId) {
    return await Consommation.find({ trajetId })
      .sort({ date: -1 });
  }

 
  async getAll() {
    return await Consommation.find()
      .populate("trajetId")
      .sort({ createdAt: -1 });
  }


  async delete(id) {
    return await Consommation.findByIdAndDelete(id);
  }
}

export default new ConsoService();
