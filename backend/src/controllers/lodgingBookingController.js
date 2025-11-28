import LodgingBooking from '../models/lodgingBooking.js';
import Lodging from '../models/lodging.js';

export const createLodgingBooking = async (req, res) => {
  try {
    // fetch lodging snapshot from DB
    const lodgingId = req.body.lodging_id;
    let lodgingSnapshot = {};
    if (lodgingId) {
      const lodging = await Lodging.findByPk(lodgingId);
      if (lodging) {
        lodgingSnapshot = {
          room_name: lodging.name,
          room_type: lodging.type,
          room_occupancy: lodging.occupancy,
          room_price: lodging.price,
          room_amenities: lodging.amenities,
          room_image_urls: lodging.image_urls,
          room_description: lodging.description,
        };
      }
    }

    // allow frontend to send/override some snapshot fields
    const payload = { ...lodgingSnapshot, ...req.body };
    const booking = await LodgingBooking.create(payload);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLodgingBookings = async (req, res) => {
  const bookings = await LodgingBooking.findAll();
  res.json(bookings);
};

export const getLodgingBookingById = async (req, res) => {
  try {
    const booking = await LodgingBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateLodgingBooking = async (req, res) => {
  try {
    const booking = await LodgingBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });

    // If lodging_id changed or provided, refresh snapshot from DB
    let lodgingSnapshot = {};
    const newLodgingId = req.body.lodging_id ?? booking.lodging_id;
    if (newLodgingId) {
      const lodging = await Lodging.findByPk(newLodgingId);
      if (lodging) {
        lodgingSnapshot = {
          room_name: lodging.name,
          room_type: lodging.type,
          room_occupancy: lodging.occupancy,
          room_price: lodging.price,
          room_amenities: lodging.amenities,
          room_image_urls: lodging.image_urls,
          room_description: lodging.description,
        };
      }
    }

    // Merge snapshot, existing booking, and incoming updates (incoming overrides snapshot)
    const updatedPayload = { ...booking.toJSON(), ...lodgingSnapshot, ...req.body };
    await LodgingBooking.update(updatedPayload, { where: { id: req.params.id } });
    const updatedBooking = await LodgingBooking.findByPk(req.params.id);
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLodgingBooking = async (req, res) => {
  try {
    const deleted = await LodgingBooking.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
