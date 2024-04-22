
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/asset_management_db');

const Asset_History = sequelize.define("AssetHistory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    issueDate: {
        type: DataTypes.DATE,
    },
    returnDate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.INTEGER,
    },
    scrapDate: {
        type: DataTypes.DATE,
    },
    AssetMasterId: {
        type: DataTypes.INTEGER,
    },
},
{
    // tableName: "Asset_Master",
    timestamps: false,
});
// return Asset_Master;     
module.exports = Asset_History;

 