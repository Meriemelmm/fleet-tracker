import mongoose from 'mongoose'
const TrajetSchema= new mongoose.Schema({

    camionId:{type:mongoose.Schema.Types.ObjectId,ref:'Camion',required:true},
    remorqueId:{type:mongoose.Schema.Types.ObjectId,ref:'Remorque',required:true},
    chauffeur:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
     pointDepart: { type: String, required: true },      
  pointArrivee: { type: String, required: true },      
  destination: { type: String },                        
  dateDepart: { type: Date, required: true },          
  dateArrivee: { type: Date },                          
  kmDepart: { type: Number },                           
  kmArrivee: { type: Number },                          
  gasoilConsomme: { type: Number },                    
  statut: { type: String, enum: ['À faire', 'En cours', 'Terminé'], default: 'À faire' }
//     remarques ?
  
   
},
{ timestamps: true })
module.exports=mongoose.model("Trajet",TrajetSchema);