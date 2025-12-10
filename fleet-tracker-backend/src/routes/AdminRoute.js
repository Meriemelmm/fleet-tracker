import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();

router.get('/chauffeurs', AdminController.getAllChauffeurs);

router.post('/chauffeur', AdminController.createChauffeur);
router.delete('/chauffeur/:id',AdminController.deleteChauffeur);

export default router;
