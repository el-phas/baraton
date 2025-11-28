import express from 'express';
import {
  createConferenceBooking,
  getAllConferenceBookings,
  getConferenceBookingById,
  updateConferenceBooking,
  deleteConferenceBooking
} from '../controllers/conferenceBookingController.js';

const router = express.Router();


// Create conference booking
router.post('/', createConferenceBooking);

// Get all conference bookings
router.get('/', getAllConferenceBookings);

// Get a single conference booking by ID
router.get('/:id', getConferenceBookingById);

// Update a conference booking by ID
router.put('/:id', updateConferenceBooking);

// Delete a conference booking by ID
router.delete('/:id', deleteConferenceBooking);

export default router;
