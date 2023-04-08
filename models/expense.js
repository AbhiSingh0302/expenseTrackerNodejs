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
        unique: true
    },
    category: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
 },{
    timestamps: false
 });

 module.exports = expense;