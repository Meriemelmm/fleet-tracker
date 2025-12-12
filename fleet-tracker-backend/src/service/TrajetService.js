import Trajet from '../models/Trajet.js';
import Camion from '../models/Camion.js';
import Remorque from '../models/Remorque.js';
import User from '../models/User.js';

class TrajetService {

  async createTrajet(trajetData) {
    const { camionId, remorqueId, chauffeur, statut } = trajetData;



    const chauffeurExists = await User.findById(chauffeur);
    console.log(" vefiication chauffeur", chauffeurExists);

    if (!chauffeurExists) throw new Error('Chauffeur non trouvé');


    const camion = await Camion.findById(camionId);
    if (!camion) throw new Error('Camion non trouvé');



    if (remorqueId) {
      const remorque = await Remorque.findById(remorqueId);
      if (!remorque) throw new Error('Remorque non trouvée');

    }


    if (statut && statut !== 'À faire') {
      throw new Error("Statut invalide : le statut doit être 'À faire' lors de la création");
    }

    return await Trajet.create(trajetData);
  }

  async AllTrajets(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const trajets = await Trajet.find({ deletedAt: null })
      .populate('camionId')
      .populate('remorqueId')
      .populate('chauffeur', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Trajet.countDocuments({ deletedAt: null });

    return {
      trajets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTrajets: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }


  async deleteTrajet(id) {
    const trajet = await Trajet.findById(id);
    if (!trajet) throw new Error('Trajet non trouvé');

    if (trajet.statut !== 'À faire') {
      throw new Error('Seuls les trajets À faire peuvent être supprimés');
    }

    return await Trajet.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
  }




  async getTrajetsByChauffeur(chauffeurId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    console.log("heeelelelelelel");

    console.log("hello");
    console.log(" id de chauffeur ", chauffeurId);
    const trajets = await Trajet.find({
      chauffeur: chauffeurId,
      deletedAt: null
    })
      .populate('camionId')
      .populate('remorqueId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Trajet.countDocuments({
      chauffeur: chauffeurId,
      deletedAt: null
    });

    return {
      trajets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTrajets: total
      }
    };
  }
async UpdateTrajetByAdmin(id, data) {

  console.log("data", data);


  const trajet = await Trajet.findById(id);
  if (!trajet) {
    throw new Error("Trajet non trouvé");
  }


  if (trajet.statut !== "À faire") {
    throw new Error("Seuls les trajets avec le statut 'À faire' peuvent être modifiés");
  }

  
  if (data.statut && data.statut !== "À faire") {
    throw new Error("L'admin ne peut changer le statut que lorsqu'il reste 'À faire'");
  }


  const allowedFields = [
    'statut',
    'remarques',
    'camionId',
    'remorqueId',
    'chauffeur',
    'pointDepart',
    'pointArrivee',
    'dateDepart'
  ];

  
  const updateData = {};
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  console.log("updateData", updateData);

 
  return await Trajet.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
}


async updateTrajetByChauffeur(id, chauffeurId, data) {
 

  const trajet = await Trajet.findOne({
    _id: id,
    chauffeur: chauffeurId
  });

  if (!trajet) throw new Error('Trajet non trouvé');

 
  const allowedFields = ['statut','dateArrivee','kmDepart','kmArrivee' ,'remarquesChauffeur'];
  const updateData = {};


  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  console.log("updateData", updateData);
  console.log("data", data);

  return await Trajet.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
}



}

export default new TrajetService();
