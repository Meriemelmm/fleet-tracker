import User   from '../models/User.js'
import generatePassword from '../utils/generatePassword.js'
import { hashPassword } from '../utils/hash.js';
import crypto from 'crypto';

 class AdminService {

 async createChauffeur(data){
 
 const {name,email,role}= data;
 const  exit=  await User.findOne({email:email});



  const tempPassword =generatePassword();
 
 
 const hashedPassword =await hashPassword(tempPassword);


 const user= await User.create({
name,
email,
role:role||'chauffeur',
password:hashedPassword

 })
 return user;
 

 }
 async getAllChauffeurs(){
    const Chauffeurs= await User.find({role:'chauffeur'}).select('name email role ');
    return Chauffeurs;
 }
 async deleteChauffeur(id){
    const Chauffeur= await User.findByIdAndUpdate(id,{deletedAt:new Date()},{new:true});
    return Chauffeur;
 }







 }
 export default new AdminService();