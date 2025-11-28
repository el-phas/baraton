'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add metadata JSON column and payer_email for compatibility
    await queryInterface.addColumn('Payments', 'metadata', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('Payments', 'payer_email', { type: Sequelize.STRING, allowNull: true });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Payments', 'metadata');
    await queryInterface.removeColumn('Payments', 'payer_email');
  }
};
