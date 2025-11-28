import express from 'express';
import { getAllConferences, getConferenceById, createConference, updateConference, deleteConference } from '../controllers/conferenceController.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', getAllConferences);
router.get('/:id', getConferenceById);
router.post('/', auth, createConference);
router.put('/:id', auth, updateConference);
router.delete('/:id', auth, deleteConference);

export default router;
