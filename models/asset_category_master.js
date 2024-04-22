const { Sequelize, Model, DataTypes } = require('sequelize');
// const {Asset_Master} = require('./asset_master');
const { sequelize } = require('../config/asset_management_db');
const Asset_Category_Master = sequelize.define("AssetCategoryMaster", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    categoryName: {
        type: DataTypes.STRING,
    },
},{
    // tableName: "Asset_Category_Master",
    timestamps: false,
});
module.exports = Asset_Category_Master;
