import { response } from 'express';
import AdminService from '../service/AdminService.js'
 class AdminController{
 createChauffeur= async(req,res,next)=>{

try{
    const data=req.body;
    console.log("test",data);
 const Chauffeur= await AdminService.createChauffeur(data);
 res.status(201).json({
    succes:true,
    message:"Chauffeur created",
    data:{
       
        name:Chauffeur.name,
        email:Chauffeur.email,
        role:Chauffeur.role
    }
 })


}
catch(error){
 res.status(500).json({
    succes:false,
    message:"Servor Error",
    error:error.message
 })
}

 }
 getAllChauffeurs=async(req,res,next)=>{
    try{
        const Chauffeurs= await AdminService.getAllChauffeurs();
        if(Chauffeurs.length===0){
            res.status(404).json({
                succes:false,
                message:"No Chauffeurs found"
            })
        }
        res.status(200).json({
            succes:true,
            message:"Liste des Chauffeurs",
            data:Chauffeurs
        })

    }
    catch(errror){
        res.status(500).json({
            succes:false,
            message:"Server Error",
            error:error.message
        })
    }

 }
 deleteChauffeur=async(req,res,next)=>{
    const id = req.params.id;
const Chauffeur= await AdminService.deleteChauffeur(id);
if(!Chauffeur){
    res.status(404).json({
        succes:false,
        message:"Chauffeur not found"
    })
}
res.status(200).json({
    succes:true,
    message:"Chauffeur deleted",
  
    
})

 }




 }
 export default new AdminController();