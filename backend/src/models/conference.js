import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Conference = sequelize.define('Conference', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false }, // Room size in sqm
  max_users: { type: DataTypes.INTEGER, allowNull: false }, // Maximum users
  amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // array of strings
  image_urls: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // array of strings
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Conferences',
  timestamps: false,
});

export default Conference;
