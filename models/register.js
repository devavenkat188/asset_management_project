const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/asset_management_db');

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        unique: true,
    },
    lastName: {
        type: DataTypes.STRING,

    },
    email: {
        type: DataTypes.STRING,
    },
    userName: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
});
module.exports = User;