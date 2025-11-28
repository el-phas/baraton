
import  Lodging  from '../models/lodging.js';
import { Sequelize } from 'sequelize';

export const getAnalytics = async (req, res) => {
  try {
    // Monthly analytics: bookings, unique guests, revenue, avg booking value
    const monthly = await Booking.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('check_in_date'), '%Y-%m-01'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_bookings'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('guest_email'))), 'unique_guests'],
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total_revenue'],
        [Sequelize.fn('AVG', Sequelize.col('total_amount')), 'average_booking_value']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('check_in_date'), '%Y-%m-01')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('check_in_date'), '%Y-%m-01'), 'DESC']]
    });

    res.json(monthly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
