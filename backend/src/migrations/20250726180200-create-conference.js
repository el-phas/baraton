'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conferences', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'conference' },
      description: { type: Sequelize.TEXT, allowNull: false },
      price_per_night: { type: Sequelize.FLOAT, allowNull: false },
      capacity: { type: Sequelize.INTEGER, allowNull: false },
      size_sqm: { type: Sequelize.INTEGER, allowNull: false },
      amenities: { type: Sequelize.JSON, allowNull: false },
      image_url: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      available: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conferences');
  }
};
