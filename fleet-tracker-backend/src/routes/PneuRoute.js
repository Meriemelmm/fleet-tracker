import express from 'express'
import PneuController from '../controllers/PneuController.js'
const router=express.Router();
router.get('/',PneuController.getAllPneus);
router.get('/:id',PneuController.getPneuById);

router.post('/',PneuController.createPneu);
router.put('/:id',PneuController.updatePneu);
router.delete('/:id', PneuController.deletePneu);

 export default router;