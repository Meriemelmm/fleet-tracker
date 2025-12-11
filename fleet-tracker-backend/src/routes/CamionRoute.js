import express from 'express';
import CamionController from '../controllers/camionController.js';

const router = express.Router();


router.get('/', CamionController.getAllCamions);


router.get('/:id', CamionController.getCamion);


router.post('/', CamionController.createCamion);

router.put('/:id', CamionController.updateCamion);


router.delete('/:id', CamionController.deleteCamion);

export default router;
