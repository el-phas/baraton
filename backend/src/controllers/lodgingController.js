import Lodging from '../models/lodging.js';

export const getAllLodgings = async (req, res, next) => {
  try {
    const lodgings = await Lodging.findAll();
    res.json(lodgings);
  } catch (err) {
    next(err);
  }
};

export const getLodgingById = async (req, res, next) => {
  try {
    const lodging = await Lodging.findByPk(req.params.id);
    if (!lodging) return res.status(404).json({ message: 'Not found' });
    res.json(lodging);
  } catch (err) {
    next(err);
  }
};

export const createLodging = async (req, res, next) => {
  try {
    const lodging = await Lodging.create(req.body);
    res.status(201).json(lodging);
  } catch (err) {
    next(err);
  }
};

export const updateLodging = async (req, res, next) => {
  try {
    const lodging = await Lodging.findByPk(req.params.id);
    if (!lodging) return res.status(404).json({ message: 'Not found' });
    await lodging.update(req.body);
    res.json(lodging);
  } catch (err) {
    next(err);
  }
};

export const deleteLodging = async (req, res, next) => {
  try {
    const lodging = await Lodging.findByPk(req.params.id);
    if (!lodging) return res.status(404).json({ message: 'Not found' });
    await lodging.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
