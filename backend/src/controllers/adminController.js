
// Get admin details (email, name)
export const getAdminDetails = async (req, res, next) => {
  try {
    // Return the authenticated user's public info including role
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};
import User from '../models/user.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
