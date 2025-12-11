
import express from 'express'

import RemorqueController from "../controllers/RemorqueController.js"
const router=express.Router();
router.get('/',RemorqueController.getAllRemorques);
router.get('/:id',RemorqueController.getRemorqueById);
router.post('/', RemorqueController.createRemorque);
router.put('/:id',RemorqueController.updateRemorque);
router.delete('/:id',RemorqueController.deleteRemorque);
export default router;
