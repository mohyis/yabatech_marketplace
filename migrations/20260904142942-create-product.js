'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
              allowNull: false,
              primaryKey: true,
              type: Sequelize.UUID,
            },  
            userId: {
              type: Sequelize.UUID,
              allowNull: false,
            },
            productName: {
              type: Sequelize.STRING,
              allowNull: false
            },
            category: {
              type: Sequelize.STRING,
              allowNull: false
            },
            condition: {
              type: Sequelize.STRING,
              allowNull: false,
              values: ["new", "used-like new", "used-good condition", "used-fair condition"]
            },
            price: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            description: {
              type: Sequelize.STRING,
              allowNull: false
            },
            image: {
              type: Sequelize.STRING,
              allowNull: false
            },
            imagePublicId: {
              type: Sequelize.STRING,
              allowNull: false
            },
            phoneNumber: {
              type: Sequelize.STRING,
              allowNull: false
            },
            status: {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: "available",
              values: ["available", "sold"]
            },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};