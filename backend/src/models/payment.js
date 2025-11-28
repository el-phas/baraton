import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';



const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  booking_id: { type: DataTypes.INTEGER, allowNull: false },
  booking_type: { type: DataTypes.STRING, allowNull: false }, // 'lodging' or 'conference'
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  reference: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

// Polymorphic association: booking_id + booking_type
// No direct association here; handled in business logic

export default Payment;
