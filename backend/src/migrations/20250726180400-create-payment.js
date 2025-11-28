'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      booking_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Bookings', key: 'id' }, onDelete: 'CASCADE' },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: 'pending' },
      reference: { type: Sequelize.STRING, allowNull: false, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payments');
  }
};
