import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Lodging = sequelize.define('Lodging', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'standard' },
  occupancy: { type: DataTypes.STRING, allowNull: false }, // replaces capacity
  price: { type: DataTypes.FLOAT, allowNull: false }, // replaces price_per_night
  amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // array of strings
  image_urls: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // array of strings
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Lodgings',
  timestamps: false,
});

export default Lodging;
