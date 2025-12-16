import express from 'express';
const router=express.Router();
import ConsoController from '../controllers/ConsoController.js';
import authorize from '../middlewares/authorize.js';



router.post('/',authorize('chauffeur'),ConsoController.create);
router.get('/trajet/:id',authorize('chauffeur','admin'),ConsoController.getByTrajet);





export default router;