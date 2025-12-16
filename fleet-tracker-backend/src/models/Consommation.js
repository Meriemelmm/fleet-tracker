import mongoose from 'mongoose';

const ConsommationSchema = new mongoose.Schema({
  trajetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet', required: true },
  
  date: { type: Date, required: true },
  typeCarburant: { type: String, required: true, enum: ["Essence", "Diesel"] },
  quantite: { type: Number, required: true },
  montant: { type: Number, required: true },
  kmAuRavitaillement: { type: Number },
  station: { type: String }
}, { timestamps: true });

export default mongoose.model("Consommation", ConsommationSchema);
