import express from 'express';
import { createContactMessage, getAllContactMessages, deleteContactMessage } from '../controllers/contactController.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin, canView } from '../middlewares/authorize.js';

const router = express.Router();

// Public endpoint to submit a contact message
router.post('/', createContactMessage);

// Admin endpoints
router.get('/', auth, canView, getAllContactMessages);
router.delete('/:id', auth, isAdmin, deleteContactMessage);

export default router;
