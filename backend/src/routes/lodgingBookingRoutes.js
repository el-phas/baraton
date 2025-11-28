import express from 'express';
import {
  createLodgingBooking,
  getAllLodgingBookings,
  getLodgingBookingById,
  updateLodgingBooking,
  deleteLodgingBooking
} from '../controllers/lodgingBookingController.js';

const router = express.Router();

// Create lodging booking
router.post('/', createLodgingBooking);

// Get all lodging bookings
router.get('/', getAllLodgingBookings);

// Get a single lodging booking by ID
router.get('/:id', getLodgingBookingById);

// Update a lodging booking by ID
router.put('/:id', updateLodgingBooking);

// Delete a lodging booking by ID
router.delete('/:id', deleteLodgingBooking);
// Delete a lodging booking by ID
router.delete('/:id', deleteLodgingBooking);

export default router;
