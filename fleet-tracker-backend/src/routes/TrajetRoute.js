import express from 'express';
import TrajetController from '../controllers/TrajetController.js';
import auth from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// Routes Admin
router.post('/', auth, authorize('admin'), TrajetController.createTrajet);
router.get('/admin/all', auth, authorize('admin'), TrajetController.getAllTrajets);
router.put('/admin/:id', auth, authorize('admin'), TrajetController.updateTrajet);
router.delete('/admin/:id',auth,authorize('admin'), TrajetController.deleteTrajet);

// Routes Chauffeur
router.get('/mes-trajets', auth, authorize('chauffeur'), TrajetController.getMesTrajets);
router.put('/chauffeur/:id', auth, authorize('chauffeur'), TrajetController.updateMonTrajet);

export default router;
