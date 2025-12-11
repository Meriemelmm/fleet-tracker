import mongoose from 'mongoose'
const pneuSchema = new mongoose.Schema({
  vehiculeType: {
    type: String,
    required: true,
    enum: ["Camion", "Remorque"]
  },

  vehiculeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "vehiculeType"   
  },

  position: { type: String, required: true },
  marque: { type: String },
  dateInstallation: { type: Date, default: Date.now },
  kilometrageInstallation: { type: Number, required: true },
  statut: { type: String, enum: ['bon', 'moyen', 'usé', 'remplacé'], default: 'bon' },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });
export default mongoose.model('Pneu', pneuSchema);
