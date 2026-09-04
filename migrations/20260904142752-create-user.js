'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
              allowNull: false,
              primaryKey: true,
              type: Sequelize.UUID,
            },  
            firstName: {
              type: Sequelize.STRING,
              allowNull: false
            },
            lastName: {
              type: Sequelize.STRING,
              allowNull: false
            },
            matricNumber: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
            },
            department: {
              type: Sequelize.STRING,
              allowNull: false
            },
            level: {
              type: Sequelize.STRING,
              allowNull: false
            },
            email: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
            },
            phoneNumber: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
            },  
            password: {
              type: Sequelize.STRING,
              allowNull: false
            },
            role: {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: 'user'
            },
            
            otp: {
              type: Sequelize.STRING,
            },
            otpExpiresAt: {
              type: Sequelize.DATE
            },
            isVerified: {
              type: Sequelize.BOOLEAN,
              defaultValue: false
            },
            passwordReset: {
              type: Sequelize.BOOLEAN,
              defaultValue: false
            },
            loginAttempts: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
              allowNull: false
            },
            lockUntil: {
              type: Sequelize.DATE
            },
            createdAt: {
              type: Sequelize.DATE,
              allowNull: false
            },
            updatedAt: {
              type: Sequelize.DATE,
              allowNull: false
            }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};