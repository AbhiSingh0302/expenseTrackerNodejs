const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const expense = sequelize.define("userexpenses", { 
    amount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
 });

 module.exports = expense;