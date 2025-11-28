import express from 'express';
import { getAllLodgings, getLodgingById, createLodging, updateLodging, deleteLodging } from '../controllers/lodgingController.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', getAllLodgings);
router.get('/:id', getLodgingById);
router.post('/', auth, createLodging);
router.put('/:id', auth, updateLodging);
router.delete('/:id', auth, deleteLodging);

export default router;
