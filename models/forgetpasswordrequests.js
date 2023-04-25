const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const forgotpasswordrequests = sequelize.define("forgotpasswordrequests", { 
    id: {
        primaryKey: true,
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    isActive: {
        type: Sequelize.DataTypes.BOOLEAN
    }
 });

 module.exports = forgotpasswordrequests;