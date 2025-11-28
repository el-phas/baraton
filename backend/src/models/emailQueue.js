import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const EmailQueue = sequelize.define('EmailQueue', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  to: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: true },
  html: { type: DataTypes.TEXT, allowNull: true },
  attachments: { type: DataTypes.JSON, allowNull: true },
  attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastError: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'queued' },
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
});

export default EmailQueue;
