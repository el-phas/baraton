import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.js';
import Lodging from './lodging.js';

const LodgingBooking = sequelize.define('LodgingBooking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  lodging_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  guests: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  guest_name: { type: DataTypes.STRING, allowNull: false },
  guest_email: { type: DataTypes.STRING, allowNull: false },
  guest_phone: { type: DataTypes.STRING },
  special_requests: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  reference: { type: DataTypes.STRING },
  // snapshot of lodging details (prefixed with room_)
  room_name: { type: DataTypes.STRING },
  room_type: { type: DataTypes.STRING, defaultValue: 'standard' },
  room_occupancy: { type: DataTypes.STRING },
  room_price: { type: DataTypes.FLOAT },
  room_amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  room_image_urls: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  room_description: { type: DataTypes.TEXT },
}, {
  timestamps: true,
});

User.hasMany(LodgingBooking);
LodgingBooking.belongsTo(User);
Lodging.hasMany(LodgingBooking);
LodgingBooking.belongsTo(Lodging);

export default LodgingBooking;
