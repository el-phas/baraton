import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.js';
import Conference from './conference.js';

const ConferenceBooking = sequelize.define('ConferenceBooking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  conference_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false },
  guests: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  guest_name: { type: DataTypes.STRING, allowNull: false },
  guest_email: { type: DataTypes.STRING, allowNull: false },
  guest_phone: { type: DataTypes.STRING },
  special_requests: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  reference: { type: DataTypes.STRING },
  // snapshot of conference details (prefixed with conference_)
  conference_name: { type: DataTypes.STRING },
  conference_price: { type: DataTypes.FLOAT },
  conference_size: { type: DataTypes.INTEGER },
  conference_max_users: { type: DataTypes.INTEGER },
  conference_amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  conference_image_urls: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  conference_description: { type: DataTypes.TEXT },
}, {
  timestamps: true,
});

User.hasMany(ConferenceBooking);
ConferenceBooking.belongsTo(User);
Conference.hasMany(ConferenceBooking);
ConferenceBooking.belongsTo(Conference);

export default ConferenceBooking;
