import mongoose from 'mongoose'
const RemorqueShema = new mongoose.Schema({
 immatriculation:{
    type:String,
    required:true,
    unique:true,
 },
 type:{
    type:String,
    required:true,
 }
 ,
 status:{
    type:String,
    enum:['disponible','en_service','en_maintenance'],
    default:'disponible',
    required:true
 }




},
    
{ timestamps: true })
module.exports=mongoose.model("Remorque",RemorqueShema)