const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const order = sequelize.define("order", {
    order_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    purchase_id: {
        type: Sequelize.DataTypes.STRING,
    }
 });

 module.exports = order;