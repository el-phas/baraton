// backend/src/middlewares/authorize.js
// Middleware to require edit (admin) permissions
export const isAdmin = (req, res, next) => {
  const role = req.user?.role;
  const legacy = req.user?.isAdmin;
  if (role === 'admin' || legacy === true) return next();
  return res.status(403).json({ message: 'Admin (edit) access required' });
};

// Middleware to allow viewers and admins to read data
export const canView = (req, res, next) => {
  const role = req.user?.role;
  const legacy = req.user?.isAdmin;
  if (role === 'admin' || role === 'viewer' || legacy === true) return next();
  return res.status(403).json({ message: 'View access required' });
};
