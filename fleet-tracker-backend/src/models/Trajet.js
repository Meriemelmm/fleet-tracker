import mongoose from 'mongoose'
const TrajetSchema = new mongoose.Schema({

  camionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion', required: true },
  remorqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Remorque', required: false },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pointDepart: { type: String, required: true },
  pointArrivee: { type: String, required: true },

  dateDepart: { type: Date, required: true },

  kmDepart: {
    type: Number,
    min: 0,
    default: null  // Rempli par chauffeur au départ
  },
  kmArrivee: {
    type: Number,
    min: 0,
    default: null  // Rempli par chauffeur à l'arrivée
  }, dateArrivee: {
    type: Date,
    default: null  // Rempli par chauffeur à l'arrivée
  }, remarques: {
    type: String,
    trim: true,
    default: null  // Admin peut ajouter des instructions
  },
  remarquesChauffeur: {
    type: String,
    trim: true,
    default: null  // Chauffeur ajoute ses observations
  },
  deletedAt: {
  type: Date,
  default: null
},

  statut: { type: String, enum: ['À faire', 'En cours', 'Terminé'], default: 'À faire' }



},
  { timestamps: true });
export default mongoose.model("Trajet", TrajetSchema);