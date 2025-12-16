import PneuService from '../service/PneuService.js'

class PneuController{

     createPneu=async(req,res,next)=>{
        try{
        
  const data=req.body;
  const pneu= await PneuService.createPneu(data);
  res.status(201).json({
    succes:true,
    message:"Pneu created",
    data:pneu
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
    getAllPneus = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; 
        const result = await PneuService.AllPneus(page, limit);

        if (result.pneus.length === 0) {
            return res.status(404).json({
                succes: false,
                message: "No pneus found"
            });
        }

        res.status(200).json({
            succes: true,
            message: "Liste de pneus",
            data: result.pneus,
            pagination: result.pagination
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Server Error",
            error: error.message
        });
    }
}

     getPneuById=async(req, res, next)=>{
        try{
            const id=req.params.id;
            
            const pneu= await PneuService.PneuById(id);
            if(!pneu){
                res.status(404).json({
                    succes:false,
                    message:"Pneu not found"
                })
            }
            res.status(200).json({
                succes:true,
                message:"Pneu found",
                data:pneu
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
     updatePneu=async(req,res,next)=>{
        try{

            const id=req.params.id;
            const data=req.body;
            const pneu= await PneuService.updatePneu(id, data);
            if(!pneu){
                res.status(404).json({
                    succes:false,
                    message:"Pneu not found"
                })
            }
            res.status(200).json({
                succes:true,
                message:"Pneu updated",
                data:pneu
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
     deletePneu=async(req,res,next)=>{
        try{
            console.log("hello delete pneu");
            console.log("id",req.params.id);
             const id=req.params.id;
             const pneu=await  PneuService.deletePneu(id);
            if(!pneu){
                res.status(404).json({
                    succes:false,
                    message:"Pneu not foound"
                })

            }
            res.status(200).json({
                succes:true,
                message:"Pneu deleted",
                data:pneu
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




}
export default  new PneuController();