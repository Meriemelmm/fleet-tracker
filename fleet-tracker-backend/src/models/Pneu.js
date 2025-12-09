import mongoose from 'mongoose'
const pneuSchema = new mongoose.Schema({
    vehiculeType:{type:String,required:true,enum:["Camion","Remorque"]},
  vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion', required: true },
  position: { type: String, required: true },
  marque: { type: String },
  dateInstallation: { type: Date, default: Date.now },
  kilometrageInstallation: { type: Number, required: true },
  statut: { type: String, enum: ['bon', 'moyen', 'usé', 'remplacé'], default: 'bon' }
}, { timestamps: true });
export default mongoose.model('Pneu', PneuSchema);