import ConferenceBooking from '../models/conferenceBooking.js';
import Conference from '../models/conference.js';

export const createConferenceBooking = async (req, res) => {
  try {
    const conferenceId = req.body.conference_id;
    let conferenceSnapshot = {};
    if (conferenceId) {
      const conference = await Conference.findByPk(conferenceId);
      if (conference) {
        conferenceSnapshot = {
          conference_name: conference.name,
          conference_price: conference.price,
          conference_size: conference.size,
          conference_max_users: conference.max_users,
          conference_amenities: conference.amenities,
          conference_image_urls: conference.image_urls,
          conference_description: conference.description,
        };
      }
    }

    const payload = { ...conferenceSnapshot, ...req.body };
    const booking = await ConferenceBooking.create(payload);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllConferenceBookings = async (req, res) => {
  const bookings = await ConferenceBooking.findAll();
  res.json(bookings);
};

export const getConferenceBookingById = async (req, res) => {
  try {
    const booking = await ConferenceBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateConferenceBooking = async (req, res) => {
  try {
    const booking = await ConferenceBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });

    const newConferenceId = req.body.conference_id ?? booking.conference_id;
    let conferenceSnapshot = {};
    if (newConferenceId) {
      const conference = await Conference.findByPk(newConferenceId);
      if (conference) {
        conferenceSnapshot = {
          conference_name: conference.name,
          conference_price: conference.price,
          conference_size: conference.size,
          conference_max_users: conference.max_users,
          conference_amenities: conference.amenities,
          conference_image_urls: conference.image_urls,
          conference_description: conference.description,
        };
      }
    }

    const updatedPayload = { ...booking.toJSON(), ...conferenceSnapshot, ...req.body };
    await ConferenceBooking.update(updatedPayload, { where: { id: req.params.id } });
    const updatedBooking = await ConferenceBooking.findByPk(req.params.id);
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteConferenceBooking = async (req, res) => {
  try {
    const deleted = await ConferenceBooking.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
