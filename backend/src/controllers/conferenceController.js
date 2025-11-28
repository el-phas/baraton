import Conference from '../models/conference.js';

export const getAllConferences = async (req, res, next) => {
  try {
    const conferences = await Conference.findAll();
    res.json(conferences);
  } catch (err) {
    next(err);
  }
};

export const getConferenceById = async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id);
    if (!conference) return res.status(404).json({ message: 'Not found' });
    res.json(conference);
  } catch (err) {
    next(err);
  }
};

export const createConference = async (req, res, next) => {
  try {
    const conference = await Conference.create(req.body);
    res.status(201).json(conference);
  } catch (err) {
    next(err);
  }
};

export const updateConference = async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id);
    if (!conference) return res.status(404).json({ message: 'Not found' });
    await conference.update(req.body);
    res.json(conference);
  } catch (err) {
    next(err);
  }
};

export const deleteConference = async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id);
    if (!conference) return res.status(404).json({ message: 'Not found' });
    await conference.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
