"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmailQueues', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      to: { type: Sequelize.STRING, allowNull: false },
      subject: { type: Sequelize.STRING, allowNull: false },
      text: { type: Sequelize.TEXT, allowNull: true },
      html: { type: Sequelize.TEXT, allowNull: true },
      attachments: { type: Sequelize.JSON, allowNull: true },
      attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
      lastError: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.STRING, defaultValue: 'queued' },
      scheduledAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmailQueues');
  }
};
