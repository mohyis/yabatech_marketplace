const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class users extends Model {}

users.init(
  {
    // Model attributes are defined here
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4
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
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'users', // We need to choose the model name
  },
);

module.exports = users

