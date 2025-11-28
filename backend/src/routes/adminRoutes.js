import express from 'express';
import { getAllUsers, deleteUser, getAdminDetails } from '../controllers/adminController.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin, canView } from '../middlewares/authorize.js';
const router = express.Router();
// Get current admin details
router.get('/me', auth, canView, getAdminDetails);
router.get('/users', auth, canView, getAllUsers);
router.delete('/users/:id', auth, isAdmin, deleteUser);

export default router;