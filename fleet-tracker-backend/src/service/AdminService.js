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
password:hashedPassword,


 })
 return { user, tempPassword };
 

 }
 async getAllChauffeurs(page = 1, limit = 10) {
    
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

   
    const total = await User.countDocuments({ deletedAt: null, role: 'chauffeur' });

    const chauffeurs = await User.find({ role: 'chauffeur', deletedAt: null })
        .select('name email role')
        .skip(skip)
        .limit(limit); 

    return {
        chauffeurs, 
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };
}

 async deleteChauffeur(id){
    const Chauffeur= await User.findByIdAndUpdate(id,{deletedAt:new Date()},{new:true});
    return Chauffeur;
 }







 }
 export default new AdminService();