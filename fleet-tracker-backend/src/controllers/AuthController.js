import AuthService from '../service/AuthService.js'
class AuthController {


    login=async(req,res,next)=>{
 const  data=req.body;
 console.log(data);
 try{
    const user= await AuthService.login(data);
     res.status(200).json({
        succes:true,
       message:"Login successful",
       data:user
     })

 }
 catch(error){
    res.status(500).json({
        succes:false,
        message:"Server Error",
        error:error.message
    })
 }



    }
    logout=async(req,res,next)=>{
      



    }







}
export default new AuthController();