const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

const user = require('./user');

class products extends Model {}

products.init(
  {
    // Model attributes are defined here
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4
      },  
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: 'CASCADE'
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
        type: Sequelize.NUMBER,
        allowNull: false,
        defaultValue: 500
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
        
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'products', // We need to choose the model name
  },
);

user.hasMany(products, { foreignKey: 'userId', as: 'products' });
products.belongsTo(user, { foreignKey: 'userId', as: 'user' });

module.exports = products



