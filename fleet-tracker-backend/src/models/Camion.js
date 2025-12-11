import mongoose from 'mongoose';

const CamionSchema = new mongoose.Schema(
    {
        immatriculation: {
            type: String,
            required: true,
             unique:true,
        },
        marque: {
            type: String,
            required: true
        },
        modele: {
            type: String,
            required: true
        },
        annee: {
            type: Number,
            required: true
        },
        kilometrageActuel: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['disponible', 'en_service', 'en_maintenance'],
            default: 'disponible', 
            required: true
        },
        deletedAt: {
  type: Date,
  default: null
}
       
        
    },
    { timestamps: true }
);

export default mongoose.model("Camion", CamionSchema);
