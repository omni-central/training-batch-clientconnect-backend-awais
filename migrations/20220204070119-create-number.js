"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("numbers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      number: {
        type: Sequelize.STRING,
      },

      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
            key: "id",
          },
        },
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("numbers");
  },
};
