import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  subject: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
});

export default ContactMessage;
