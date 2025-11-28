import { sequelize } from '../config/db.js';
import User from '../models/user.js';
import Lodging from '../models/lodging.js';
import Conference from '../models/conference.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  // Temporarily disable foreign key checks to allow dropping tables in any order
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.sync({ force: true });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const viewerPassword = await bcrypt.hash('viewer123', 10);
  // Create two admin accounts: admin-a (full edit), admin-b (read-only viewer)
  await User.create({ name: 'admin-a', email: 'admin-a@baraton.com', password: adminPassword, isAdmin: true, role: 'admin' });
  await User.create({ name: 'admin-b', email: 'admin-b@baraton.com', password: viewerPassword, isAdmin: false, role: 'viewer' });
  await Lodging.bulkCreate([
    { name: 'Deluxe Room', description: 'Spacious room with king bed', price: 100, occupancy: '2' },
    { name: 'Standard Room', description: 'Cozy room with queen bed', price: 70, occupancy: '2' }
  ]);
  await Conference.bulkCreate([
    { name: 'Main Hall', description: 'Large conference hall', price: 500, size: 200, max_users: 150 },
    { name: 'Meeting Room', description: 'Small meeting room', price: 200, size: 50, max_users: 30 }
  ]);
  console.log('Database seeded!');
  process.exit();
};

seed();
